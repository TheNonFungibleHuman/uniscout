
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (newProfile: UserProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">Edit Preferences</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Field of Study</label>
            <input 
              type="text" 
              value={formData.fieldOfStudy} 
              onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})}
              className="w-full p-3 rounded-lg border border-slate-200 focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Budget</label>
            <select 
              value={formData.budgetRange}
              onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
              className="w-full p-3 rounded-lg border border-slate-200 focus:border-brand-500 outline-none bg-white"
            >
              {["Under $15k", "$15k - $30k", "$30k - $50k", "$50k+", "Full Scholarship Required"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Locations</label>
            <div className="flex flex-wrap gap-2">
              {[
                "USA - East Coast", "USA - West Coast", "USA - Midwest", 
                "UK - London", "UK - Other", "Europe (EU)", "Canada", "Australia/NZ", "Africa", "Asia", "Remote/Online"
              ].map(loc => (
                <button
                  key={loc}
                  onClick={() => {
                    const exists = formData.preferredLocations.includes(loc);
                    setFormData({
                      ...formData,
                      preferredLocations: exists 
                        ? formData.preferredLocations.filter(l => l !== loc)
                        : [...formData.preferredLocations, loc]
                    })
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border
                    ${formData.preferredLocations.includes(loc)
                      ? 'bg-brand-100 text-brand-700 border-brand-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
          
          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Key Priorities (Select 3)</label>
             <div className="flex flex-wrap gap-2">
                 {[
                    "Academic Prestige",
                    "Financial Aid & Value",
                    "Campus Culture",
                    "Safety & Location",
                    "Career & Alumni Network",
                    "Diversity & Inclusion",
                    "Research Facilities",
                    "Athletics"
                 ].map(metric => (
                     <button
                      key={metric}
                      onClick={() => {
                        const exists = formData.keyMetrics.includes(metric);
                        if (!exists && formData.keyMetrics.length >= 3) return;
                        setFormData({
                          ...formData,
                          keyMetrics: exists 
                            ? formData.keyMetrics.filter(m => m !== metric)
                            : [...formData.keyMetrics, metric]
                        })
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border text-left
                        ${formData.keyMetrics.includes(metric)
                          ? 'bg-brand-100 text-brand-700 border-brand-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                    >
                      {metric}
                    </button>
                 ))}
             </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Specific Requirements / Priorities</label>
            <textarea 
              value={formData.priorities || ''} 
              onChange={(e) => setFormData({...formData, priorities: e.target.value})}
              placeholder="E.g. Need a debate team, strong accessibility support, or specific internship programs..."
              className="w-full p-3 rounded-lg border border-slate-200 focus:border-brand-500 outline-none min-h-[100px]"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-500 font-medium hover:text-slate-800">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700">Update & Re-Analyze</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
