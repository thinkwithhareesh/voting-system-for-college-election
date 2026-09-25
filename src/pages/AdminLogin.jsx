import React, { useState } from 'react';
import { useElection } from '../context/ElectionContext';
import { Shield, Eye, EyeOff, Lock, User, ArrowRight, X } from 'lucide-react';

export const AdminLogin = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin } = useElection();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await loginAdmin(username, password);
    setLoading(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#DDE4D8] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#DDE4D8]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#174D3A] text-white flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#174D3A] tracking-tight">
                ADMIN LOGIN
              </h3>
              <p className="text-xs text-[#718078]">Authorized Administrator Portal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#718078] hover:bg-[#F7F8E8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-bold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#174D3A] uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDE4D8] bg-[#F7F8E8]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#174D3A] font-semibold text-sm"
              />
              <User className="w-4 h-4 text-[#718078] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#174D3A] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#DDE4D8] bg-[#F7F8E8]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#174D3A] font-semibold text-sm"
              />
              <Lock className="w-4 h-4 text-[#718078] absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#718078] hover:text-[#174D3A]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#174D3A] hover:bg-[#2F7659] text-white font-extrabold text-sm shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>LOGIN TO DASHBOARD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
