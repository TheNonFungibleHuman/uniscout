
import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import LoadingScreen from './components/LoadingScreen';
import { UserProfile, ChatMessage, University, AuthUser, Application } from './types';
import { generateWelcomeMessage, initializeChatSession } from './services/geminiService';
import { authClient } from './lib/auth';

type AppView = 'landing' | 'login' | 'onboarding' | 'chat' | 'dashboard';

const PROFILE_ANALYSIS_MESSAGES = [
    "Consulting global academic archives...",
    "Analyzing your psychometric profile...",
    "Cross-referencing Ivy League admissions data...",
    "Synthesizing campus culture compatibility...",
    "Calibrating financial aid optimizations...",
    "Formatting your executive summary..."
];

const DASHBOARD_BUILD_MESSAGES = [
    "Architecting your strategic roadmap...",
    "Curating distinguished alumni mentors...",
    "Synchronizing application deadlines...",
    "Initializing candidacy tracker...",
    "Preparing your executive briefing...",
    "Finalizing dashboard layout..."
];

const App: React.FC = () => {
  const { data: sessionUser, isPending: isSessionPending } = authClient.useSession();
  const [view, setView] = useState<AppView>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Lifted Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [isLoadingWelcome, setIsLoadingWelcome] = useState(false);
  const [isTransitioningToDashboard, setIsTransitioningToDashboard] = useState(false);
  
  // Dashboard State
  const [savedSchools, setSavedSchools] = useState<University[]>([]);
  const [discardedSchools, setDiscardedSchools] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Handle Auth State Changes
  useEffect(() => {
    if (!isSessionPending) {
        if (sessionUser) {
            if (!profile) {
                // If user is logged in but no profile (in this session), go to onboarding
                // In a real app, we'd fetch the profile from DB here
                setView('onboarding');
            }
        } else {
            setView('landing');
        }
    }
  }, [sessionUser, isSessionPending]);

  // Check if API key is present
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-beige-100 text-brand-900 p-8 text-center">
         <div className="border border-accent-rust p-8 bg-white">
             <h1 className="text-2xl font-serif font-bold text-accent-rust mb-2">Configuration Error</h1>
             <p className="font-sans">API_KEY is missing from the environment.</p>
         </div>
      </div>
    );
  }

  const handleLoginSuccess = (user: AuthUser) => {
    // Auth state is handled by useSession hook, but we can force view update if needed
    if (user.type === 'applicant') {
        setView('onboarding');
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    setProfile(null);
    setSavedSchools([]);
    setApplications([]);
    setMessages([]);
    setView('landing');
  };

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    const fullProfile: UserProfile = {
        ...userProfile,
        id: sessionUser?.id || 'guest',
        email: sessionUser?.email || '',
        photoUrl: sessionUser?.image,
        savedSchools: [],
        discardedSchools: []
    };

    setProfile(fullProfile);
    startAnalysisFlow(fullProfile);
  };

  // Trigger the AI analysis and switch to chat view
  const startAnalysisFlow = async (userProfile: UserProfile) => {
      setIsLoadingWelcome(true);
      setMessages([]); // Clear any previous chat

      initializeChatSession(userProfile);

      try {
          const response = await generateWelcomeMessage(userProfile);
          
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
              text: `Welcome ${userProfile.name}! I'm ready to start researching universities for you. What would you like to know first?`,
              timestamp: new Date()
          }]);
          setView('chat');
      } finally {
          setIsLoadingWelcome(false);
      }
  };

  // When profile updates, we do a "Soft Reset" of the flow
  const handleFullProfileRefresh = (newProfile: UserProfile) => {
      const mergedProfile = profile ? { ...profile, ...newProfile } : newProfile;
      setProfile(mergedProfile);
      
      // Force the user back to the analysis flow
      startAnalysisFlow(mergedProfile);
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
      }, 3000);
  };

  // Loading State for Session Check
  if (isSessionPending) {
      return <div className="h-screen bg-beige-100"></div>;
  }

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('login')} />;
  }

  if (view === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={() => setView('landing')} />;
  }

  if (isLoadingWelcome) {
    return <LoadingScreen messages={PROFILE_ANALYSIS_MESSAGES} />;
  }

  if (view === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} initialName={sessionUser?.name} />;
  }

  if (isTransitioningToDashboard) {
    return <LoadingScreen messages={DASHBOARD_BUILD_MESSAGES} />;
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
              onUpdateProfile={handleFullProfileRefresh}
              onLogout={handleLogout}
              renderChat={() => (
                  <ChatInterface 
                    profile={profile} 
                    messages={messages} 
                    setMessages={setMessages}
                    onUpdateProfile={handleFullProfileRefresh}
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
            onUpdateProfile={handleFullProfileRefresh}
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
