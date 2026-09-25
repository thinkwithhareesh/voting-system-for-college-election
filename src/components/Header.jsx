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
        
        {/* Left: Emblem Logo & College Title */}
        <div 
          onClick={handleHomeClick}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#174D3A] to-[#2F7659] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
            <Vote className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F7659] bg-[#DCEBDD] px-2 py-0.5 rounded-md">
                MCA 2026
              </span>
              <span className="text-xs font-medium text-[#718078] hidden sm:inline">
                Keelakarai
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-[#174D3A] tracking-tight leading-none mt-1">
              Mohammad Sathak Engg College
            </h1>
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
