import React, { useState } from 'react';
import { useElection, POSITIONS } from '../context/ElectionContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Edit3, CheckCircle2, ShieldCheck, ArrowLeft, Send } from 'lucide-react';

export const ReviewPage = () => {
  const { selections, goToStep, submitVote, submitting, error } = useElection();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmSubmit = async () => {
    const res = await submitVote();
    if (res.success) {
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DDE4D8] shadow-soft mb-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-[#DCEBDD] text-[#174D3A] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>Final Verification Stage</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#174D3A] tracking-tight">
          REVIEW YOUR VOTE
        </h2>
        <p className="text-sm text-[#718078] mt-2 max-w-lg mx-auto">
          Please review your selected candidates for all 5 positions. You can edit any selection before final submission.
        </p>
      </div>

      {/* Display Summary Cards for all 5 positions */}
      <div className="space-y-4">
        {POSITIONS.map((pos) => {
          const selectedCandidate = selections[pos.id];
          return (
            <div 
              key={pos.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DDE4D8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#2F7659]/40 transition-colors"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#F7F8E8] flex-shrink-0 border border-[#DDE4D8] relative p-1 flex items-center justify-center">
                  {selectedCandidate?.image_url ? (
                    <img 
                      src={selectedCandidate.image_url} 
                      alt={selectedCandidate.name} 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-[#DCEBDD] text-[#174D3A]">
                      {pos.title[0]}
                    </div>
                  )}
                  {selectedCandidate?.symbol_url && (
                    <span className="absolute bottom-1 right-1 bg-white text-xs px-1 rounded-md shadow">
                      {selectedCandidate.symbol_url}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#2F7659]">
                    {pos.title}
                  </span>
                  <h4 className="text-lg font-black text-[#174D3A] leading-snug">
                    {selectedCandidate ? selectedCandidate.name : 'Not Selected'}
                  </h4>
                  <p className="text-xs text-[#718078]">
                    {selectedCandidate ? `${selectedCandidate.department} • ${selectedCandidate.candidate_class}` : ''}
                  </p>
                </div>
              </div>

              {/* Individual Edit Button for position */}
              <button
                type="button"
                onClick={() => goToStep(pos.step)}
                className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-[#F7F8E8] hover:bg-[#DCEBDD] text-[#174D3A] font-bold text-xs border border-[#DDE4D8] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Choice</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Error Notice if API fails */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-semibold text-center">
          {error}
        </div>
      )}

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#DDE4D8] py-4 px-4 sm:px-8 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => goToStep(1)}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#F7F8E8] hover:bg-[#DCEBDD] text-[#174D3A] font-extrabold text-sm sm:text-base border border-[#DDE4D8] transition-all"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span>EDIT VOTE</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-[#174D3A] hover:bg-[#2F7659] text-white font-extrabold text-sm sm:text-base shadow-soft-lg transform hover:-translate-y-0.5 transition-all"
          >
            <Send className="w-5 h-5" />
            <span>CONFIRM & SUBMIT VOTE</span>
          </button>
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Submit Your Vote?"
        message="Are you sure you want to submit your final vote? Once submitted, your choices cannot be changed."
        confirmText="Yes, Submit Vote"
        cancelText="Cancel"
        loading={submitting}
      />
    </div>
  );
};
