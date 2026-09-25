import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

export const ResetCountdown = ({ onComplete }) => {
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  const percentage = (seconds / 30) * 100;
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  return (
    <div className="bg-white rounded-3xl p-8 border border-[#DDE4D8] shadow-soft max-w-md mx-auto text-center mt-6">
      <p className="text-sm font-bold text-[#718078] uppercase tracking-wider mb-2">
        Session Auto Reset
      </p>
      <h3 className="text-lg font-black text-[#174D3A] mb-6">
        Next voting session will begin shortly
      </h3>

      {/* SVG Circular Countdown */}
      <div className="relative w-36 h-36 mx-auto flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-[#F7F8E8]"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-[#174D3A] transition-all duration-1000 ease-linear"
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-black text-[#174D3A] tracking-tight">
            {seconds}
          </span>
          <span className="text-[10px] font-bold uppercase text-[#718078] tracking-widest">
            seconds
          </span>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="inline-flex items-center space-x-2 text-xs font-extrabold text-[#2F7659] bg-[#DCEBDD] hover:bg-[#174D3A] hover:text-white px-4 py-2 rounded-xl transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Skip Countdown Now</span>
      </button>
    </div>
  );
};
