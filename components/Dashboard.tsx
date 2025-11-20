
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, University, Mentor, Application, Scholarship, Guide } from '../types';
import { MOCK_MENTORS, MOCK_DATABASE_UNIVERSITIES, AUTOCOMPLETE_UNIVERSITIES, MOCK_SCHOLARSHIPS, MOCK_GUIDES } from '../constants';
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

type DashboardView = 'schools' | 'mentors' | 'chat' | 'scholarships' | 'tracker' | 'forum' | 'guides' | 'prep';

const SidebarItem: React.FC<{ 
  view: DashboardView; 
  currentView: DashboardView; 
  label: string; 
  icon: React.ReactNode; 
  onClick: () => void 
}> = ({ view, currentView, label, icon, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-6 py-4 transition-all font-heading text-sm font-bold uppercase tracking-widest border-l-4
            ${currentView === view 
                ? 'bg-brand-50 text-brand-700 border-brand-700' 
                : 'border-transparent text-slate-500 hover:bg-beige-200 hover:text-brand-700'}`}
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
}) => {
  const [coverError, setCoverError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const defaultCover = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop';
  const coverImage = !coverError && uni.images && uni.images[0] ? uni.images[0] : defaultCover;
  const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(uni.name)}&background=f6f1e9&color=162714&size=128&font-size=0.33&bold=true`;

  return (
  <div className="bg-white shadow-2xl border border-slate-200 overflow-hidden animate-fade-in flex flex-col h-full">
      {/* Header Image & Title */}
      <div className="h-64 md:h-80 relative bg-brand-900">
         <div className="absolute inset-0 bg-brand-900/40"></div>
         <img 
            src={coverImage} 
            alt="Campus" 
            className="w-full h-full object-cover opacity-90"
            onError={() => setCoverError(true)}
         />
         
         <button 
            onClick={onClose}
            className="absolute top-6 left-6 bg-white/90 hover:bg-white text-brand-900 p-3 shadow-lg transition-colors backdrop-blur-sm border border-brand-900"
         >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
         </button>

         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-900 to-transparent p-8 pt-24 flex flex-col md:flex-row items-end justify-between gap-6">
             <div className="flex items-end gap-6">
                <div className="w-24 h-24 bg-white p-2 shadow-lg hidden md:flex items-center justify-center">
                    <img 
                        src={!logoError && uni.logo ? uni.logo : fallbackLogo} 
                        alt="Logo" 
                        className="w-full h-full object-contain" 
                        onError={() => setLogoError(true)}
                    />
                </div>
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-serif tracking-tight">{uni.name}</h2>
                    <p className="text-beige-300 flex items-center gap-2 mt-2 font-heading font-bold uppercase tracking-widest text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-accent-gold">
                            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.62.829.799 1.654 1.38 2.274 1.766a11.121 11.121 0 00.757.432l.018.009.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                        </svg>
                        {uni.location}
                    </p>
                </div>
             </div>
             
             <div className="bg-white/10 backdrop-blur-md text-white px-6 py-3 border border-white/20">
                <span className="block text-xs font-bold uppercase tracking-widest opacity-80 font-heading text-accent-gold">Alignment Score</span>
                <span className="text-3xl font-bold font-serif">{uni.matchScore}%</span>
             </div>
         </div>
      </div>

      <div className="p-8 md:p-12 overflow-y-auto bg-beige-50 flex-1">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
                <section>
                    <h3 className="text-xl font-bold text-brand-900 mb-4 font-heading uppercase tracking-widest border-b border-brand-200 pb-2">Institutional Overview</h3>
                    <p className="text-slate-800 leading-loose text-lg font-light">{uni.description} Founded on principles of excellence, {uni.name} offers a rigorous intellectual environment. The campus blends historic tradition with cutting-edge research facilities, fostering a community of scholars dedicated to global impact.</p>
                </section>
                
                {/* Image Gallery */}
                {uni.images && uni.images.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold text-brand-900 mb-4 font-heading uppercase tracking-widest border-b border-brand-200 pb-2">Campus Visuals</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {uni.images.map((img, idx) => (
                                <div key={idx} className="h-40 overflow-hidden group relative cursor-pointer bg-slate-200">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img 
                                        src={img} 
                                        alt={`Campus view ${idx}`} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = defaultCover;
                                        }}
                                    />
                                </div>
                            ))}
                             {/* Add some placeholders if not enough images */}
                             <div className="h-40 overflow-hidden group relative bg-slate-200">
                                <img src={defaultCover} alt="Students" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                             </div>
                        </div>
                    </section>
                )}

                <section>
                    <h3 className="text-xl font-bold text-brand-900 mb-4 font-heading uppercase tracking-widest border-b border-brand-200 pb-2">Strategic Fit</h3>
                    <div className="flex flex-wrap gap-3">
                        {profile.keyMetrics.map(m => (
                            <span key={m} className="bg-white text-brand-800 border border-brand-200 px-4 py-2 text-sm font-bold font-heading uppercase tracking-wider flex items-center gap-2 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-accent-olive">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                                High Alignment: {m.split(' ')[0]}
                            </span>
                        ))}
                    </div>
                </section>

                <div className="flex flex-col sm:flex-row gap-6 mt-8 p-8 bg-white border border-brand-100 shadow-lg">
                     <div className="flex-1">
                         <h4 className="font-serif text-2xl text-brand-900 mb-2">Ready to Apply?</h4>
                         <p className="text-slate-500 mb-4">Initiate your candidacy for the upcoming term.</p>
                         <button 
                            onClick={() => onStartApplication(uni)}
                            className="w-full bg-brand-700 text-white px-8 py-4 font-heading font-bold uppercase tracking-widest hover:bg-brand-800 transition-all shadow-xl shadow-brand-900/10 hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
                         >
                            <span>Begin Application</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
                            </svg>
                        </button>
                     </div>
                    <div className="flex-1 border-l border-slate-100 pl-0 sm:pl-6 flex flex-col justify-end">
                        <a href={uni.website} target="_blank" rel="noreferrer" className="w-full text-center border-2 border-slate-200 text-slate-600 px-6 py-4 font-heading font-bold uppercase tracking-widest hover:bg-slate-50 hover:border-slate-400 hover:text-slate-800 transition-all">
                            Visit Official Website
                        </a>
                    </div>
                </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
                <div className="bg-white p-8 border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-brand-900 mb-6 font-heading uppercase tracking-widest border-b border-brand-100 pb-2">Key Statistics</h4>
                    <ul className="space-y-5 text-sm">
                        <li className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium uppercase tracking-wider text-xs">Tuition</span>
                            <span className="font-bold text-brand-900 text-base">{uni.tuition}</span>
                        </li>
                         <li className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium uppercase tracking-wider text-xs">Enrollment</span>
                            <span className="font-bold text-brand-900 text-base">15,000+</span>
                        </li>
                         <li className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium uppercase tracking-wider text-xs">Acceptance</span>
                            <span className="font-bold text-brand-900 text-base">~12%</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium uppercase tracking-wider text-xs">Location Type</span>
                            <span className="font-bold text-brand-900 text-base">Urban / Historic</span>
                        </li>
                    </ul>
                </div>
                <div className="bg-accent-olive p-8 text-white border border-accent-olive shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <h4 className="font-bold text-white mb-3 font-heading uppercase tracking-widest relative z-10">Alumni Network</h4>
                    <p className="text-sm text-beige-200 mb-6 leading-relaxed relative z-10">Connect with 3 distinguished mentors from {uni.name} available for consultation.</p>
                    <button className="w-full py-3 bg-white text-accent-olive font-heading font-bold uppercase tracking-widest hover:bg-beige-100 transition-colors relative z-10">View Mentors</button>
                </div>
            </div>
         </div>
      </div>
  </div>
  );
};

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
  
  // Scholarship State
  const [scholarshipTab, setScholarshipTab] = useState<'all' | 'forYou'>('all');
  const [scholarshipFilter, setScholarshipFilter] = useState<string>('All');
  
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

  // Scholarship Filtering Logic
  const getScholarships = () => {
      let filtered = MOCK_SCHOLARSHIPS;
      
      // For You Logic: Simple check against location or keywords matching profile
      if (scholarshipTab === 'forYou') {
          filtered = filtered.filter(sch => {
              const locationMatch = profile.preferredLocations.some(loc => sch.location?.includes(loc) || sch.tags.some(t => t.includes(loc)));
              const degreeMatch = sch.tags.some(t => profile.degreeLevel.includes(t));
              const generalTagMatch = sch.tags.includes('Global') || sch.tags.includes('All Fields');
              return locationMatch || degreeMatch || generalTagMatch;
          });
      }

      if (scholarshipFilter !== 'All') {
          filtered = filtered.filter(sch => sch.tags.includes(scholarshipFilter));
      }

      return filtered;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
        <div className="p-8 border-b border-slate-200 bg-beige-100">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-700 flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">G</div>
                    <span className="font-serif font-bold text-2xl tracking-tight text-brand-900">Gradwyn</span>
                </div>
                {/* Close button for mobile only */}
                <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="mb-2 px-2">
                <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-accent-gold mb-1">Scholar Profile</p>
                <p className="font-bold text-brand-900 text-lg truncate font-serif">{profile.name}</p>
            </div>
        </div>
        
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto no-scrollbar">
            <SidebarItem 
                view="schools"
                currentView={currentView} 
                label="Institutions" 
                onClick={() => handleSidebarClick('schools')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 001.402 10.06a.75.75 0 01-.23-1.337A60.653 60.653 0 0111.7 2.805z" /><path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 0110.94 15.473a.75.75 0 002.12 0z" /><path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" /></svg>}
            />
            <SidebarItem 
                view="tracker" 
                currentView={currentView}
                label="Applications" 
                onClick={() => handleSidebarClick('tracker')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>}
            />
            <SidebarItem 
                view="mentors" 
                currentView={currentView}
                label="Mentorship" 
                onClick={() => handleSidebarClick('mentors')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.602-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>}
            />
            <SidebarItem 
                view="scholarships" 
                currentView={currentView}
                label="Scholarships" 
                onClick={() => handleSidebarClick('scholarships')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.324.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" /><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.516.412 1.108.682 1.719.787v2.905a3.799 3.799 0 001.72.756c.712.566 1.112 1.35 1.112 2.178 0 .829-.4 1.612-1.113 2.178a4.784 4.784 0 01-1.719.788v.816a.75.75 0 001.5 0v-.816a3.836 3.836 0 001.72-.756c.712-.566 1.112-1.35 1.112-2.178 0-.829-.4-1.612-1.113-2.178a4.784 4.784 0 01-1.719-.787V9.252a3.838 3.838 0 00-1.72-.756c-.712-.566-1.112-1.35-1.112-2.178 0-.829.4-1.612 1.113-2.178.516-.412 1.108-.682 1.719-.787V6z" clipRule="evenodd" /></svg>}
            />
            <SidebarItem 
                view="chat" 
                currentView={currentView}
                label="Intelligence" 
                onClick={() => handleSidebarClick('chat')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" /></svg>}
            />
            <SidebarItem 
                view="prep" 
                currentView={currentView}
                label="Prep Suite" 
                onClick={() => handleSidebarClick('prep')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>}
            />
            <SidebarItem 
                view="guides" 
                currentView={currentView}
                label="Guides" 
                onClick={() => handleSidebarClick('guides')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" /></svg>}
            />
        </nav>

        <div className="p-6 bg-beige-100 border-t border-slate-200">
            <button 
            onClick={() => { setIsEditModalOpen(true); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 hover:bg-white p-2 transition-colors text-left mb-3 border border-transparent hover:border-slate-200"
            >
                <div className="w-8 h-8 bg-slate-300 flex-shrink-0 overflow-hidden border border-slate-400">
                    <img 
                        src={profile.photoUrl || `https://ui-avatars.com/api/?name=${profile.name || 'User'}&background=random`} 
                        alt="User" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Preferences</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
            </button>
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-brand-900 hover:text-accent-rust py-2 transition-colors uppercase tracking-widest border border-slate-300 hover:bg-white"
            >
                Log Out
            </button>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-beige-100 overflow-hidden font-sans">
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
            className="fixed inset-0 bg-brand-900/70 z-30 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <aside className={`
        fixed md:relative z-40 h-full w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
         <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full bg-beige-100">
          {/* Mobile Header */}
          <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center flex-shrink-0 z-20 relative shadow-sm">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-brand-900 hover:bg-beige-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
              </button>
              <span className="font-serif font-bold text-xl text-brand-900">Gradwyn</span>
              <div className="w-8"></div> {/* Spacer for center alignment */}
          </div>

          {/* View Content */}
          <div className={`flex-1 p-4 md:p-12 ${currentView === 'chat' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
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
                        <div className="max-w-7xl mx-auto animate-fade-in relative">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                                <div>
                                    <h2 className="text-4xl font-bold text-brand-900 font-serif tracking-tight mb-3">Your Institutions</h2>
                                    <p className="text-slate-600 text-lg font-light">
                                        {isFallback 
                                            ? "Curated selections based on your academic profile." 
                                            : "Manage your shortlisted universities and candidacies."}
                                    </p>
                                </div>
                                
                                {/* Global Search Bar */}
                                <div className="relative w-full md:w-96" ref={searchRef}>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-brand-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="text"
                                            placeholder="Search global database..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => setIsSearchFocused(true)}
                                            className="block w-full pl-12 pr-4 py-4 border border-slate-300 leading-5 bg-white placeholder-slate-400 focus:outline-none focus:border-brand-700 focus:ring-1 focus:ring-brand-700 transition duration-150 ease-in-out shadow-sm font-medium text-brand-900 rounded-none"
                                        />
                                    </div>
                                    
                                    {/* Autocomplete Dropdown */}
                                    {isSearchFocused && searchQuery.trim().length > 1 && (
                                        <div className="absolute mt-0 w-full bg-white shadow-2xl max-h-80 overflow-auto z-50 border border-brand-900">
                                            {searchResults.length > 0 ? (
                                                searchResults.map((uni) => (
                                                    <button
                                                        key={uni.id}
                                                        onClick={() => handleSearchResultClick(uni)}
                                                        className="w-full text-left cursor-pointer select-none relative py-4 pl-6 pr-6 hover:bg-beige-100 border-b border-slate-100 last:border-0 transition-colors group"
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-serif font-bold block truncate text-brand-900 text-lg group-hover:text-brand-700">{uni.name}</span>
                                                        </div>
                                                        <span className="text-xs text-slate-500 block truncate font-heading uppercase tracking-wider">{uni.location}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="cursor-default select-none relative py-4 pl-6 pr-6 text-slate-500 italic">
                                                    No institutions found matching query.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                                {displaySchools.map(uni => (
                                    <UniversityCard 
                                        key={uni.id}
                                        university={uni}
                                        onSave={() => {}}
                                        isSaved={!isFallback}
                                        minimal={false}
                                        onClick={() => setSelectedSchool(uni)}
                                        onDiscard={!isFallback ? onDiscardSchool : undefined}
                                    />
                                ))}
                                {isFallback && (
                                    <div className="w-full bg-white border border-brand-200 p-8 text-center text-brand-900 shadow-sm mt-8">
                                        <p className="font-medium text-lg font-serif">Consult the Gradwyn Intelligence Chat to curate a personalized list.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentView === 'scholarships' && (
                         <div className="max-w-7xl mx-auto animate-fade-in">
                            <div className="mb-8">
                                <h2 className="text-4xl font-bold text-brand-900 font-serif tracking-tight mb-3">Financial Aid & Funding</h2>
                                <p className="text-slate-600 text-lg font-light">Explore scholarships matching your profile and academic goals.</p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 mb-8">
                                {/* Tabs */}
                                <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                                    <button 
                                        onClick={() => setScholarshipTab('all')}
                                        className={`px-6 py-2 text-sm font-bold uppercase tracking-widest rounded-md transition-all ${scholarshipTab === 'all' ? 'bg-brand-700 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        All Grants
                                    </button>
                                    <button 
                                        onClick={() => setScholarshipTab('forYou')}
                                        className={`px-6 py-2 text-sm font-bold uppercase tracking-widest rounded-md transition-all flex items-center gap-2 ${scholarshipTab === 'forYou' ? 'bg-accent-gold text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                                        </svg>
                                        For You
                                    </button>
                                </div>
                                
                                {/* Filter Dropdown */}
                                <select 
                                    className="p-2 bg-white border border-slate-200 text-slate-700 font-medium text-sm outline-none focus:border-brand-500"
                                    value={scholarshipFilter}
                                    onChange={(e) => setScholarshipFilter(e.target.value)}
                                >
                                    <option value="All">All Tags</option>
                                    <option value="Global">Global</option>
                                    <option value="UK">UK Specific</option>
                                    <option value="Masters">Master's Degree</option>
                                    <option value="PhD">PhD / Research</option>
                                    <option value="Women">Women in STEM</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {getScholarships().length > 0 ? getScholarships().map(sch => (
                                    <div key={sch.id} className="bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="bg-green-50 text-green-800 text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-green-100 inline-block mb-2">
                                                {sch.amount}
                                            </div>
                                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Deadline: {sch.deadline}</span>
                                        </div>
                                        <h3 className="text-xl font-serif font-bold text-brand-900 mb-1 group-hover:text-brand-700 transition-colors">{sch.name}</h3>
                                        <p className="text-xs text-accent-gold font-bold uppercase tracking-widest mb-4 font-heading">{sch.provider}</p>
                                        <p className="text-slate-600 text-sm mb-6 flex-1 leading-relaxed">{sch.description}</p>
                                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                                            <div className="flex gap-2">
                                                {sch.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] bg-beige-100 text-slate-600 px-2 py-1 rounded-none border border-beige-200">{tag}</span>
                                                ))}
                                            </div>
                                            <button className="text-brand-700 hover:text-brand-900 font-bold text-xs uppercase tracking-widest border-b-2 border-transparent hover:border-brand-700 transition-all pb-0.5">View Details</button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full p-12 text-center bg-white border border-slate-200 border-dashed">
                                        <p className="text-slate-400 font-medium">No scholarships found matching criteria.</p>
                                    </div>
                                )}
                            </div>
                         </div>
                    )}

                    {currentView === 'guides' && (
                         <div className="max-w-7xl mx-auto animate-fade-in">
                            <div className="mb-8">
                                <h2 className="text-4xl font-bold text-brand-900 font-serif tracking-tight mb-3">Resource Library</h2>
                                <p className="text-slate-600 text-lg font-light">Expert guides and strategies for navigating the admissions landscape.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {MOCK_GUIDES.map(guide => (
                                    <div key={guide.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer overflow-hidden">
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={guide.image} alt={guide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-800 shadow-sm">
                                                {guide.category}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                                                </svg>
                                                {guide.readTime}
                                            </div>
                                            <h3 className="text-xl font-bold font-serif text-brand-900 mb-3 group-hover:text-brand-600 transition-colors leading-tight">{guide.title}</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-6">{guide.description}</p>
                                            <span className="text-brand-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                                Read Article
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                    )}

                    {currentView === 'tracker' && (
                         <div className="max-w-7xl mx-auto animate-fade-in">
                            <div className="mb-12">
                                <h2 className="text-4xl font-bold text-brand-900 font-serif tracking-tight mb-3">Candidacy Tracker</h2>
                                <p className="text-slate-600 text-lg font-light">Monitor the status of your active applications.</p>
                            </div>

                            {applications.length === 0 ? (
                                <div className="bg-white border border-slate-200 p-20 text-center shadow-sm">
                                    <div className="w-24 h-24 bg-beige-100 text-brand-400 flex items-center justify-center mx-auto mb-8 border border-beige-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-900 mb-3 font-serif">No Applications Initiated</h3>
                                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Begin an application from an Institution's profile page.</p>
                                    <button 
                                        onClick={() => handleSidebarClick('schools')}
                                        className="px-10 py-4 bg-brand-700 text-white font-bold font-heading uppercase tracking-widest hover:bg-brand-800 transition-colors"
                                    >
                                        Browse Institutions
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {applications.map(app => (
                                        <div key={app.id} className="bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-10 items-start md:items-center group">
                                            <div className="w-20 h-20 bg-brand-900 text-white flex items-center justify-center font-serif font-bold text-3xl shrink-0 shadow-md">
                                                {app.university.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            
                                            <div className="flex-1 w-full">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-brand-900 font-serif group-hover:text-brand-700 transition-colors">{app.university.name}</h3>
                                                        <p className="text-slate-400 text-xs uppercase tracking-widest mt-1 font-heading">Last activity: {app.lastUpdated.toLocaleDateString()}</p>
                                                    </div>
                                                    <div className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest border
                                                        ${app.status === 'submitted' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-beige-100 text-brand-800 border-brand-200'}`}>
                                                        {app.status.replace('_', ' ')}
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-xs font-bold text-slate-500 font-heading uppercase tracking-widest">
                                                        <span>Completion</span>
                                                        <span>{app.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
                                                        <div className="bg-brand-700 h-full transition-all duration-500" style={{ width: `${app.progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex md:flex-col gap-4 w-full md:w-auto">
                                                {app.status === 'draft' && (
                                                    <button 
                                                        onClick={() => handleResumeApplication(app)}
                                                        className="flex-1 md:w-36 px-6 py-3 bg-brand-700 text-white font-heading font-bold text-xs uppercase tracking-widest hover:bg-brand-800 transition-colors text-center"
                                                    >
                                                        Resume
                                                    </button>
                                                )}
                                                {app.status === 'submitted' && (
                                                     <button 
                                                     disabled
                                                     className="flex-1 md:w-36 px-6 py-3 bg-slate-100 text-slate-400 font-heading font-bold text-xs uppercase tracking-widest cursor-not-allowed text-center"
                                                 >
                                                     Submitted
                                                 </button>
                                                )}
                                                <button 
                                                    onClick={() => onWithdrawApplication(app.id)}
                                                    className="px-6 py-2 text-slate-400 hover:text-accent-rust font-heading font-bold text-xs uppercase tracking-widest transition-colors"
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
                        <div className="max-w-7xl mx-auto animate-fade-in">
                             <div className="mb-12">
                                <h2 className="text-4xl font-bold text-brand-900 font-serif tracking-tight mb-3">Mentorship Network</h2>
                                <p className="text-slate-600 text-lg font-light">Connect with distinguished alumni and scholars.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {MOCK_MENTORS.map(mentor => (
                                    <div key={mentor.id} className="bg-white border border-slate-200 p-10 flex flex-col sm:flex-row gap-8 hover:border-brand-300 hover:shadow-lg transition-all group">
                                        <img src={mentor.image} alt={mentor.name} className="w-24 h-24 object-cover shadow-md grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        <div>
                                            <h3 className="font-bold text-2xl text-brand-900 font-serif mb-1">{mentor.name}</h3>
                                            <p className="text-accent-gold text-xs font-bold mb-4 uppercase tracking-widest font-heading">{mentor.role}</p>
                                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">{mentor.bio}</p>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {mentor.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] bg-beige-100 text-brand-800 px-3 py-1 uppercase tracking-widest font-bold border border-beige-200">{tag}</span>
                                                ))}
                                            </div>
                                            <button className="text-xs font-bold text-brand-700 hover:text-brand-900 uppercase tracking-widest font-heading border-b-2 border-brand-200 hover:border-brand-700 pb-1 transition-colors">Request Consultation</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentView === 'chat' && (
                        <div className="h-full border border-slate-200 shadow-2xl bg-white flex flex-col">
                            {renderChat()}
                        </div>
                    )}

                    {currentView === 'prep' && (
                        <div className="max-w-6xl mx-auto animate-fade-in">
                            <div className="mb-12">
                                <h2 className="text-4xl font-bold text-brand-900 font-serif tracking-tight mb-3">Preparation Suite</h2>
                                <p className="text-slate-600 text-lg font-light">Advanced tools for a competitive application.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="bg-white border border-slate-200 p-12 text-center hover:border-brand-700 transition-colors cursor-pointer group shadow-sm">
                                    <div className="w-20 h-20 bg-brand-50 text-brand-900 flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-900 group-hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-bold text-brand-900 mb-4 font-serif">Essay Review</h3>
                                    <p className="text-slate-600 mb-8 leading-relaxed text-lg">Receive deep learning analysis on your personal statement's narrative arc and rhetorical impact.</p>
                                    <span className="text-brand-700 font-bold font-heading uppercase tracking-widest text-sm border-b-2 border-transparent group-hover:border-brand-700 pb-1 transition-all">Begin Analysis</span>
                                </div>
                                <div className="bg-white border border-slate-200 p-12 text-center hover:border-accent-gold transition-colors cursor-pointer group shadow-sm">
                                    <div className="w-20 h-20 bg-beige-100 text-accent-gold flex items-center justify-center mx-auto mb-8 group-hover:bg-accent-gold group-hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-bold text-brand-900 mb-4 font-serif">Interview Simulation</h3>
                                    <p className="text-slate-600 mb-8 leading-relaxed text-lg">Practice with an AI admissions officer trained on specific university interview protocols.</p>
                                    <span className="text-accent-gold font-bold font-heading uppercase tracking-widest text-sm border-b-2 border-transparent group-hover:border-accent-gold pb-1 transition-all">Start Simulation</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'forum' && (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                            <div className="w-32 h-32 bg-beige-100 flex items-center justify-center mb-8 border border-beige-200">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-brand-300">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.063m.002 0a9.003 9.003 0 00-1.535-1.533l-3.876-3.88a1 1 0 00-1.415 1.415l.001.001m.001 0l3.29 3.29a.5.5 0 00.718 0z" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-brand-900 mb-4 font-serif">Coming Soon</h3>
                            <p className="text-slate-500 max-w-md text-lg">We are currently curating this section with our academic partners.</p>
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
