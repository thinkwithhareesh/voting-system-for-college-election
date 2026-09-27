import React, { useState } from 'react';
import { useElection } from '../context/ElectionContext';
import { Shield, Menu, X, Home, Award } from 'lucide-react';

export const Header = ({ onOpenAdminLogin }) => {
  const { currentStep, goToStep, resetSession, isAdminLoggedIn, electionStatus } = useElection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHomeClick = () => {
    resetSession();
    setMobileMenuOpen(false);
  };

  const handleStartVotingClick = () => {
    if (electionStatus === 'ACTIVE') {
      goToStep(1);
    } else {
      goToStep(0);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#DDE4D8] shadow-sm">
      {/* Top Banner Row: Full Width College Header Logo */}
      <div className="w-full bg-white border-b border-[#DDE4D8]/60 py-2 px-3 sm:px-6 flex items-center justify-between">
        <div 
          onClick={handleHomeClick}
          className="cursor-pointer flex-1 flex items-center justify-start group overflow-hidden"
        >
          <img 
            src="/msec_banner.webp" 
            alt="Mohamed Sathak Engineering College Kilakarai" 
            className="h-10 sm:h-14 md:h-16 lg:h-18 w-full max-w-6xl object-contain object-left transition-transform duration-200 group-hover:scale-[1.003]" 
          />
        </div>
        
        {/* Right Badge */}
        <div className="hidden sm:flex items-center space-x-2 bg-[#DCEBDD] text-[#174D3A] px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex-shrink-0 border border-[#2F7659]/20 ml-2">
          <span>MCA ELECTION 2026</span>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-[#174D3A]">
          <span className="bg-[#174D3A] text-white px-2.5 py-1 rounded-lg">MSEC MCA</span>
          <span className="text-[#718078] hidden sm:inline">Kilakarai</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <button
            onClick={handleHomeClick}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              currentStep === 0 
                ? 'bg-[#174D3A] text-white shadow-sm' 
                : 'text-[#294238] hover:bg-[#F7F8E8]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={handleStartVotingClick}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              currentStep >= 1 && currentStep <= 6 
                ? 'bg-[#174D3A] text-white shadow-sm' 
                : 'text-[#294238] hover:bg-[#F7F8E8]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Voting Center</span>
          </button>

          <button
            onClick={onOpenAdminLogin}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isAdminLoggedIn
                ? 'bg-[#DCEBDD] text-[#174D3A] border-[#2F7659]/30 hover:bg-[#174D3A] hover:text-white'
                : 'border-[#174D3A] text-[#174D3A] hover:bg-[#174D3A] hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-[#F7F8E8] text-[#174D3A] border border-[#DDE4D8] hover:bg-[#DCEBDD] transition-colors text-xs font-bold flex items-center space-x-1"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DDE4D8] bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={handleHomeClick}
            className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-[#294238] hover:bg-[#F7F8E8]"
          >
            <Home className="w-5 h-5 text-[#2F7659]" />
            <span>Home</span>
          </button>

          <button
            onClick={handleStartVotingClick}
            className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-[#294238] hover:bg-[#F7F8E8]"
          >
            <Award className="w-5 h-5 text-[#2F7659]" />
            <span>Voting Center</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdminLogin();
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold bg-[#174D3A] text-white shadow-sm"
          >
            <Shield className="w-5 h-5" />
            <span>{isAdminLoggedIn ? 'Go to Admin Dashboard' : 'Admin Login'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
