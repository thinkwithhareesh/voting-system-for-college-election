import React from 'react';
import { Vote, Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto bg-white/85 backdrop-blur-md border-t border-[#DDE4D8] py-8 px-4 text-center">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#718078]">
        
        {/* Left Branding */}
        <div className="flex items-center space-x-2 text-[#174D3A] font-bold">
          <Vote className="w-4 h-4 text-[#2F7659]" />
          <span>Mohammad Sathak Engineering College Keelakarai</span>
        </div>

        {/* Center Department */}
        <div className="bg-[#F7F8E8] px-3 py-1 rounded-full text-[#2F7659] font-extrabold border border-[#DDE4D8]">
          Master of Computer Application (MCA) Election 2026
        </div>

        {/* Right Creator */}
        <div className="flex items-center space-x-1">
          <span>Developed with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>by</span>
          <span className="text-[#174D3A] font-black">Hareesh (2025-2027 batch)</span>
        </div>

      </div>
    </footer>
  );
};
