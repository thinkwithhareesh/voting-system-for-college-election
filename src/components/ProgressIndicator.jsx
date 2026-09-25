import React from 'react';
import { POSITIONS } from '../context/ElectionContext';
import { Check } from 'lucide-react';

export const ProgressIndicator = ({ currentStep, selections }) => {
  // If outside voting wizard steps (1..5), don't show
  if (currentStep < 1 || currentStep > 5) return null;

  const activePosition = POSITIONS[currentStep - 1];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
      {/* Step Counter Badge */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F7659]">
            Voting Step
          </span>
          <h2 className="text-2xl font-black text-[#174D3A] tracking-tight">
            {activePosition?.title}
          </h2>
        </div>
        <div className="bg-[#174D3A] text-white px-4 py-1.5 rounded-2xl text-sm font-black tracking-wider shadow-sm">
          0{currentStep} / 05
        </div>
      </div>

      {/* Desktop Step Trail */}
      <div className="hidden md:flex items-center justify-between relative bg-white p-3.5 rounded-2xl border border-[#DDE4D8] shadow-sm">
        {POSITIONS.map((pos, idx) => {
          const stepNum = idx + 1;
          const isCurrent = currentStep === stepNum;
          const isCompleted = currentStep > stepNum || selections[pos.id] !== null;

          return (
            <div key={pos.id} className="flex items-center space-x-2 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[#174D3A] text-white ring-4 ring-[#DCEBDD]'
                    : isCompleted
                    ? 'bg-[#2E8B57] text-white'
                    : 'bg-[#F7F8E8] text-[#718078] border border-[#DDE4D8]'
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs font-bold transition-colors ${
                  isCurrent
                    ? 'text-[#174D3A]'
                    : isCompleted
                    ? 'text-[#2F7659]'
                    : 'text-[#718078]'
                }`}
              >
                {pos.label}
              </span>
              {idx < POSITIONS.length - 1 && (
                <div className="w-6 sm:w-10 h-0.5 bg-[#DDE4D8] mx-1"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Step Trail Bar */}
      <div className="md:hidden bg-white p-3 rounded-xl border border-[#DDE4D8]">
        <div className="flex items-center justify-between mb-2 text-xs font-bold text-[#174D3A]">
          <span>{activePosition?.label}</span>
          <span>{Math.round((currentStep / 5) * 100)}%</span>
        </div>
        <div className="w-full h-2.5 bg-[#F7F8E8] rounded-full overflow-hidden border border-[#DDE4D8]">
          <div
            className="h-full bg-[#174D3A] transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
