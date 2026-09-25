import React from 'react';
import { useElection } from '../context/ElectionContext';
import { Vote, ArrowRight, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export const Hero = () => {
  const { electionStatus, nextStep } = useElection();

  const handleStartVoting = () => {
    if (electionStatus === 'ACTIVE') {
      nextStep();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Original Clean Hero Container with Dark Green Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#174D3A] via-[#1E5D47] to-[#0D3426] text-white p-8 sm:p-12 shadow-soft-lg border border-[#2F7659]/30">
        
        {/* Subtle Decorative Background Orbs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#DCEBDD]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#2F7659]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-[#DCEBDD] border border-white/15 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#DCEBDD] animate-pulse"></span>
            <span>MSEC MCA ELECTION 2026</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 max-w-3xl leading-tight">
            Mohammad Sathak Engineering College
          </h1>
          <p className="text-lg sm:text-xl font-medium text-[#DCEBDD] mb-2">
            Master of Computer Application (MCA)
          </p>

          <p className="text-sm sm:text-base text-white/80 max-w-xl mb-8 leading-relaxed">
            Welcome to the official student election portal. Please select one candidate for each of the 5 positions to submit your vote.
          </p>

          {/* Start Button or Status Alert */}
          {electionStatus === 'ACTIVE' ? (
            <button
              onClick={handleStartVoting}
              className="group relative inline-flex items-center justify-center space-x-3 bg-[#F7F8E8] hover:bg-white text-[#174D3A] font-extrabold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-card-hover transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Vote className="w-6 h-6 text-[#174D3A]" />
              <span>START VOTING</span>
              <ArrowRight className="w-5 h-5 text-[#174D3A] group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="bg-red-500/20 backdrop-blur-md border border-red-400/30 text-white px-6 py-4 rounded-2xl flex items-center space-x-3 max-w-md">
              <Lock className="w-6 h-6 text-red-300 flex-shrink-0" />
              <div className="text-left text-sm">
                <p className="font-bold text-red-100">Voting is currently closed</p>
                <p className="text-white/80 text-xs mt-0.5">Please wait until the administrator starts the election session.</p>
              </div>
            </div>
          )}

          {/* Status Indicator */}
          <div className="mt-8 flex items-center space-x-2 text-xs font-semibold text-white/90 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm">
            {electionStatus === 'ACTIVE' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Voting Active
                </span>
              </>
            )}
            {electionStatus === 'PAUSED' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Voting Paused
                </span>
              </>
            )}
            {electionStatus === 'CLOSED' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span className="text-rose-300 font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Election Closed
                </span>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-5 rounded-2xl border border-[#DDE4D8] shadow-sm flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-[#DCEBDD] text-[#174D3A] flex items-center justify-center font-bold text-base flex-shrink-0">
            5
          </div>
          <div>
            <h4 className="font-bold text-[#174D3A] text-sm">5 Key Positions</h4>
            <p className="text-xs text-[#718078] mt-1">President, Vice President, Secretary, Joint Secretary & Treasurer</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDE4D8] shadow-sm flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-[#DCEBDD] text-[#174D3A] flex items-center justify-center font-bold text-base flex-shrink-0">
            🔒
          </div>
          <div>
            <h4 className="font-bold text-[#174D3A] text-sm">100% Anonymous</h4>
            <p className="text-xs text-[#718078] mt-1">Your vote choices remain private and encrypted.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDE4D8] shadow-sm flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-[#DCEBDD] text-[#174D3A] flex items-center justify-center font-bold text-base flex-shrink-0">
            ⚡
          </div>
          <div>
            <h4 className="font-bold text-[#174D3A] text-sm">Instant Review</h4>
            <p className="text-xs text-[#718078] mt-1">Review all selections before final confirmation.</p>
          </div>
        </div>
      </div>

      {/* Developer Credit Note */}
      <div className="text-center mt-6">
        <p className="text-xs font-semibold text-[#718078] tracking-wide">
          Developed by <span className="text-[#174D3A] font-bold">Hareesh (2025-2027 batch)</span>
        </p>
      </div>
    </div>
  );
};
