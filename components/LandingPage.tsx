
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-beige-100 flex flex-col font-sans text-slate-900 selection:bg-accent-gold selection:text-white">
      {/* Navbar */}
      <nav className="w-full px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-brand-700 flex items-center justify-center text-white font-serif text-2xl shadow-xl">
             G
           </div>
           <span className="font-serif text-3xl tracking-tight text-brand-900 font-bold">Gradwyn</span>
        </div>
        <div className="hidden md:flex gap-10 font-heading text-sm tracking-widest text-brand-900 uppercase font-bold">
            <a href="#" className="hover:text-brand-700 transition-colors">Methodology</a>
            <a href="#" className="hover:text-brand-700 transition-colors">Mentors</a>
            <a href="#" className="hover:text-brand-700 transition-colors">Partners</a>
        </div>
        <button 
          onClick={onGetStarted}
          className="px-8 py-3 bg-white border-2 border-brand-900 text-brand-900 font-bold font-heading uppercase tracking-widest hover:bg-brand-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          Log In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center max-w-6xl mx-auto">
        
        <div className="mb-6 inline-block animate-fade-in">
            <span className="px-4 py-2 bg-brand-100 text-brand-800 font-bold font-heading uppercase tracking-widest text-xs border border-brand-200 rounded-full">
                Now Accepting Applications for Fall 2025
            </span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-brand-900 mb-8 leading-tight tracking-tight">
          The Ivy League <br/>
          <span className="italic font-light text-brand-700">of Intelligence.</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-600 mb-12 leading-relaxed font-light">
          Gradwyn leverages advanced AI research agents to curate a bespoke list of elite universities, connect you with alumni mentors, and optimize your candidacy.
        </p>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-md md:max-w-none justify-center">
          <button 
            onClick={onGetStarted}
            className="px-10 py-5 bg-brand-700 text-white font-bold font-heading uppercase tracking-widest text-lg hover:bg-brand-800 transition-all shadow-2xl shadow-brand-900/20 hover:-translate-y-1"
          >
            Begin Assessment
          </button>
          <button className="px-10 py-5 bg-transparent border-2 border-slate-300 text-slate-600 font-bold font-heading uppercase tracking-widest text-lg hover:border-brand-700 hover:text-brand-700 transition-colors">
            View Demo
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <p className="text-xs font-bold font-heading uppercase tracking-widest text-slate-400 mb-6">Trusted by applicants accepted to</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
                <span className="font-serif font-bold text-xl md:text-2xl text-slate-500">Harvard</span>
                <span className="font-serif font-bold text-xl md:text-2xl text-slate-500">Stanford</span>
                <span className="font-serif font-bold text-xl md:text-2xl text-slate-500">Oxford</span>
                <span className="font-serif font-bold text-xl md:text-2xl text-slate-500">MIT</span>
                <span className="font-serif font-bold text-xl md:text-2xl text-slate-500">Cambridge</span>
            </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
