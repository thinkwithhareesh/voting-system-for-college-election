import React, { useState, useEffect } from 'react';
import { useElection, POSITIONS } from '../context/ElectionContext';
import { CandidateModal } from '../components/CandidateModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Download, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  CheckCircle2, 
  ShieldAlert, 
  Lock,
  Menu,
  X,
  FileSpreadsheet,
  FileText,
  Vote,
  Trophy,
  Award,
  Crown,
  Printer
} from 'lucide-react';

export const AdminDashboard = ({ onClose }) => {
  const { logoutAdmin, updateElectionStatus, refreshData } = useElection();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [resultsData, setResultsData] = useState(null);
  const [loadingResults, setLoadingResults] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Candidate Modal state
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  // Confirmation Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [resetModalStep, setResetModalStep] = useState(0); // 0 = closed, 1 = first warn, 2 = final warn

  // Fetch admin results API
  const loadResults = async () => {
    setLoadingResults(true);
    try {
      const res = await fetch('/api/admin/results');
      if (res.ok) {
        const data = await res.json();
        setResultsData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  // Candidate Actions
  const handleSaveCandidate = async (formData) => {
    try {
      const url = editingCandidate 
        ? `/api/candidates/${editingCandidate.id}`
        : '/api/candidates';
      const method = editingCandidate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setCandidateModalOpen(false);
        setEditingCandidate(null);
        await refreshData();
        await loadResults();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCandidateConfirm = async () => {
    if (!candidateToDelete) return;
    try {
      const res = await fetch(`/api/candidates/${candidateToDelete.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDeleteModalOpen(false);
        setCandidateToDelete(null);
        await refreshData();
        await loadResults();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Election Status Action
  const handleStatusChange = async (newStatus) => {
    const ok = await updateElectionStatus(newStatus);
    if (ok) {
      await loadResults();
    }
  };

  // Reset Data Action
  const handleResetDataFinal = async () => {
    try {
      const res = await fetch('/api/admin/reset-election', { method: 'POST' });
      if (res.ok) {
        setResetModalStep(0);
        await refreshData();
        await loadResults();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export to CSV
  const exportCSV = () => {
    if (!resultsData) return;
    let csv = 'Position,Candidate Name,Department,Class,Symbol,Vote Count,Percentage (%)\n';

    resultsData.results.forEach(pos => {
      pos.candidates.forEach(cand => {
        csv += `"${pos.position_name}","${cand.name}","${cand.department}","${cand.candidate_class}","${cand.symbol_url || ''}",${cand.vote_count},${cand.percentage}%\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MSEC_MCA_Election_Results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF / Printable View
  const exportPDF = () => {
    window.print();
  };

  // Winner Helper Calculations
  const getWinner = (positionId) => {
    const pos = resultsData?.results?.find(r => r.position_id === positionId);
    if (!pos || !pos.candidates.length) return null;
    return pos.candidates[0]; // Highest votes candidate
  };

  const getTop3Treasurers = () => {
    const pos = resultsData?.results?.find(r => r.position_id === 'treasurer');
    if (!pos || !pos.candidates.length) return [];
    return pos.candidates.slice(0, 3); // Top 3 candidates with highest votes
  };

  return (
    <div className="min-h-screen bg-[#F7F8E8] flex flex-col md:flex-row print:bg-white print:text-black">
      
      {/* Mobile Top Nav Bar */}
      <div className="md:hidden bg-white border-b border-[#DDE4D8] p-4 flex items-center justify-between sticky top-0 z-30 print:hidden">
        <div className="flex items-center space-x-2 text-[#174D3A] font-extrabold">
          <Vote className="w-5 h-5 text-[#2F7659]" />
          <span className="text-sm">MSEC MCA Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-[#F7F8E8] text-[#174D3A] border border-[#DDE4D8]"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#DDE4D8] p-6 transform transition-transform duration-200 md:relative md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      } flex flex-col justify-between print:hidden`}>
        
        <div>
          {/* Admin Header */}
          <div className="flex items-center space-x-3 pb-6 border-b border-[#DDE4D8]">
            <div className="w-10 h-10 rounded-2xl bg-[#174D3A] text-white flex items-center justify-center font-bold shadow-md">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#174D3A]">Admin Panel</h2>
              <p className="text-xs text-[#718078]">Mohammad Sathak Engg</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === 'overview' ? 'bg-[#174D3A] text-white' : 'text-[#294238] hover:bg-[#F7F8E8]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('winners'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === 'winners' ? 'bg-[#174D3A] text-white shadow-sm' : 'text-[#174D3A] bg-[#DCEBDD] hover:bg-[#174D3A] hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>🏆 WINNERS LIST</span>
            </button>

            <button
              onClick={() => { setActiveTab('candidates'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === 'candidates' ? 'bg-[#174D3A] text-white' : 'text-[#294238] hover:bg-[#F7F8E8]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Candidates</span>
            </button>

            <div className="pt-3 pb-1 text-[11px] font-black uppercase tracking-wider text-[#718078] px-4">
              Position Results
            </div>

            {POSITIONS.map(pos => (
              <button
                key={pos.id}
                onClick={() => { setActiveTab(`res-${pos.id}`); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors ${
                  activeTab === `res-${pos.id}` ? 'bg-[#DCEBDD] text-[#174D3A] font-extrabold' : 'text-[#718078] hover:bg-[#F7F8E8]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#2F7659]"></span>
                <span>{pos.label}</span>
              </button>
            ))}

            <div className="pt-3 pb-1 text-[11px] font-black uppercase tracking-wider text-[#718078] px-4">
              Controls & Data
            </div>

            <button
              onClick={() => { setActiveTab('controls'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === 'controls' ? 'bg-[#174D3A] text-white' : 'text-[#294238] hover:bg-[#F7F8E8]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Election Control</span>
            </button>

            <button
              onClick={() => { setActiveTab('export'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === 'export' ? 'bg-[#174D3A] text-white' : 'text-[#294238] hover:bg-[#F7F8E8]'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Export Results</span>
            </button>
          </nav>
        </div>

        {/* Logout & Exit */}
        <div className="pt-6 border-t border-[#DDE4D8] space-y-2">
          <button
            onClick={() => { onClose(); }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-[#DDE4D8] font-bold text-xs text-[#294238] hover:bg-[#F7F8E8]"
          >
            <span>Exit Dashboard</span>
          </button>

          <button
            onClick={() => { logoutAdmin(); onClose(); }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-extrabold text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto print:p-0">
        
        {/* Top Title Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-[#DDE4D8] shadow-sm print:hidden">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F7659] bg-[#DCEBDD] px-2.5 py-0.5 rounded-md">
                Admin Console
              </span>
              <span className="text-xs text-[#718078]">Mohammad Sathak Engg College - MCA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#174D3A]">
              {activeTab === 'overview' && 'Election Overview & Analytics'}
              {activeTab === 'winners' && '🏆 Official Winners Announcement'}
              {activeTab === 'candidates' && 'Candidate Management'}
              {activeTab.startsWith('res-') && `${POSITIONS.find(p => `res-${p.id}` === activeTab)?.label} Results`}
              {activeTab === 'controls' && 'Election Control & Data Reset'}
              {activeTab === 'export' && 'Export Election Results'}
            </h1>
          </div>

          {/* Election Status Badge */}
          <div className="flex items-center space-x-2 bg-[#F7F8E8] px-4 py-2 rounded-2xl border border-[#DDE4D8]">
            <span className="text-xs font-bold text-[#718078]">Status:</span>
            {resultsData?.status === 'ACTIVE' && (
              <span className="inline-flex items-center space-x-1.5 text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>🟢 ACTIVE</span>
              </span>
            )}
            {resultsData?.status === 'PAUSED' && (
              <span className="inline-flex items-center space-x-1.5 text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                <span>🟡 PAUSED</span>
              </span>
            )}
            {resultsData?.status === 'CLOSED' && (
              <span className="inline-flex items-center space-x-1.5 text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                <span>🔴 CLOSED</span>
              </span>
            )}
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Winners Banner Trigger */}
            <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0">
                  <Trophy className="w-8 h-8 text-yellow-200" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Official Election Winners List</h3>
                  <p className="text-xs text-amber-100 mt-1">Calculated automatically from highest votes recorded per position.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('winners')}
                className="px-6 py-3 rounded-2xl bg-white text-amber-800 font-extrabold text-sm shadow-md hover:bg-amber-50 transition-all flex items-center space-x-2"
              >
                <span>VIEW WINNERS REPORT</span>
                <Crown className="w-4 h-4 text-amber-600" />
              </button>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="col-span-2 bg-gradient-to-br from-[#174D3A] to-[#2F7659] text-white p-6 rounded-3xl shadow-soft">
                <p className="text-xs font-bold uppercase tracking-wider text-[#DCEBDD]">TOTAL VOTES CAST</p>
                <h3 className="text-4xl font-black mt-2 tracking-tight">
                  {resultsData ? resultsData.total_votes.toLocaleString() : '0'}
                </h3>
                <p className="text-xs text-[#DCEBDD]/80 mt-2">Verified unique voting transactions</p>
              </div>

              {POSITIONS.map(pos => {
                const posData = resultsData?.results?.find(r => r.position_id === pos.id);
                return (
                  <div key={pos.id} className="bg-white p-5 rounded-3xl border border-[#DDE4D8] shadow-sm">
                    <p className="text-[11px] font-bold text-[#718078] uppercase truncate">{pos.label}</p>
                    <h4 className="text-2xl font-black text-[#174D3A] mt-1">
                      {posData ? posData.total_votes.toLocaleString() : '0'}
                    </h4>
                    <p className="text-[11px] text-[#2F7659] font-bold mt-1">Votes Recorded</p>
                  </div>
                );
              })}
            </div>

            {/* Live Results Summary Cards per position */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {POSITIONS.map(pos => {
                const posData = resultsData?.results?.find(r => r.position_id === pos.id);
                return (
                  <div key={pos.id} className="bg-white p-6 rounded-3xl border border-[#DDE4D8] shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-[#DDE4D8]">
                      <h3 className="text-lg font-black text-[#174D3A]">{pos.title}</h3>
                      <span className="text-xs font-extrabold text-[#2F7659] bg-[#DCEBDD] px-2.5 py-1 rounded-lg">
                        {posData?.total_votes || 0} Votes
                      </span>
                    </div>

                    <div className="mt-4 space-y-4">
                      {posData?.candidates.map(cand => (
                        <div key={cand.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <div className="flex items-center space-x-2">
                              <span>{cand.symbol_url}</span>
                              <span className="text-[#174D3A] font-extrabold">{cand.name}</span>
                            </div>
                            <span className="text-[#2F7659]">{cand.vote_count} votes ({cand.percentage}%)</span>
                          </div>
                          
                          {/* Animated Progress Bar */}
                          <div className="w-full h-3 bg-[#F7F8E8] rounded-full overflow-hidden border border-[#DDE4D8]">
                            <div 
                              className="h-full bg-gradient-to-r from-[#2F7659] to-[#174D3A] transition-all duration-500 rounded-full"
                              style={{ width: `${Math.max(cand.percentage, 2)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 🏆 WINNERS LIST REPORT TAB */}
        {(activeTab === 'winners' || activeTab === 'print-winners') && (
          <div className="space-y-8">
            
            {/* Header Actions */}
            <div className="flex items-center justify-between print:hidden">
              <p className="text-sm font-semibold text-[#718078]">
                Official Election Winners generated from highest vote totals for each position.
              </p>
              <button
                onClick={exportPDF}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[#174D3A] hover:bg-[#2F7659] text-white font-extrabold text-sm shadow-md transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT / SAVE WINNERS REPORT (PDF)</span>
              </button>
            </div>

            {/* Official Report Document */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DDE4D8] shadow-soft space-y-8 print:p-0 print:border-none print:shadow-none">
              
              {/* Institution Document Header */}
              <div className="text-center pb-6 border-b border-[#DDE4D8]">
                <span className="text-xs font-black uppercase tracking-widest text-[#2F7659] bg-[#DCEBDD] px-3 py-1 rounded-full">
                  OFFICIAL ELECTION REPORT 2026
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#174D3A] mt-3">
                  Mohammad Sathak Engineering College Keelakarai
                </h1>
                <p className="text-base font-bold text-[#2F7659] mt-1">
                  Master of Computer Application (MCA) Election
                </p>
                <p className="text-xs text-[#718078] mt-2">
                  Total Verified Votes Cast: <span className="font-extrabold text-[#174D3A]">{resultsData?.total_votes || 0}</span> • Developed by Hareesh (2025-2027 batch)
                </p>
              </div>

              {/* Single Winners Grid (President, Vice President, Secretary, Joint Secretary) */}
              <div>
                <h3 className="text-xs font-black text-[#2F7659] uppercase tracking-widest mb-4">
                  Single Post Executive Winners (Highest Votes)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* President Winner */}
                  {(() => {
                    const win = getWinner('president');
                    return (
                      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center space-x-4 relative overflow-hidden">
                        <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-full text-xs shadow">
                          <Crown className="w-4 h-4" />
                        </div>
                        <img src={win?.image_url} alt={win?.name} className="w-16 h-16 rounded-2xl object-contain bg-white p-1 border border-amber-300" />
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                            PRESIDENT WINNER 🏆
                          </span>
                          <h4 className="text-lg font-black text-[#174D3A] mt-0.5">{win?.name || 'N/A'}</h4>
                          <p className="text-xs text-[#718078] font-bold">{win?.department} • {win?.candidate_class}</p>
                          <p className="text-xs text-amber-900 font-extrabold mt-1">{win?.vote_count || 0} Votes ({win?.percentage || 0}%)</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Vice President Winner */}
                  {(() => {
                    const win = getWinner('vice_president');
                    return (
                      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center space-x-4 relative overflow-hidden">
                        <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-full text-xs shadow">
                          <Crown className="w-4 h-4" />
                        </div>
                        <img src={win?.image_url} alt={win?.name} className="w-16 h-16 rounded-2xl object-contain bg-white p-1 border border-amber-300" />
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                            VICE PRESIDENT WINNER 🏆
                          </span>
                          <h4 className="text-lg font-black text-[#174D3A] mt-0.5">{win?.name || 'N/A'}</h4>
                          <p className="text-xs text-[#718078] font-bold">{win?.department} • {win?.candidate_class}</p>
                          <p className="text-xs text-amber-900 font-extrabold mt-1">{win?.vote_count || 0} Votes ({win?.percentage || 0}%)</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Secretary Winner */}
                  {(() => {
                    const win = getWinner('secretary');
                    return (
                      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center space-x-4 relative overflow-hidden">
                        <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-full text-xs shadow">
                          <Crown className="w-4 h-4" />
                        </div>
                        <img src={win?.image_url} alt={win?.name} className="w-16 h-16 rounded-2xl object-contain bg-white p-1 border border-amber-300" />
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                            SECRETARY WINNER 🏆
                          </span>
                          <h4 className="text-lg font-black text-[#174D3A] mt-0.5">{win?.name || 'N/A'}</h4>
                          <p className="text-xs text-[#718078] font-bold">{win?.department} • {win?.candidate_class}</p>
                          <p className="text-xs text-amber-900 font-extrabold mt-1">{win?.vote_count || 0} Votes ({win?.percentage || 0}%)</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Joint Secretary Winner */}
                  {(() => {
                    const win = getWinner('joint_secretary');
                    return (
                      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center space-x-4 relative overflow-hidden">
                        <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-full text-xs shadow">
                          <Crown className="w-4 h-4" />
                        </div>
                        <img src={win?.image_url} alt={win?.name} className="w-16 h-16 rounded-2xl object-contain bg-white p-1 border border-amber-300" />
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                            JOINT SECRETARY WINNER 🏆
                          </span>
                          <h4 className="text-lg font-black text-[#174D3A] mt-0.5">{win?.name || 'N/A'}</h4>
                          <p className="text-xs text-[#718078] font-bold">{win?.department} • {win?.candidate_class}</p>
                          <p className="text-xs text-amber-900 font-extrabold mt-1">{win?.vote_count || 0} Votes ({win?.percentage || 0}%)</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Treasurer Coordinator - TOP 3 CANDIDATES */}
              <div className="pt-4 border-t border-[#DDE4D8]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-[#2F7659] uppercase tracking-widest">
                    Treasurer Coordinator — Top 3 Winners (Highest Votes)
                  </h3>
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                    Top 3 Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getTop3Treasurers().map((cand, idx) => (
                    <div key={cand.id} className="p-5 rounded-2xl bg-[#F7F8E8] border border-[#DDE4D8] relative flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-[#174D3A] text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                        #{idx + 1}
                      </div>
                      <img src={cand.image_url} alt={cand.name} className="w-14 h-14 rounded-2xl object-contain bg-white p-1 border border-[#DDE4D8]" />
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#2F7659]">
                          Rank #{idx + 1} Winner
                        </span>
                        <h4 className="text-base font-black text-[#174D3A] mt-0.5">{cand.name}</h4>
                        <p className="text-xs text-[#718078]">{cand.department} • {cand.candidate_class}</p>
                        <p className="text-xs font-black text-[#174D3A] mt-1">{cand.vote_count} Votes ({cand.percentage}%)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Stamp & Sign Off Footer */}
              <div className="pt-8 border-t border-[#DDE4D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#718078]">
                <div>
                  <p>Certified Official Election Report</p>
                  <p className="text-[#174D3A] font-extrabold">Mohammad Sathak Engineering College Keelakarai</p>
                </div>
                <div className="text-center sm:text-right">
                  <p>System Developed by</p>
                  <p className="text-[#174D3A] font-extrabold">Hareesh (2025-2027 batch)</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. CANDIDATES TAB */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#718078]">
                Manage all registered election candidates for Mohammad Sathak Engineering College.
              </p>
              <button
                onClick={() => { setEditingCandidate(null); setCandidateModalOpen(true); }}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[#174D3A] hover:bg-[#2F7659] text-white font-extrabold text-sm shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW CANDIDATE</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#DDE4D8] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F8E8] border-b border-[#DDE4D8] text-xs font-black text-[#174D3A] uppercase tracking-wider">
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Position</th>
                      <th className="p-4">Dept / Class</th>
                      <th className="p-4">Symbol</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDE4D8] text-sm">
                    {useElection().candidates.map(cand => (
                      <tr key={cand.id} className="hover:bg-[#F7F8E8]/50 transition-colors">
                        <td className="p-4 flex items-center space-x-3">
                          <img 
                            src={cand.image_url} 
                            alt={cand.name}
                            className="w-10 h-10 rounded-full object-contain bg-[#F7F8E8] p-0.5 border border-[#DDE4D8]"
                          />
                          <span className="font-extrabold text-[#174D3A]">{cand.name}</span>
                        </td>
                        <td className="p-4 font-bold text-[#2F7659] uppercase text-xs">
                          {POSITIONS.find(p => p.id === cand.position_id)?.label || cand.position_id}
                        </td>
                        <td className="p-4 text-[#718078] font-medium text-xs">
                          {cand.department} • {cand.candidate_class}
                        </td>
                        <td className="p-4 text-xl">
                          {cand.symbol_url}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => { setEditingCandidate(cand); setCandidateModalOpen(true); }}
                            className="p-2 rounded-xl bg-[#F7F8E8] hover:bg-[#DCEBDD] text-[#174D3A] border border-[#DDE4D8]"
                            title="Edit candidate"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setCandidateToDelete(cand); setDeleteModalOpen(true); }}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                            title="Delete candidate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. POSITION SPECIFIC RESULTS TAB */}
        {activeTab.startsWith('res-') && (
          <div className="space-y-6">
            {(() => {
              const posId = activeTab.replace('res-', '');
              const posObj = POSITIONS.find(p => p.id === posId);
              const posData = resultsData?.results?.find(r => r.position_id === posId);

              return (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE4D8] shadow-sm">
                  <div className="flex items-center justify-between pb-6 border-b border-[#DDE4D8]">
                    <div>
                      <h2 className="text-2xl font-black text-[#174D3A]">{posObj?.title}</h2>
                      <p className="text-xs text-[#718078]">Detailed Candidate Breakdown</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#174D3A]">{posData?.total_votes || 0}</span>
                      <p className="text-xs text-[#718078]">Total Position Votes</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    {posData?.candidates.map((cand, idx) => (
                      <div key={cand.id} className="p-5 rounded-2xl bg-[#F7F8E8] border border-[#DDE4D8] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-4 w-full sm:w-auto">
                          <span className="w-8 h-8 rounded-full bg-[#174D3A] text-white flex items-center justify-center font-black text-xs">
                            #{idx + 1}
                          </span>
                          <img src={cand.image_url} alt={cand.name} className="w-14 h-14 rounded-2xl object-contain bg-white p-1 border border-[#DDE4D8]" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-black text-[#174D3A]">{cand.name}</h4>
                              <span>{cand.symbol_url}</span>
                            </div>
                            <p className="text-xs text-[#718078]">{cand.department} • {cand.candidate_class}</p>
                          </div>
                        </div>

                        <div className="w-full sm:w-64 space-y-1">
                          <div className="flex justify-between text-xs font-bold text-[#174D3A]">
                            <span>{cand.vote_count} Votes</span>
                            <span>{cand.percentage}%</span>
                          </div>
                          <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-[#DDE4D8]">
                            <div 
                              className="h-full bg-[#174D3A] transition-all duration-500 rounded-full"
                              style={{ width: `${Math.max(cand.percentage, 2)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 4. ELECTION CONTROL TAB */}
        {activeTab === 'controls' && (
          <div className="max-w-3xl space-y-8">
            {/* Status Control Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE4D8] shadow-sm">
              <h3 className="text-xl font-black text-[#174D3A]">Election Status Control</h3>
              <p className="text-xs text-[#718078] mt-1">Start, pause, or close student voting in real-time.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <button
                  onClick={() => handleStatusChange('ACTIVE')}
                  className={`p-5 rounded-2xl font-extrabold text-sm border flex flex-col items-center justify-center space-y-2 transition-all ${
                    resultsData?.status === 'ACTIVE'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
                      : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <Play className="w-6 h-6" />
                  <span>START ELECTION</span>
                </button>

                <button
                  onClick={() => handleStatusChange('PAUSED')}
                  className={`p-5 rounded-2xl font-extrabold text-sm border flex flex-col items-center justify-center space-y-2 transition-all ${
                    resultsData?.status === 'PAUSED'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                      : 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <Pause className="w-6 h-6" />
                  <span>PAUSE ELECTION</span>
                </button>

                <button
                  onClick={() => handleStatusChange('CLOSED')}
                  className={`p-5 rounded-2xl font-extrabold text-sm border flex flex-col items-center justify-center space-y-2 transition-all ${
                    resultsData?.status === 'CLOSED'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-300'
                      : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50'
                  }`}
                >
                  <Square className="w-6 h-6" />
                  <span>CLOSE ELECTION</span>
                </button>
              </div>
            </div>

            {/* Danger Zone: Reset Election */}
            <div className="bg-red-50/70 p-6 sm:p-8 rounded-3xl border border-red-200 shadow-sm">
              <div className="flex items-center space-x-3 text-red-700 mb-2">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="text-xl font-black">Danger Zone: Reset Election Data</h3>
              </div>
              <p className="text-xs text-red-600 leading-relaxed">
                Permanently deletes all recorded student votes from the database. This action requires double confirmation and cannot be undone.
              </p>

              <div className="mt-6">
                <button
                  onClick={() => setResetModalStep(1)}
                  className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RESET ELECTION VOTES</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. EXPORT TAB */}
        {activeTab === 'export' && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-[#DDE4D8] shadow-sm">
            <h3 className="text-xl font-black text-[#174D3A]">Export Official Results & Winners Report</h3>
            <p className="text-xs text-[#718078] mt-1">Download clean report datasets or print the official winners list document.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <button
                onClick={exportCSV}
                className="p-6 rounded-2xl bg-[#F7F8E8] hover:bg-[#DCEBDD] border border-[#DDE4D8] text-[#174D3A] font-extrabold text-sm flex flex-col items-center justify-center space-y-3 transition-colors"
              >
                <FileSpreadsheet className="w-8 h-8 text-[#2F7659]" />
                <span>Export CSV Spreadsheet</span>
              </button>

              <button
                onClick={() => { setActiveTab('winners'); setTimeout(exportPDF, 300); }}
                className="p-6 rounded-2xl bg-[#F7F8E8] hover:bg-[#DCEBDD] border border-[#DDE4D8] text-[#174D3A] font-extrabold text-sm flex flex-col items-center justify-center space-y-3 transition-colors"
              >
                <FileText className="w-8 h-8 text-[#2F7659]" />
                <span>Print / Save PDF Report</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Candidate Modal (Add / Edit) */}
      <CandidateModal
        isOpen={candidateModalOpen}
        onClose={() => setCandidateModalOpen(false)}
        onSave={handleSaveCandidate}
        candidateToEdit={editingCandidate}
      />

      {/* Delete Candidate Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteCandidateConfirm}
        title="Delete Candidate?"
        message={`Are you sure you want to delete "${candidateToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Candidate"
        cancelText="Cancel"
        isDanger={true}
      />

      {/* Reset Data Step 1 Modal */}
      <ConfirmationModal
        isOpen={resetModalStep === 1}
        onClose={() => setResetModalStep(0)}
        onConfirm={() => setResetModalStep(2)}
        title="WARNING: Reset All Vote Data?"
        message="This will permanently delete all current voting results recorded so far. Are you sure you want to proceed?"
        confirmText="Proceed to Confirmation"
        cancelText="Cancel"
        isDanger={true}
      />

      {/* Reset Data Step 2 Final Warning Modal */}
      <ConfirmationModal
        isOpen={resetModalStep === 2}
        onClose={() => setResetModalStep(0)}
        onConfirm={handleResetDataFinal}
        title="FINAL CONFIRMATION REQUIRED"
        message="Are you 100% certain? All student votes will be wiped immediately. Click below to erase vote data."
        confirmText="ERASE ALL VOTES"
        cancelText="Abort Reset"
        isDanger={true}
      />

    </div>
  );
};
