
import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import { UserProfile, ChatMessage, University, AuthUser, Application } from './types';
import { generateWelcomeMessage, initializeChatSession } from './services/geminiService';

type AppView = 'landing' | 'login' | 'onboarding' | 'chat' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Lifted Chat State so it persists between Main View and Dashboard
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [isLoadingWelcome, setIsLoadingWelcome] = useState(false);
  const [isTransitioningToDashboard, setIsTransitioningToDashboard] = useState(false);
  
  // State for Dashboard
  const [savedSchools, setSavedSchools] = useState<University[]>([]);
  const [discardedSchools, setDiscardedSchools] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Check if API key is present
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-100 text-slate-600 p-8 text-center">
         <div>
             <h1 className="text-2xl font-bold text-red-500 mb-2">Configuration Error</h1>
             <p>API_KEY is missing from the environment.</p>
         </div>
      </div>
    );
  }

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    if (user.type === 'applicant') {
        setView('onboarding');
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    setProfile(null);
    setSavedSchools([]);
    setApplications([]);
    setMessages([]);
    setView('landing');
  };

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    const fullProfile: UserProfile = {
        ...userProfile,
        email: authUser?.email,
        photoUrl: authUser?.photoUrl,
        savedSchools: [],
        discardedSchools: []
    };

    setProfile(fullProfile);
    setIsLoadingWelcome(true); // Start loading

    // Initialize chat logic
    initializeChatSession(fullProfile);

    try {
        const response = await generateWelcomeMessage(fullProfile);
        
        const welcomeMsg: ChatMessage = {
            id: 'welcome-msg',
            role: 'model',
            text: response.text,
            sources: response.sources,
            recommendations: response.recommendations,
            timestamp: new Date()
        };
        
        setMessages([welcomeMsg]);
        setView('chat');
    } catch (error) {
        console.error("Failed to generate welcome:", error);
        setMessages([{
            id: 'error-fallback',
            role: 'model',
            text: `Welcome ${fullProfile.name}! I'm ready to start researching universities for you. What would you like to know first?`,
            timestamp: new Date()
        }]);
        setView('chat');
    } finally {
        setIsLoadingWelcome(false); // Stop loading
    }
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
      setProfile(prev => prev ? { ...prev, ...newProfile } : newProfile);
  };

  const handleSaveSchool = (school: University) => {
      setSavedSchools(prev => {
          if (prev.some(s => s.id === school.id)) return prev;
          return [...prev, school];
      });
  };

  const handleDiscardSchool = (schoolId: string) => {
      setDiscardedSchools(prev => [...prev, schoolId]);
      setSavedSchools(prev => prev.filter(s => s.id !== schoolId));
  };
  
  const handleUpdateApplication = (app: Application) => {
      setApplications(prev => {
          const exists = prev.some(a => a.id === app.id);
          if (exists) {
              return prev.map(a => a.id === app.id ? app : a);
          }
          return [...prev, app];
      });
      // Also ensure the school is saved if we are applying to it
      handleSaveSchool(app.university);
  };

  const handleWithdrawApplication = (appId: string) => {
      setApplications(prev => prev.filter(a => a.id !== appId));
  };

  const handleGoToDashboard = () => {
      setIsTransitioningToDashboard(true);
      setTimeout(() => {
          setView('dashboard');
          setIsTransitioningToDashboard(false);
      }, 2000);
  };

  // --- RENDER LOGIC ---

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('login')} />;
  }

  if (view === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={() => setView('landing')} />;
  }

  // MOVED UP: Check loading BEFORE checking onboarding view to ensure spinner shows
  if (isLoadingWelcome) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-800 space-y-6 animate-fade-in">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Analyzing your profile...</h2>
            <p className="text-slate-500 animate-pulse">Scanning global university databases...</p>
        </div>
      </div>
    );
  }

  if (view === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} initialName={authUser?.name} />;
  }

  if (isTransitioningToDashboard) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-indigo-50 text-indigo-900 space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
             <span className="text-3xl">🎓</span>
        </div>
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Building your Personal Dashboard</h2>
            <p className="text-indigo-600">Curating mentors and matches...</p>
        </div>
      </div>
    );
  }

  if (view === 'dashboard' && profile) {
      return (
          <Dashboard 
              profile={profile} 
              savedSchools={savedSchools}
              applications={applications}
              onDiscardSchool={handleDiscardSchool}
              onSaveSchool={handleSaveSchool}
              onUpdateApplication={handleUpdateApplication}
              onWithdrawApplication={handleWithdrawApplication}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
              renderChat={() => (
                  <ChatInterface 
                    profile={profile} 
                    messages={messages} 
                    setMessages={setMessages}
                    onUpdateProfile={handleUpdateProfile}
                    onSaveSchool={handleSaveSchool}
                    onDiscardSchool={handleDiscardSchool}
                    savedSchools={savedSchools}
                    discardedSchools={discardedSchools}
                    onGoToDashboard={() => {}}
                    embeddedInDashboard={true}
                />
              )}
          />
      )
  }

  if (profile) {
    return (
        <ChatInterface 
            profile={profile} 
            messages={messages}
            setMessages={setMessages}
            onUpdateProfile={handleUpdateProfile}
            onSaveSchool={handleSaveSchool}
            onDiscardSchool={handleDiscardSchool}
            savedSchools={savedSchools}
            discardedSchools={discardedSchools}
            onGoToDashboard={handleGoToDashboard}
        />
    );
  }

  return null;
};

export default App;
