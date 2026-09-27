import React, { useState } from 'react';
import { useElection } from '../context/ElectionContext';
import { Vote, Shield, Menu, X, Home, Award } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#DDE4D8] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Official College Banner Logo & Title */}
        <div 
          onClick={handleHomeClick}
          className="flex items-center space-x-3 cursor-pointer group py-1"
        >
          <img 
            src="/msec_banner.webp" 
            alt="Mohamed Sathak Engineering College Kilakarai" 
            className="h-10 sm:h-14 w-auto max-w-[220px] sm:max-w-md md:max-w-lg object-contain transition-transform duration-200 group-hover:scale-[1.01]" 
          />
          <div className="hidden lg:flex flex-col border-l border-[#DDE4D8] pl-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#2F7659] bg-[#DCEBDD] px-2 py-0.5 rounded-md w-fit">
              MCA 2026
            </span>
            <span className="text-[11px] font-bold text-[#718078] mt-0.5">
              Kilakarai
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={handleHomeClick}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              currentStep === 0 
                ? 'bg-[#174D3A] text-white shadow-sm' 
                : 'text-[#294238] hover:bg-[#F7F8E8]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={handleStartVotingClick}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              currentStep >= 1 && currentStep <= 6 
                ? 'bg-[#174D3A] text-white shadow-sm' 
                : 'text-[#294238] hover:bg-[#F7F8E8]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Voting Center</span>
          </button>

          <button
            onClick={onOpenAdminLogin}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
              isAdminLoggedIn
                ? 'bg-[#DCEBDD] text-[#174D3A] border-[#2F7659]/30 hover:bg-[#174D3A] hover:text-white'
                : 'border-[#174D3A] text-[#174D3A] hover:bg-[#174D3A] hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#F7F8E8] text-[#174D3A] border border-[#DDE4D8] hover:bg-[#DCEBDD] transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
