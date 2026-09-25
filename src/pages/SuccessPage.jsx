import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useElection } from '../context/ElectionContext';
import { ResetCountdown } from '../components/ResetCountdown';
import { playSuccessSound } from '../utils/audioUtils';
import { CheckCircle2, ShieldCheck, Home, Volume2 } from 'lucide-react';

export const SuccessPage = () => {
  const { resetSession } = useElection();

  useEffect(() => {
    // Play victory sound chime
    playSuccessSound();

    // Trigger confetti victory burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#174D3A', '#2F7659', '#DCEBDD', '#FFD700']
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center animate-in zoom-in-95 duration-300">
      
      {/* Success Checkmark Circle Icon */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#DCEBDD] text-[#174D3A] mx-auto flex items-center justify-center shadow-soft-lg mb-6 relative">
        <CheckCircle2 className="w-16 h-16 text-[#174D3A] stroke-[2.5] animate-bounce" />
      </div>

      <div className="inline-flex items-center space-x-2 bg-[#DCEBDD] text-[#174D3A] px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3">
        <ShieldCheck className="w-4 h-4" />
        <span>Vote Confirmed</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-[#174D3A] tracking-tight mb-2">
        VOTE SUBMITTED SUCCESSFULLY
      </h1>

      <p className="text-base font-medium text-[#718078] max-w-md mx-auto mb-4">
        Thank you for participating in the Mohammad Sathak Engineering College MCA election.
      </p>

      {/* Play Chime Audio Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={playSuccessSound}
          className="inline-flex items-center space-x-2 bg-[#174D3A] hover:bg-[#2F7659] text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all"
        >
          <Volume2 className="w-4 h-4 text-emerald-300" />
          <span>PLAY SUCCESS CHIME SOUND 🔊</span>
        </button>
      </div>

      {/* 30 Second Reset Timer */}
      <ResetCountdown onComplete={resetSession} />

      {/* Immediate Manual Reset Button */}
      <div className="mt-6">
        <button
          onClick={resetSession}
          className="inline-flex items-center space-x-2 text-sm font-extrabold text-[#174D3A] hover:text-[#2F7659] hover:underline"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home Screen</span>
        </button>
      </div>

    </div>
  );
};
