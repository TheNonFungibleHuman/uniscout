
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in border border-slate-100">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Preferences</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-10">
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Field of Study</label>
            <input 
              type="text" 
              value={formData.fieldOfStudy} 
              onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})}
              className="w-full p-4 rounded-2xl border border-slate-100 focus:border-slate-900 outline-none bg-slate-50 text-slate-900 font-bold transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Budget</label>
            <select 
              value={formData.budgetRange}
              onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
              className="w-full p-4 rounded-2xl border border-slate-100 focus:border-slate-900 outline-none bg-slate-50 text-slate-900 font-bold transition-all appearance-none"
            >
              {["Under $15k", "$15k - $30k", "$30k - $50k", "$50k+", "Full Scholarship Required"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Preferred Locations</label>
            <div className="flex flex-wrap gap-2">
              {[
                "USA - East Coast", "USA - West Coast", "USA - Midwest", "USA - South",
                "Canada", "UK - London", "UK - Other", "Europe (EU)", "Europe (Non-EU)",
                "Australia/NZ", "Asia", "Africa", "South America", "Middle East",
                "Latin America (LATAM)", "Asia-Pacific (APAC)", "Europe, Middle East, & Africa (EMEA)",
                "Remote/Online"
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
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all border
                    ${formData.preferredLocations.includes(loc)
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10'
                      : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-900'}`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
          
          <div>
             <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Key Priorities (Select 3)</label>
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
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all border text-left
                        ${formData.keyMetrics.includes(metric)
                          ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10'
                          : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-900'}`}
                    >
                      {metric}
                    </button>
                 ))}
             </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Specific Requirements</label>
            <textarea 
              value={formData.priorities || ''} 
              onChange={(e) => setFormData({...formData, priorities: e.target.value})}
              placeholder="E.g. Need a debate team, strong accessibility support..."
              className="w-full p-4 rounded-2xl border border-slate-100 focus:border-slate-900 outline-none min-h-[120px] bg-slate-50 text-slate-900 font-bold transition-all"
            />
          </div>
        </div>

        <div className="p-8 border-t border-slate-50 flex justify-end gap-4 sticky bottom-0 bg-white/80 backdrop-blur-md">
          <button onClick={onClose} className="px-6 py-3 text-slate-400 font-bold hover:text-slate-900 transition-all">Cancel</button>
          <button onClick={handleSave} className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">Update & Re-Analyze</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
