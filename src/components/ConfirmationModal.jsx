import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDanger = false,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#DDE4D8] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-2xl ${isDanger ? 'bg-red-100 text-red-600' : 'bg-[#DCEBDD] text-[#174D3A]'}`}>
            {isDanger ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-xl text-[#718078] hover:bg-[#F7F8E8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-extrabold text-[#174D3A] tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-[#718078] mt-2 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="mt-6 flex items-center space-x-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-[#DDE4D8] font-bold text-sm text-[#294238] hover:bg-[#F7F8E8] transition-colors"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-sm text-white shadow-md transition-all flex items-center space-x-2 ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-[#174D3A] hover:bg-[#2F7659]'
            }`}
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
