import React from 'react';
import { CheckCircle2, Award } from 'lucide-react';
import { playClickSound } from '../utils/audioUtils';

export const CandidateCard = ({ candidate, isSelected, onSelect }) => {
  const handleClick = () => {
    playClickSound();
    onSelect(candidate);
  };

  return (
    <div
      onClick={handleClick}
      className={`group cursor-pointer rounded-3xl bg-white border-2 overflow-hidden card-transition shadow-soft hover:shadow-card-hover flex flex-col justify-between relative ${
        isSelected
          ? 'border-[#174D3A] bg-[#F4F9F5] ring-4 ring-[#174D3A]/15 scale-[1.02]'
          : 'border-[#DDE4D8] hover:border-[#2F7659]/50 hover:-translate-y-1'
      }`}
    >
      {/* Symbol Badge Top Right */}
      {candidate.symbol_url && (
        <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-base shadow-md border border-[#DDE4D8] flex items-center space-x-1">
          <span>{candidate.symbol_url}</span>
        </div>
      )}

      {/* Auto-Fit Candidate Photo Container */}
      <div className="relative w-full h-64 sm:h-72 bg-[#F7F8E8] flex items-center justify-center p-2 overflow-hidden border-b border-[#DDE4D8]/50">
        <img
          src={candidate.image_url}
          alt={candidate.name}
          className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Selected Overlay Indicator */}
        {isSelected && (
          <div className="absolute inset-0 bg-[#174D3A]/15 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-[#174D3A] text-white p-3.5 rounded-full shadow-xl ring-4 ring-white/50">
              <CheckCircle2 className="w-9 h-9 text-white stroke-[2.5]" />
            </div>
          </div>
        )}
      </div>

      {/* Candidate Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black text-[#2F7659] uppercase tracking-wider bg-[#DCEBDD] px-2.5 py-0.5 rounded-md">
              {candidate.department}
            </span>
            <span className="text-xs font-bold text-[#718078]">
              {candidate.candidate_class}
            </span>
          </div>

          <h3 className="text-lg font-black text-[#174D3A] tracking-tight group-hover:text-[#2F7659] transition-colors leading-snug">
            {candidate.name}
          </h3>
        </div>

        {/* Selection State Button */}
        <div className="mt-4 pt-3 border-t border-[#DDE4D8]/60">
          {isSelected ? (
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-[#174D3A] text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span>SELECTED</span>
            </button>
          ) : (
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-[#F7F8E8] hover:bg-[#DCEBDD] text-[#174D3A] font-bold text-sm flex items-center justify-center space-x-2 transition-colors border border-[#DDE4D8]"
            >
              <Award className="w-4 h-4 text-[#2F7659]" />
              <span>SELECT</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
