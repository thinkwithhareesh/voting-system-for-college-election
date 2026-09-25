import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'voting_system.db');

let db;
try {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
} catch (err) {
  console.warn('SQLite native module error, using in-memory SQLite database:', err.message);
  db = new Database(':memory:');
}

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS positions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_order INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    position_id TEXT NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    candidate_class TEXT NOT NULL,
    image_url TEXT,
    symbol_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(position_id) REFERENCES positions(id)
  );

  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    president_id TEXT NOT NULL,
    vice_president_id TEXT NOT NULL,
    secretary_id TEXT NOT NULL,
    joint_secretary_id TEXT NOT NULL,
    treasurer_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS election_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    started_at DATETIME,
    closed_at DATETIME
  );
`);

// Insert default settings if empty
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM election_settings').get();
if (settingsCount.count === 0) {
  db.prepare("INSERT INTO election_settings (id, status, started_at) VALUES (1, 'ACTIVE', CURRENT_TIMESTAMP)").run();
}

// Insert default admin if empty
const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get();
if (adminCount.count === 0) {
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', 'msecmca');
}

// Insert position definitions
const posCount = db.prepare('SELECT COUNT(*) as count FROM positions').get();
if (posCount.count === 0) {
  const insertPos = db.prepare('INSERT INTO positions (id, name, display_order) VALUES (?, ?, ?)');
  insertPos.run('president', 'President', 1);
  insertPos.run('vice_president', 'Vice President', 2);
  insertPos.run('secretary', 'Secretary', 3);
  insertPos.run('joint_secretary', 'Joint Secretary', 4);
  insertPos.run('treasurer', 'Treasurer', 5);
}

// Seed default candidates if empty
const candidateCount = db.prepare('SELECT COUNT(*) as count FROM candidates').get();
if (candidateCount.count === 0) {
  const insertCandidate = db.prepare(`
    INSERT INTO candidates (id, position_id, name, department, candidate_class, image_url, symbol_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const initialCandidates = [
    // President (3)
    { id: 'pres-1', position_id: 'president', name: 'JAVITH NAZEEM N', department: 'MCA', candidate_class: 'MCA 2nd Year', image_url: '/uploads/javith_nazeem.jpg', symbol_url: '🎓' },
    { id: 'pres-2', position_id: 'president', name: 'LOGA SURIYA A', department: 'MCA', candidate_class: 'MCA 2nd Year', image_url: '/uploads/loga_suriya.jpg', symbol_url: '🚀' },
    { id: 'pres-3', position_id: 'president', name: 'SILMIYA SHIFA', department: 'MCA', candidate_class: 'MCA 2nd Year', image_url: '/uploads/silmiya_shifa.png', symbol_url: '🌟' },

    // Vice President (3)
    { id: 'vp-1', position_id: 'vice_president', name: 'S.ABDULLA SULTHAN', department: 'MCA', candidate_class: 'MCA 1st Year', image_url: '/uploads/abdulla_sulthan.png', symbol_url: '⚡' },
    { id: 'vp-2', position_id: 'vice_president', name: 'M. WAFA', department: 'MCA', candidate_class: 'MCA 1st Year', image_url: '/uploads/m_wafa.jpg', symbol_url: '🏆' },
    { id: 'vp-3', position_id: 'vice_president', name: 'JAI SURIYA', department: 'MCA', candidate_class: 'MCA 1st Year', image_url: '/uploads/jai_suriya.png', symbol_url: '🔥' },

    // Secretary (2)
    { id: 'sec-1', position_id: 'secretary', name: 'S. JEYABHARATHI', department: 'MCA', candidate_class: 'MCA 2nd Year', image_url: '/uploads/jeyabharathi.png', symbol_url: '📚' },
    { id: 'sec-2', position_id: 'secretary', name: 'HAREESH', department: 'MCA', candidate_class: 'MCA 2nd Year', image_url: '/uploads/hareesh.png', symbol_url: '💡' },

    // Joint Secretary (2)
    { id: 'jsec-1', position_id: 'joint_secretary', name: 'AYSWARYA', department: 'MCA', candidate_class: 'MCA 1st Year', image_url: '/uploads/ayswarya.png', symbol_url: '🛡️' },
    { id: 'jsec-2', position_id: 'joint_secretary', name: 'N. MAKESH', department: 'MCA', candidate_class: 'MCA 1st Year', image_url: '/uploads/n_makesh.jpg', symbol_url: '🌿' },

    // Treasurer / Treasure Coordinator (4)
    { id: 'tre-1', position_id: 'treasurer', name: 'R. KIRUTHIKA', department: 'MCA', candidate_class: 'MCA 2nd Year', image_url: '/uploads/r_kiruthika.png', symbol_url: '💰' },
    { id: 'tre-2', position_id: 'treasurer', name: 'B. SANDHIYA', department: 'MCA', candidate_class: 'MCA 1st Year', image_url: '/uploads/b_sandhiya.png', symbol_url: '⚖️' },
    { id: 'tre-3', position_id: 'treasurer', name: 'S. DHARSHINI', department: 'MCA', candidate_class: 'MCA 2nd Year', image_url: '/uploads/s_dharshini.jpg', symbol_url: '🎯' },
    { id: 'tre-4', position_id: 'treasurer', name: 'SHAJIRA', department: 'MCA', candidate_class: 'MCA 1st Year', image_url: '/uploads/shajira.png', symbol_url: '💎' }
  ];

  for (const c of initialCandidates) {
    insertCandidate.run(c.id, c.position_id, c.name, c.department, c.candidate_class, c.image_url, c.symbol_url);
  }
}

export default db;
