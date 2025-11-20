
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, University, Mentor, Application } from '../types';
import { MOCK_MENTORS, MOCK_DATABASE_UNIVERSITIES, AUTOCOMPLETE_UNIVERSITIES } from '../constants';
import UniversityCard from './UniversityCard';
import EditProfileModal from './EditProfileModal';
import ApplicationFormModal from './ApplicationFormModal';

interface DashboardProps {
  profile: UserProfile;
  savedSchools: University[];
  applications: Application[];
  onDiscardSchool: (id: string) => void;
  onSaveSchool: (school: University) => void;
  onUpdateApplication: (app: Application) => void;
  onWithdrawApplication: (appId: string) => void;
  renderChat: () => React.ReactNode;
  onUpdateProfile: (newProfile: UserProfile) => void;
  onLogout: () => void;
}

type DashboardView = 'schools' | 'mentors' | 'chat' | 'prep' | 'tracker' | 'forum' | 'guides';

// Extracted components to prevent re-mounting on every render
const SidebarItem: React.FC<{ 
  view: DashboardView; 
  currentView: DashboardView; 
  label: string; 
  icon: React.ReactNode; 
  onClick: () => void 
}> = ({ view, currentView, label, icon, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1
            ${currentView === view 
                ? 'bg-brand-50 text-brand-600 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const SchoolProfileView = ({ 
    uni, 
    onClose, 
    profile, 
    onStartApplication 
}: { 
    uni: University; 
    onClose: () => void; 
    profile: UserProfile;
    onStartApplication: (uni: University) => void; 
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      <div className="h-40 bg-gradient-to-r from-brand-600 to-indigo-700 p-6 relative">
         <button 
            onClick={onClose}
            className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
         >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
         </button>
         <div className="absolute bottom-6 left-6">
             <h2 className="text-3xl font-bold text-white">{uni.name}</h2>
             <p className="text-brand-100 flex items-center gap-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.62.829.799 1.654 1.38 2.274 1.766a11.121 11.121 0 00.757.432l.018.009.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                </svg>
                {uni.location}
             </p>
         </div>
         <div className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/30">
            <span className="block text-xs font-medium opacity-80">Match Score</span>
            <span className="text-xl font-bold">{uni.matchScore}%</span>
         </div>
      </div>
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <section>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Overview</h3>
                <p className="text-slate-600 leading-relaxed">{uni.description} This university is known for its vibrant campus life and strong academic standing. Students report high satisfaction with faculty engagement and career support services.</p>
            </section>
            <section>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Why it fits you</h3>
                <div className="flex flex-wrap gap-2">
                    {profile.keyMetrics.map(m => (
                        <span key={m} className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            Strong {m.split(' ')[0]}
                        </span>
                    ))}
                </div>
            </section>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                 <button 
                    onClick={() => onStartApplication(uni)}
                    className="flex-1 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                 >
                    <span>Start Application</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
                    </svg>
                </button>
                <a href={uni.website} target="_blank" rel="noreferrer" className="flex-1 text-center border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:border-brand-300 hover:text-brand-600 transition-colors">
                    Visit Website
                </a>
            </div>
         </div>
         <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4">Quick Stats</h4>
                <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Tuition</span>
                        <span className="font-medium text-slate-900">{uni.tuition}</span>
                    </li>
                     <li className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Enrollment</span>
                        <span className="font-medium text-slate-900">15,000+</span>
                    </li>
                     <li className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Acceptance Rate</span>
                        <span className="font-medium text-slate-900">~12%</span>
                    </li>
                </ul>
            </div>
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2">Connect with Mentors</h4>
                <p className="text-xs text-indigo-700 mb-4">We found 3 mentors from {uni.name}.</p>
                <button className="w-full py-2 bg-indigo-200 text-indigo-800 rounded-lg text-sm font-bold hover:bg-indigo-300">View Mentors</button>
            </div>
         </div>
      </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ 
    profile, 
    savedSchools, 
    applications,
    onDiscardSchool, 
    onSaveSchool, 
    onUpdateApplication,
    onWithdrawApplication,
    renderChat, 
    onUpdateProfile, 
    onLogout 
}) => {
  const [currentView, setCurrentView] = useState<DashboardView>('schools');
  const [selectedSchool, setSelectedSchool] = useState<University | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Application Modal State
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState<Application | null>(null);
  const [appUniversity, setAppUniversity] = useState<University | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<University[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle Search Logic
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
        const query = searchQuery.toLowerCase();
        const results = AUTOCOMPLETE_UNIVERSITIES.filter(uni => 
            uni.name.toLowerCase().includes(query) || 
            uni.location.toLowerCase().includes(query)
        );
        setSearchResults(results.slice(0, 5)); // Limit to 5 results
    } else {
        setSearchResults([]);
    }
  }, [searchQuery]);

  // Click outside search to close
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
              setIsSearchFocused(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchResultClick = (uni: University) => {
      // Check if already saved
      if (!savedSchools.some(s => s.id === uni.id)) {
          onSaveSchool(uni);
      }
      setSelectedSchool(uni);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearchFocused(false);
  };

  const handleStartApplication = (uni: University) => {
      // Check if we already have an application
      const existingApp = applications.find(a => a.university.id === uni.id);
      
      if (existingApp) {
          setCurrentApp(existingApp);
          setAppUniversity(null);
      } else {
          setCurrentApp(null);
          setAppUniversity(uni);
      }
      
      setIsAppModalOpen(true);
      setSelectedSchool(null); // Close profile view if open
  };

  const handleResumeApplication = (app: Application) => {
      setCurrentApp(app);
      setAppUniversity(null);
      setIsAppModalOpen(true);
  };

  // If user has no saved schools, show some recommendations from "database"
  const displaySchools = savedSchools.length > 0 ? savedSchools : MOCK_DATABASE_UNIVERSITIES;
  const isFallback = savedSchools.length === 0;

  const handleSidebarClick = (view: DashboardView) => {
      setCurrentView(view);
      setSelectedSchool(null);
      setIsMobileMenuOpen(false); // Close menu on mobile
  };

  const handleProfileUpdateWithRedirect = (newProfile: UserProfile) => {
      onUpdateProfile(newProfile);
      // Force redirect to Chat View to engage with AI
      setCurrentView('chat');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-brand-200 shadow-md">US</div>
                    <span className="font-bold text-lg tracking-tight text-slate-800">UniScout Hub</span>
                </div>
                {/* Close button for mobile only */}
                <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <nav className="space-y-2">
                <SidebarItem 
                    view="schools"
                    currentView={currentView} 
                    label="My Schools" 
                    onClick={() => handleSidebarClick('schools')}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 001.402 10.06a.75.75 0 01-.23-1.337A60.653 60.653 0 0111.7 2.805z" /><path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 0110.94 15.473a.75.75 0 002.12 0z" /><path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" /></svg>}
                />
                <SidebarItem 
                    view="tracker" 
                    currentView={currentView}
                    label="Application Tracker" 
                    onClick={() => handleSidebarClick('tracker')}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>}
                />
                <SidebarItem 
                    view="mentors" 
                    currentView={currentView}
                    label="Find Mentors" 
                    onClick={() => handleSidebarClick('mentors')}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.602-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>}
                />
                <SidebarItem 
                    view="chat" 
                    currentView={currentView}
                    label="AI Assistant" 
                    onClick={() => handleSidebarClick('chat')}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" /></svg>}
                />
                <SidebarItem 
                    view="prep" 
                    currentView={currentView}
                    label="App Prep" 
                    onClick={() => handleSidebarClick('prep')}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>}
                />
                <SidebarItem 
                    view="forum" 
                    currentView={currentView}
                    label="Community" 
                    onClick={() => handleSidebarClick('forum')}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" /><path d="M5.082 14.254a6.741 6.741 0 00-2.817.557.75.75 0 01-.568-.372A6.786 6.786 0 014.36 6.05m15.28 8.204a6.741 6.741 0 002.817.557.75.75 0 00.568-.372 6.786 6.786 0 00-2.697-8.394" /></svg>}
                />
            </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50 md:bg-white">
            <button 
            onClick={() => { setIsEditModalOpen(true); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 hover:bg-slate-100 p-2 rounded-lg transition-colors text-left mb-2"
            >
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden border border-slate-100">
                    <img 
                        src={profile.photoUrl || `https://ui-avatars.com/api/?name=${profile.name || 'User'}&background=random`} 
                        alt="User" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{profile.name}</p>
                    <div className="flex items-center gap-1 text-xs text-brand-600">
                        <span className="truncate">Edit Profile</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                        </svg>
                    </div>
                </div>
            </button>
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 py-2 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
                </svg>
                Sign Out
            </button>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
        onSave={handleProfileUpdateWithRedirect}
      />

      <ApplicationFormModal
         isOpen={isAppModalOpen}
         onClose={() => setIsAppModalOpen(false)}
         application={currentApp}
         university={appUniversity}
         userProfile={profile}
         onSave={onUpdateApplication}
      />

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <aside className={`
        fixed md:relative z-40 h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-sm
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
         <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
          {/* Mobile Header */}
          <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center flex-shrink-0 z-20 relative">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
              </button>
              <span className="font-bold text-lg text-slate-800">UniScout Hub</span>
              <div className="w-8"></div> {/* Spacer for center alignment */}
          </div>

          {/* View Content */}
          <div className={`flex-1 p-4 md:p-8 ${currentView === 'chat' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
              {selectedSchool ? (
                  <SchoolProfileView 
                    uni={selectedSchool} 
                    onClose={() => setSelectedSchool(null)} 
                    profile={profile}
                    onStartApplication={handleStartApplication}
                  />
              ) : (
                  <>
                    {currentView === 'schools' && (
                        <div className="max-w-6xl mx-auto animate-fade-in relative">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Your Universities</h2>
                                    <p className="text-slate-500">
                                        {isFallback 
                                            ? "We've curated these matches based on your profile." 
                                            : "Manage your shortlisted universities and applications."}
                                    </p>
                                </div>
                                
                                {/* Global Search Bar */}
                                <div className="relative w-full md:w-80" ref={searchRef}>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="text"
                                            placeholder="Search global universities..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => setIsSearchFocused(true)}
                                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition duration-150 ease-in-out shadow-sm"
                                        />
                                    </div>
                                    
                                    {/* Autocomplete Dropdown */}
                                    {isSearchFocused && searchQuery.trim().length > 1 && (
                                        <div className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm z-50">
                                            {searchResults.length > 0 ? (
                                                searchResults.map((uni) => (
                                                    <button
                                                        key={uni.id}
                                                        onClick={() => handleSearchResultClick(uni)}
                                                        className="w-full text-left cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-slate-100"
                                                    >
                                                        <div className="flex items-center">
                                                            <span className="font-normal block truncate text-slate-800">{uni.name}</span>
                                                        </div>
                                                        <span className="text-xs text-slate-500 block truncate">{uni.location}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-slate-500 italic">
                                                    No results found.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displaySchools.map(uni => (
                                    <UniversityCard 
                                        key={uni.id}
                                        university={uni}
                                        onSave={() => {}}
                                        isSaved={!isFallback}
                                        minimal={false}
                                        onClick={() => setSelectedSchool(uni)}
                                        onDiscard={!isFallback ? onDiscardSchool : undefined}
                                        className="w-full"
                                    />
                                ))}
                                {isFallback && (
                                    <div className="col-span-full bg-blue-50 p-4 rounded-lg text-center text-blue-600 text-sm mt-4">
                                        Tip: Chat with the AI to find and save more personalized options!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentView === 'tracker' && (
                         <div className="max-w-6xl mx-auto animate-fade-in">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-800">Application Tracker</h2>
                                <p className="text-slate-500">Manage your active applications and track progress.</p>
                            </div>

                            {applications.length === 0 ? (
                                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                                    <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Applications Started Yet</h3>
                                    <p className="text-slate-500 mb-6 max-w-md mx-auto">Start an application from a University's profile page to see your progress here.</p>
                                    <button 
                                        onClick={() => handleSidebarClick('schools')}
                                        className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors"
                                    >
                                        Find a School
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {applications.map(app => (
                                        <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center">
                                            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">
                                                {app.university.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            
                                            <div className="flex-1 w-full">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-800">{app.university.name}</h3>
                                                        <p className="text-slate-500 text-sm">Last updated: {app.lastUpdated.toLocaleDateString()}</p>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                                        ${app.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {app.status.replace('_', ' ')}
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-medium text-slate-600">
                                                        <span>Progress</span>
                                                        <span>{app.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                        <div className="bg-brand-600 h-full rounded-full transition-all duration-500" style={{ width: `${app.progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex md:flex-col gap-3 w-full md:w-auto">
                                                {app.status === 'draft' && (
                                                    <button 
                                                        onClick={() => handleResumeApplication(app)}
                                                        className="flex-1 md:w-32 px-4 py-2 bg-brand-600 text-white font-bold text-sm rounded-lg hover:bg-brand-700 transition-colors text-center"
                                                    >
                                                        Resume
                                                    </button>
                                                )}
                                                {app.status === 'submitted' && (
                                                     <button 
                                                     disabled
                                                     className="flex-1 md:w-32 px-4 py-2 bg-slate-100 text-slate-400 font-bold text-sm rounded-lg cursor-not-allowed text-center"
                                                 >
                                                     View Status
                                                 </button>
                                                )}
                                                <button 
                                                    onClick={() => onWithdrawApplication(app.id)}
                                                    className="px-4 py-2 text-slate-400 hover:text-red-500 font-medium text-sm transition-colors"
                                                >
                                                    Withdraw
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                         </div>
                    )}

                    {currentView === 'mentors' && (
                        <div className="max-w-6xl mx-auto animate-fade-in">
                             <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-800">Connect with Mentors</h2>
                                <p className="text-slate-500">Get advice from current students and alumni.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {MOCK_MENTORS.map(mentor => (
                                    <div key={mentor.id} className="bg-white rounded-xl border border-slate-200 p-6 flex gap-4 hover:shadow-md transition-all">
                                        <img src={mentor.image} alt={mentor.name} className="w-16 h-16 rounded-full object-cover" />
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900">{mentor.name}</h3>
                                            <p className="text-brand-600 text-sm font-medium mb-1">{mentor.role} • {mentor.university}</p>
                                            <p className="text-slate-500 text-sm mb-3 line-clamp-2">{mentor.bio}</p>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {mentor.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">{tag}</span>
                                                ))}
                                            </div>
                                            <button className="text-sm font-bold text-brand-600 hover:underline">Request Session →</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentView === 'chat' && (
                        <div className="h-full rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                            {renderChat()}
                        </div>
                    )}

                    {currentView === 'prep' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-800">Application Prep</h2>
                                <p className="text-slate-500">Tools to help you ace your application.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center hover:border-brand-300 transition-colors cursor-pointer group">
                                    <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">AI Essay Review</h3>
                                    <p className="text-slate-500 mb-4">Get instant feedback on your personal statement structure, tone, and impact.</p>
                                    <span className="text-brand-600 font-bold">Start Review →</span>
                                </div>
                                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center hover:border-brand-300 transition-colors cursor-pointer group">
                                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Mock Interviews</h3>
                                    <p className="text-slate-500 mb-4">Practice answering common admission interview questions with AI feedback.</p>
                                    <span className="text-indigo-600 font-bold">Start Practice →</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {(currentView === 'forum' || currentView === 'guides') && (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.063m.002 0a9.003 9.003 0 00-1.535-1.533l-3.876-3.88a1 1 0 00-1.415 1.415l.001.001m.001 0l3.29 3.29a.5.5 0 00.718 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Under Construction</h3>
                            <p className="text-slate-500 max-w-md">This feature is being built by our engineering team. Check back soon for community discussions and comprehensive guides!</p>
                        </div>
                    )}
                  </>
              )}
          </div>
      </main>
    </div>
  );
};

export default Dashboard;
