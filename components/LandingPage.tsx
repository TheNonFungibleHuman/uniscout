
import React, { useState } from 'react';

interface LandingPageProps {
  onGetStarted: (role: 'applicant' | 'mentor' | 'university') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [hoveredRole, setHoveredRole] = useState<'applicant' | 'mentor' | 'university' | null>(null);

  const getFlexClass = (role: 'applicant' | 'mentor' | 'university') => {
    if (!hoveredRole) return 'flex-[1]';
    return hoveredRole === role ? 'flex-[2]' : 'flex-[0.5]';
  };

  const getOpacityClass = (role: 'applicant' | 'mentor' | 'university') => {
      if (!hoveredRole) return 'opacity-100';
      return hoveredRole === role ? 'opacity-100' : 'opacity-50';
  };

  return (
    <div className="h-screen bg-brand-900 flex flex-col font-sans overflow-hidden relative">
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center pointer-events-none">
             <div className="flex items-center gap-3 pointer-events-auto">
                <div className="w-10 h-10 bg-white text-brand-900 flex items-center justify-center font-serif font-bold text-xl shadow-xl">
                    G
                </div>
                <span className="font-serif text-2xl tracking-tight text-white font-bold drop-shadow-md">Gradwyn</span>
             </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row w-full h-full">
            {/* STUDENT PANEL */}
            <div 
                className={`${getFlexClass('applicant')} bg-beige-100 relative transition-all duration-500 ease-in-out cursor-pointer group border-r border-slate-200 overflow-hidden flex flex-col justify-end`}
                onMouseEnter={() => setHoveredRole('applicant')}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => onGetStarted('applicant')}
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-beige-100 via-transparent to-transparent opacity-90"></div>
                
                <div className={`p-8 md:p-12 relative z-10 ${getOpacityClass('applicant')} transition-opacity duration-300`}>
                    <span className="inline-block px-3 py-1 bg-brand-700 text-white text-xs font-bold uppercase tracking-widest mb-4">For Applicants</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-900 mb-4 leading-tight">
                        Find Your <br/> Perfect Match
                    </h2>
                    <p className="text-slate-600 text-lg mb-8 max-w-md leading-relaxed">
                        Leverage AI to research elite universities and optimize your candidacy for the world's top institutions.
                    </p>
                    <button className="px-8 py-3 border-2 border-brand-900 text-brand-900 font-bold font-heading uppercase tracking-widest group-hover:bg-brand-900 group-hover:text-white transition-all flex items-center gap-2">
                        Begin Journey
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* MENTOR PANEL */}
            <div 
                className={`${getFlexClass('mentor')} bg-brand-800 relative transition-all duration-500 ease-in-out cursor-pointer group border-r border-brand-900 overflow-hidden flex flex-col justify-end`}
                onMouseEnter={() => setHoveredRole('mentor')}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => onGetStarted('mentor')}
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/50 to-transparent"></div>

                <div className={`p-8 md:p-12 relative z-10 ${getOpacityClass('mentor')} transition-opacity duration-300`}>
                    <span className="inline-block px-3 py-1 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest mb-4">For Mentors</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                        Guide the <br/> Next Generation
                    </h2>
                    <p className="text-brand-100 text-lg mb-8 max-w-md leading-relaxed">
                        Connect with aspiring scholars, share your academic journey, and shape future leaders.
                    </p>
                    <button className="px-8 py-3 border-2 border-white text-white font-bold font-heading uppercase tracking-widest group-hover:bg-white group-hover:text-brand-900 transition-all flex items-center gap-2">
                        Join as Mentor
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* UNIVERSITY PANEL */}
            <div 
                className={`${getFlexClass('university')} bg-slate-900 relative transition-all duration-500 ease-in-out cursor-pointer group overflow-hidden flex flex-col justify-end`}
                onMouseEnter={() => setHoveredRole('university')}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => onGetStarted('university')}
            >
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"></div>

                <div className={`p-8 md:p-12 relative z-10 ${getOpacityClass('university')} transition-opacity duration-300`}>
                    <span className="inline-block px-3 py-1 bg-slate-700 text-white text-xs font-bold uppercase tracking-widest mb-4">For Universities</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                        Recruit <br/> Top Talent
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-md leading-relaxed">
                        Partner with Gradwyn to identify and engage with high-potential global candidates.
                    </p>
                    <button className="px-8 py-3 border-2 border-white text-white font-bold font-heading uppercase tracking-widest group-hover:bg-white group-hover:text-slate-900 transition-all flex items-center gap-2">
                        Partner Access
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default LandingPage;
