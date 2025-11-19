
import React, { useState } from 'react';
import { UserProfile, University, Mentor } from '../types';
import { MOCK_MENTORS, MOCK_DATABASE_UNIVERSITIES } from '../constants';
import UniversityCard from './UniversityCard';
import EditProfileModal from './EditProfileModal';

interface DashboardProps {
  profile: UserProfile;
  savedSchools: University[];
  onDiscardSchool: (id: string) => void;
  renderChat: () => React.ReactNode;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

type DashboardView = 'schools' | 'mentors' | 'chat' | 'prep' | 'forum' | 'guides';

const Dashboard: React.FC<DashboardProps> = ({ profile, savedSchools, onDiscardSchool, renderChat, onUpdateProfile }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('schools');
  const [selectedSchool, setSelectedSchool] = useState<University | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // If user has no saved schools, show some recommendations from "database"
  const displaySchools = savedSchools.length > 0 ? savedSchools : MOCK_DATABASE_UNIVERSITIES;
  const isFallback = savedSchools.length === 0;

  const SidebarItem: React.FC<{ view: DashboardView; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
    <button 
        onClick={() => { setCurrentView(view); setSelectedSchool(null); }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1
            ${currentView === view 
                ? 'bg-brand-50 text-brand-600 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
    >
        {icon}
        <span>{label}</span>
    </button>
  );

  const SchoolProfileView = ({ uni }: { uni: University }) => (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
          <div className="h-40 bg-gradient-to-r from-brand-600 to-indigo-700 p-6 relative">
             <button 
                onClick={() => setSelectedSchool(null)}
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
                <div className="flex gap-4 mt-8">
                    <a href={uni.website} target="_blank" rel="noreferrer" className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">
                        Visit Official Website
                    </a>
                    <button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                        Application Requirements
                    </button>
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
                    <button onClick={() => setCurrentView('mentors')} className="w-full py-2 bg-indigo-200 text-indigo-800 rounded-lg text-sm font-bold hover:bg-indigo-300">View Mentors</button>
                </div>
             </div>
          </div>
      </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
        onSave={onUpdateProfile}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full hidden md:flex">
         <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm">US</div>
                <span className="font-bold text-lg tracking-tight">UniScout Hub</span>
            </div>
            <nav className="space-y-2">
                <SidebarItem 
                    view="schools" 
                    label="My Schools" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 001.402 10.06a.75.75 0 01-.23-1.337A60.653 60.653 0 0111.7 2.805z" /><path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 0110.94 15.473a.75.75 0 002.12 0z" /><path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" /></svg>}
                />
                <SidebarItem 
                    view="mentors" 
                    label="Find Mentors" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.602-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>}
                />
                <SidebarItem 
                    view="chat" 
                    label="AI Assistant" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" /></svg>}
                />
                <SidebarItem 
                    view="prep" 
                    label="App Prep" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>}
                />
                <SidebarItem 
                    view="forum" 
                    label="Community" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" /><path d="M5.082 14.254a6.741 6.741 0 00-2.817.557.75.75 0 01-.568-.372A6.786 6.786 0 014.36 6.05m15.28 8.204a6.741 6.741 0 002.817.557.75.75 0 00.568-.372 6.786 6.786 0 00-2.697-8.394" /></svg>}
                />
            </nav>
         </div>
         <div className="mt-auto p-6 border-t border-slate-100">
             <button 
               onClick={() => setIsEditModalOpen(true)}
               className="w-full flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors text-left"
             >
                 <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${profile.name}&background=random`} alt="User" />
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
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
              <span className="font-bold text-lg">UniScout Hub</span>
              <div className="flex gap-2">
                 <button onClick={() => setCurrentView('schools')} className={`p-2 rounded ${currentView === 'schools' ? 'bg-brand-100 text-brand-600' : 'text-slate-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
                 </button>
                 <button onClick={() => setCurrentView('chat')} className={`p-2 rounded ${currentView === 'chat' ? 'bg-brand-100 text-brand-600' : 'text-slate-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 001.28.53l3.58-3.579a.78.78 0 01.527-.224 41.202 41.202 0 003.444-.33c1.436-.23 2.429-1.487 2.429-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM2.5 5.426c0-.728.496-1.377 1.183-1.488C6.117 3.45 8.043 3.326 10 3.326c1.957 0 3.883.124 6.317.612.687.111 1.183.76 1.183 1.488v5.148c0 .728-.496 1.377-1.183 1.488-2.434.488-4.36.612-6.317.612a.75.75 0 01-.52-.209l-3.03 3.03v-2.43a.75.75 0 00-.719-.746 39.702 39.702 0 01-2.03-.227c-.687-.111-1.183-.76-1.183-1.488V5.426z" clipRule="evenodd" /></svg>
                 </button>
                 <button onClick={() => setIsEditModalOpen(true)} className={`p-2 rounded text-slate-500`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
                 </button>
              </div>
          </div>

          {/* View Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
              {selectedSchool ? (
                  <SchoolProfileView uni={selectedSchool} />
              ) : (
                  <>
                    {currentView === 'schools' && (
                        <div className="max-w-6xl mx-auto animate-fade-in">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-800">Your Universities</h2>
                                <p className="text-slate-500">
                                    {isFallback 
                                        ? "We've curated these matches based on your profile." 
                                        : "Manage your shortlisted universities and applications."}
                                </p>
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
