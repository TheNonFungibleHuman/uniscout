
import React from 'react';
import { University } from '../types';

interface UniversityCardProps {
  university: University;
  onSave: (university: University) => void;
  onDiscard?: (universityId: string) => void;
  isSaved?: boolean;
  isDiscarded?: boolean;
  minimal?: boolean;
  onClick?: () => void;
}

const UniversityCard: React.FC<UniversityCardProps> = ({ 
  university, 
  onSave, 
  onDiscard, 
  isSaved = false,
  isDiscarded = false,
  minimal = false,
  onClick
}) => {
  if (isDiscarded) return null;

  const scoreColor = university.matchScore >= 90 ? 'text-green-600 bg-green-50' : 
                     university.matchScore >= 80 ? 'text-brand-600 bg-brand-50' : 'text-yellow-600 bg-yellow-50';

  return (
    <div 
        className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col ${minimal ? 'w-full' : 'w-72 md:w-80 flex-shrink-0'}`}
        onClick={onClick}
    >
      <div className="h-24 bg-gradient-to-r from-brand-500 to-indigo-600 relative p-4">
         <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${scoreColor}`}>
            {university.matchScore}% Match
         </div>
         <h3 className="text-white font-bold text-lg leading-tight pr-16 shadow-black drop-shadow-md">
            {university.name}
         </h3>
         <p className="text-brand-100 text-xs mt-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.62.829.799 1.654 1.38 2.274 1.766a11.121 11.121 0 00.757.432l.018.009.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
            {university.location}
         </p>
      </div>

      <div className="p-4 flex-1 flex flex-col">
         <div className="flex flex-wrap gap-1 mb-3">
            {university.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    {tag}
                </span>
            ))}
         </div>
         
         <p className="text-xs text-slate-500 font-medium mb-2">{university.tuition}</p>
         <p className="text-sm text-slate-600 mb-4 line-clamp-3">{university.description}</p>

         <div className="mt-auto flex gap-2 pt-2 border-t border-slate-100">
            <a 
                href={university.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 py-2 text-center text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                onClick={(e) => e.stopPropagation()}
            >
                Website
            </a>
            
            {!isSaved ? (
                <button 
                    onClick={(e) => { e.stopPropagation(); onSave(university); }}
                    className="flex-1 py-2 text-center text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    Save
                </button>
            ) : (
                <button 
                    className="flex-1 py-2 text-center text-xs font-bold text-white bg-green-600 rounded-lg cursor-default flex items-center justify-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Saved
                </button>
            )}

            {!minimal && onDiscard && (
                 <button 
                 onClick={(e) => { e.stopPropagation(); onDiscard(university.id); }}
                 className="w-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                 title="Discard"
             >
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                     <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                 </svg>
             </button>
            )}
         </div>
      </div>
    </div>
  );
};

export default UniversityCard;
