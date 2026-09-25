import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Image, Tag, Award } from 'lucide-react';
import { POSITIONS } from '../context/ElectionContext';

export const CandidateModal = ({ isOpen, onClose, onSave, candidateToEdit = null, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    position_id: 'president',
    department: 'MCA',
    candidate_class: 'MCA 2nd Year',
    image_url: '',
    symbol_url: '🎓'
  });

  useEffect(() => {
    if (candidateToEdit) {
      setFormData({
        name: candidateToEdit.name || '',
        position_id: candidateToEdit.position_id || 'president',
        department: candidateToEdit.department || 'MCA',
        candidate_class: candidateToEdit.candidate_class || 'MCA 2nd Year',
        image_url: candidateToEdit.image_url || '',
        symbol_url: candidateToEdit.symbol_url || '🎓'
      });
    } else {
      setFormData({
        name: '',
        position_id: 'president',
        department: 'MCA',
        candidate_class: 'MCA 2nd Year',
        image_url: '',
        symbol_url: '🎓'
      });
    }
  }, [candidateToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const sampleSymbols = ['🎓', '🚀', '🌟', '⚡', '🏆', '🔥', '📚', '💡', '🎯', '🛡️', '🌿', '⚙️', '💰', '⚖️', '💎'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DDE4D8] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#DDE4D8]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCEBDD] text-[#174D3A] flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#174D3A] tracking-tight">
                {candidateToEdit ? 'Edit Candidate' : 'Add New Candidate'}
              </h3>
              <p className="text-xs text-[#718078]">Enter candidate details below</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-xl text-[#718078] hover:bg-[#F7F8E8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Candidate Name */}
          <div>
            <label className="block text-xs font-bold text-[#174D3A] uppercase tracking-wider mb-1">
              Candidate Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Arun Kumar S"
              className="w-full px-4 py-3 rounded-xl border border-[#DDE4D8] bg-[#F7F8E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#174D3A] font-semibold text-sm"
            />
          </div>

          {/* Election Position */}
          <div>
            <label className="block text-xs font-bold text-[#174D3A] uppercase tracking-wider mb-1">
              Election Position *
            </label>
            <select
              value={formData.position_id}
              onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#DDE4D8] bg-[#F7F8E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#174D3A] font-semibold text-sm"
            >
              {POSITIONS.map(pos => (
                <option key={pos.id} value={pos.id}>
                  {pos.title}
                </option>
              ))}
            </select>
          </div>

          {/* Department & Class Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#174D3A] uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="MCA"
                className="w-full px-4 py-3 rounded-xl border border-[#DDE4D8] bg-[#F7F8E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#174D3A] font-semibold text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#174D3A] uppercase tracking-wider mb-1">
                Class / Year
              </label>
              <input
                type="text"
                value={formData.candidate_class}
                onChange={(e) => setFormData({ ...formData, candidate_class: e.target.value })}
                placeholder="MCA 2nd Year"
                className="w-full px-4 py-3 rounded-xl border border-[#DDE4D8] bg-[#F7F8E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#174D3A] font-semibold text-sm"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-[#174D3A] uppercase tracking-wider mb-1">
              Photo URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDE4D8] bg-[#F7F8E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#174D3A] font-semibold text-sm"
              />
              <Image className="w-4 h-4 text-[#718078] absolute left-3.5 top-3.5" />
            </div>
            <p className="text-[11px] text-[#718078] mt-1">Leave empty to use automatic photo placeholder.</p>
          </div>

          {/* Candidate Symbol */}
          <div>
            <label className="block text-xs font-bold text-[#174D3A] uppercase tracking-wider mb-1">
              Candidate Symbol / Icon
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                maxLength={4}
                value={formData.symbol_url}
                onChange={(e) => setFormData({ ...formData, symbol_url: e.target.value })}
                className="w-20 px-3 py-2 text-center rounded-xl border border-[#DDE4D8] text-xl font-bold"
              />
              <div className="flex-1 flex flex-wrap gap-1.5 overflow-x-auto p-1 bg-[#F7F8E8] rounded-xl border border-[#DDE4D8]">
                {sampleSymbols.map(sym => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => setFormData({ ...formData, symbol_url: sym })}
                    className={`px-2 py-1 rounded-lg text-base hover:bg-white transition-colors ${
                      formData.symbol_url === sym ? 'bg-white ring-2 ring-[#174D3A]' : ''
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#DDE4D8] font-bold text-sm text-[#294238] hover:bg-[#F7F8E8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#174D3A] hover:bg-[#2F7659] text-white font-extrabold text-sm shadow-md flex items-center space-x-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{candidateToEdit ? 'Save Changes' : 'Add Candidate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
