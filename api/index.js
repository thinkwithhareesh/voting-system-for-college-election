import express from 'express';
import cors from 'cors';
import db from '../server/db.js';

const app = express();

app.use(cors());
app.use(express.json());

// 1. Get Election Status
app.get('/api/election-status', (req, res) => {
  try {
    const settings = db.prepare('SELECT status FROM election_settings WHERE id = 1').get();
    res.json({ status: settings ? settings.status : 'ACTIVE' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve election status' });
  }
});

// Update Election Status (Admin)
app.post('/api/admin/election-status', (req, res) => {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'PAUSED', 'CLOSED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid election status' });
    }
    db.prepare('UPDATE election_settings SET status = ? WHERE id = 1').run(status);
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update election status' });
  }
});

// 2. Get All Candidates
app.get('/api/candidates', (req, res) => {
  try {
    const candidates = db.prepare(`
      SELECT c.*, p.name as position_name 
      FROM candidates c 
      JOIN positions p ON c.position_id = p.id 
      ORDER BY p.display_order ASC, c.name ASC
    `).all();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// Add Candidate (Admin)
app.post('/api/candidates', (req, res) => {
  try {
    const { position_id, name, department, candidate_class, image_url, symbol_url } = req.body;
    if (!position_id || !name || !department) {
      return res.status(400).json({ error: 'Missing required candidate fields' });
    }

    const id = 'cand-' + Date.now();
    const defaultImage = image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
    const defaultSymbol = symbol_url || '🌟';

    db.prepare(`
      INSERT INTO candidates (id, position_id, name, department, candidate_class, image_url, symbol_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, position_id, name, department, candidate_class || 'MCA', defaultImage, defaultSymbol);

    const newCandidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id);
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add candidate' });
  }
});

// Edit Candidate (Admin)
app.put('/api/candidates/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { position_id, name, department, candidate_class, image_url, symbol_url } = req.body;

    db.prepare(`
      UPDATE candidates 
      SET position_id = ?, name = ?, department = ?, candidate_class = ?, image_url = ?, symbol_url = ?
      WHERE id = ?
    `).run(position_id, name, department, candidate_class, image_url, symbol_url, id);

    const updated = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

// Delete Candidate (Admin)
app.delete('/api/candidates/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM candidates WHERE id = ?').run(id);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

// 3. Submit Student Vote
app.post('/api/votes', (req, res) => {
  try {
    const settings = db.prepare('SELECT status FROM election_settings WHERE id = 1').get();
    if (settings && settings.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Voting is currently closed or paused.' });
    }

    const { president_id, vice_president_id, secretary_id, joint_secretary_id, treasurer_id } = req.body;
    if (!president_id || !vice_president_id || !secretary_id || !joint_secretary_id || !treasurer_id) {
      return res.status(400).json({ error: 'Please select a candidate for every position.' });
    }

    const stmt = db.prepare(`
      INSERT INTO votes (president_id, vice_president_id, secretary_id, joint_secretary_id, treasurer_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(president_id, vice_president_id, secretary_id, joint_secretary_id, treasurer_id);

    res.status(201).json({ success: true, vote_id: result.lastInsertRowid });
  } catch (error) {
    console.error('Vote submission error:', error);
    res.status(500).json({ error: 'Something went wrong while submitting your vote. Please try again.' });
  }
});

// 4. Admin Analytics & Results
app.get('/api/admin/results', (req, res) => {
  try {
    const totalVotesRow = db.prepare('SELECT COUNT(*) as count FROM votes').get();
    const totalVotes = totalVotesRow.count;

    const candidates = db.prepare(`
      SELECT c.*, p.name as position_name, p.display_order
      FROM candidates c 
      JOIN positions p ON c.position_id = p.id 
      ORDER BY p.display_order ASC
    `).all();

    const votes = db.prepare('SELECT * FROM votes').all();

    const voteCounts = {};
    candidates.forEach(c => voteCounts[c.id] = 0);

    votes.forEach(v => {
      if (v.president_id && voteCounts[v.president_id] !== undefined) voteCounts[v.president_id]++;
      if (v.vice_president_id && voteCounts[v.vice_president_id] !== undefined) voteCounts[v.vice_president_id]++;
      if (v.secretary_id && voteCounts[v.secretary_id] !== undefined) voteCounts[v.secretary_id]++;
      if (v.joint_secretary_id && voteCounts[v.joint_secretary_id] !== undefined) voteCounts[v.joint_secretary_id]++;
      if (v.treasurer_id && voteCounts[v.treasurer_id] !== undefined) voteCounts[v.treasurer_id]++;
    });

    const positions = [
      { id: 'president', name: 'President' },
      { id: 'vice_president', name: 'Vice President' },
      { id: 'secretary', name: 'Secretary' },
      { id: 'joint_secretary', name: 'Joint Secretary' },
      { id: 'treasurer', name: 'Treasurer' }
    ];

    const results = positions.map(pos => {
      const posCandidates = candidates
        .filter(c => c.position_id === pos.id)
        .map(c => {
          const count = voteCounts[c.id] || 0;
          const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : '0.0';
          return {
            ...c,
            vote_count: count,
            percentage: parseFloat(percentage)
          };
        })
        .sort((a, b) => b.vote_count - a.vote_count);

      const posTotalVotes = posCandidates.reduce((acc, curr) => acc + curr.vote_count, 0);

      return {
        position_id: pos.id,
        position_name: pos.name,
        total_votes: posTotalVotes,
        candidates: posCandidates
      };
    });

    const settings = db.prepare('SELECT status FROM election_settings WHERE id = 1').get();

    res.json({
      total_votes: totalVotes,
      status: settings ? settings.status : 'ACTIVE',
      results
    });
  } catch (error) {
    console.error('Error calculating results:', error);
    res.status(500).json({ error: 'Failed to generate results' });
  }
});

// 5. Admin Login
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = db.prepare('SELECT * FROM admins WHERE username = ? AND password = ?').get(username, password);

    if (admin) {
      res.json({ success: true, token: 'demo-admin-token-' + Date.now(), username: admin.username });
    } else {
      res.status(401).json({ error: 'Invalid admin username or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
});

// 6. Reset Election Data (Admin)
app.post('/api/admin/reset-election', (req, res) => {
  try {
    db.prepare('DELETE FROM votes').run();
    res.json({ success: true, message: 'Election vote data reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset election data' });
  }
});

export default app;
