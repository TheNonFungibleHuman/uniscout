import React, { useState } from 'react';
import { University } from '../types';

interface UniversityCardProps {
  university: University;
  onSave: (university: University) => void;
  onDiscard?: (universityId: string) => void;
  isSaved?: boolean;
  isDiscarded?: boolean;
  minimal?: boolean;
  onClick?: () => void;
  className?: string;
}

const UniversityCard: React.FC<UniversityCardProps> = ({ 
  university, 
  onSave, 
  onDiscard, 
  isSaved = false,
  isDiscarded = false,
  minimal = false,
  onClick,
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  if (isDiscarded) return null;

  // Determine accent color based on match score
  const scoreColorClass = university.matchScore >= 90 ? 'text-brand-700 border-brand-700' : 
                     university.matchScore >= 80 ? 'text-accent-olive border-accent-olive' : 'text-accent-gold border-accent-gold';
  
  // Fallback logic: If error, use a nice gradient pattern instead of a broken image
  const showFallback = imgError || !university.images || university.images.length === 0;

  // Fallback logo logic
  const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(university.name)}&background=f6f1e9&color=162714&size=128&font-size=0.33&bold=true`;

  return (
    <div 
        className={`group bg-white border border-slate-200 hover:border-brand-700 transition-all duration-300 flex flex-col shadow-none hover:shadow-xl ${minimal ? 'w-full' : 'w-80 md:w-96 flex-shrink-0'} ${className} cursor-pointer`}
        onClick={onClick}
    >
      {/* Image Header */}
      <div className="h-40 relative overflow-hidden bg-slate-200">
         <div className="absolute inset-0 bg-brand-900/20 group-hover:bg-brand-900/0 transition-colors z-10"></div>
         
         {showFallback ? (
             <div className="w-full h-full bg-gradient-to-br from-brand-800 to-brand-600 flex items-center justify-center">
                 <span className="text-brand-200 font-serif opacity-20 text-6xl font-bold">G</span>
             </div>
         ) : (
            <img 
                src={university.images![0]} 
                alt={university.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                onError={() => setImgError(true)}
            />
         )}
         
         {/* Match Score Badge */}
         <div className="absolute top-0 right-0 bg-beige-100 px-3 py-1.5 border-b border-l border-brand-700 z-20 shadow-sm">
            <span className={`font-heading font-bold text-lg tracking-tight ${scoreColorClass.split(' ')[0]}`}>
                {university.matchScore}% Match
            </span>
         </div>

         {/* Logo Overlay */}
         <div className="absolute bottom-0 left-4 transform translate-y-1/2 z-20 w-12 h-12 bg-white border border-slate-200 flex items-center justify-center p-1 shadow-sm">
             <img 
                src={!logoError && university.logo ? university.logo : fallbackLogo} 
                alt="logo" 
                className="w-full h-full object-contain" 
                onError={() => setLogoError(true)}
            />
         </div>
      </div>

      <div className="p-5 pt-8 flex-1 flex flex-col relative">
         <div className="flex justify-between items-start mb-2">
             <h3 className="text-brand-700 font-serif text-2xl leading-tight group-hover:text-accent-rust transition-colors">
                {university.name}
             </h3>
         </div>
         
         <p className="text-accent-olive text-xs mb-3 font-heading font-bold uppercase tracking-widest flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.62.829.799 1.654 1.38 2.274 1.766a11.121 11.121 0 00.757.432l.018.009.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
            {university.location}
         </p>

         <div className="flex flex-wrap gap-1 mb-4">
            {university.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-beige-200 px-2 py-1 border border-beige-300">
                    {tag}
                </span>
            ))}
         </div>
         
         <p className="text-xs text-slate-500 font-medium mb-2 border-l-2 border-accent-gold pl-2">{university.tuition}</p>
         <p className="text-sm text-slate-700 mb-5 line-clamp-3 font-light leading-relaxed">{university.description}</p>

         <div className="mt-auto flex gap-3 pt-4 border-t border-slate-100">
            <a 
                href={university.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 py-2 text-center text-xs font-bold uppercase tracking-widest text-brand-700 border border-brand-700 hover:bg-brand-700 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
            >
                Visit Site
            </a>
            
            {!isSaved ? (
                <button 
                    onClick={(e) => { e.stopPropagation(); onSave(university); }}
                    className="flex-1 py-2 text-center text-xs font-bold uppercase tracking-widest text-white bg-brand-700 hover:bg-brand-800 transition-colors"
                >
                    Save
                </button>
            ) : (
                <button 
                    className="flex-1 py-2 text-center text-xs font-bold uppercase tracking-widest text-white bg-accent-olive cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    Saved
                </button>
            )}

            {!minimal && onDiscard && (
                 <button 
                 onClick={(e) => { e.stopPropagation(); onDiscard(university.id); }}
                 className="w-9 flex items-center justify-center text-slate-400 hover:text-accent-rust hover:bg-red-50 border border-slate-200 hover:border-accent-rust transition-colors"
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