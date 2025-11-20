
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-200">
             US
           </div>
           <span className="font-bold text-xl tracking-tight">UniScout AI</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-slate-500 text-sm">
            <a href="#" className="hover:text-brand-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-brand-600 transition-colors">For Universities</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Mentorship</a>
        </div>
        <button 
          onClick={onGetStarted}
          className="px-5 py-2 bg-brand-50 text-brand-700 font-bold rounded-full hover:bg-brand-100 transition-colors text-sm"
        >
          Log In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold tracking-wide uppercase animate-fade-in">
             The Future of University Search
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-slate-900 leading-tight animate-fade-in-up">
            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">perfect match</span> <br className="hidden md:block"/> with AI-powered research.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Stop browsing endless lists. UniScout analyzes thousands of universities, student forums, and authentic reviews to build a personalized dashboard just for you.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-300">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-brand-200 hover:shadow-2xl hover:bg-brand-700 hover:-translate-y-1 transition-all w-full md:w-auto"
            >
              Start Your Journey
            </button>
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all w-full md:w-auto flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
              </svg>
              Watch Demo
            </button>
          </div>

          {/* Social Proof / Mock UI */}
          <div className="mt-20 relative">
             <div className="absolute inset-0 bg-brand-500 blur-3xl opacity-10 rounded-full transform scale-75 pointer-events-none"></div>
             <img 
                src="https://placehold.co/1200x600/f8fafc/e2e8f0?text=AI+Research+Dashboard+Preview" 
                alt="Dashboard Preview" 
                className="relative rounded-2xl shadow-2xl border border-slate-200 w-full object-cover mx-auto transform hover:scale-[1.02] transition-transform duration-700"
             />
             
             {/* Floating Cards */}
             <div className="absolute -top-6 -left-4 md:left-10 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-bold">Match Found</p>
                    <p className="text-sm font-bold text-slate-800">Stanford University</p>
                </div>
             </div>

             <div className="absolute -bottom-6 -right-4 md:right-10 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 animate-bounce-slow animation-delay-500">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 001.402 10.06a.75.75 0 01-.23-1.337A60.653 60.653 0 0111.7 2.805z" /></svg>
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-bold">Scholarship</p>
                    <p className="text-sm font-bold text-slate-800">Found $25k Grant</p>
                </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} UniScout AI. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
