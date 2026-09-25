import React from 'react';
import { useElection, POSITIONS } from '../context/ElectionContext';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { CandidateCard } from '../components/CandidateCard';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

export const VotingWizard = () => {
  const { 
    currentStep, 
    candidates, 
    selections, 
    selectCandidate, 
    nextStep, 
    prevStep,
    loading 
  } = useElection();

  const activePosition = POSITIONS[currentStep - 1];
  if (!activePosition) return null;

  // Filter candidates matching current position
  const positionCandidates = candidates.filter(
    c => c.position_id === activePosition.id
  );

  const selectedCandidateForPos = selections[activePosition.id];

  const handleCandidateClick = (candidate) => {
    selectCandidate(activePosition.id, candidate);
  };

  const isNextDisabled = !selectedCandidateForPos;

  // Dynamic grid class based on candidate count
  const gridClass = positionCandidates.length === 4 
    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto';

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-24">
      {/* Progress Header */}
      <ProgressIndicator currentStep={currentStep} selections={selections} />

      {/* Main Position Selection Section */}
      <div className="mt-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#DDE4D8] shadow-soft">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-black tracking-widest text-[#2F7659] uppercase bg-[#DCEBDD] px-3 py-1 rounded-full">
            Position 0{currentStep} of 05
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#174D3A] tracking-tight mt-2">
            {activePosition.title}
          </h2>
          <p className="text-sm font-medium text-[#718078] mt-1">
            Please tap or click on your preferred candidate to select.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-[#174D3A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-bold text-[#718078]">Loading candidates...</p>
          </div>
        ) : (
          /* Responsive Candidate Grid */
          <div className={gridClass}>
            {positionCandidates.map((candidate) => {
              const isSelected = selectedCandidateForPos?.id === candidate.id;
              return (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isSelected={isSelected}
                  onSelect={handleCandidateClick}
                />
              );
            })}
          </div>
        )}

        {/* Instructions helper if not selected */}
        {!selectedCandidateForPos && (
          <div className="mt-6 text-center text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 p-3 rounded-2xl">
            ⚠️ Select one candidate to enable the "NEXT" button.
          </div>
        )}
      </div>

      {/* Sticky / Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#DDE4D8] py-4 px-4 sm:px-8 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* BACK Button */}
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#F7F8E8] hover:bg-[#DCEBDD] text-[#174D3A] font-extrabold text-base border border-[#DDE4D8] transition-all"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span>BACK</span>
          </button>

          {/* Current Selection summary snippet on mobile/desktop */}
          {selectedCandidateForPos && (
            <div className="hidden sm:flex items-center space-x-2 text-xs font-bold text-[#174D3A] bg-[#DCEBDD] px-3.5 py-2 rounded-xl">
              <CheckCircle className="w-4 h-4 text-[#2E8B57]" />
              <span>Selected: {selectedCandidateForPos.name}</span>
            </div>
          )}

          {/* NEXT / REVIEW VOTE Button */}
          <button
            type="button"
            onClick={nextStep}
            disabled={isNextDisabled}
            className={`flex items-center space-x-2 px-8 py-3.5 rounded-2xl font-extrabold text-base shadow-md transition-all ${
              isNextDisabled
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                : 'bg-[#174D3A] hover:bg-[#2F7659] text-white shadow-soft-lg transform hover:-translate-y-0.5'
            }`}
          >
            <span>{currentStep === 5 ? 'REVIEW VOTE' : 'NEXT'}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
