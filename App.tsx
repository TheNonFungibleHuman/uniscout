
import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import { UserProfile, ChatMessage, University } from './types';
import { generateWelcomeMessage, initializeChatSession } from './services/geminiService';

type AppView = 'onboarding' | 'chat' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('onboarding');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const [isLoadingWelcome, setIsLoadingWelcome] = useState(false);
  const [isTransitioningToDashboard, setIsTransitioningToDashboard] = useState(false);
  
  // State for Dashboard
  const [savedSchools, setSavedSchools] = useState<University[]>([]);
  const [discardedSchools, setDiscardedSchools] = useState<string[]>([]);

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

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    setProfile({ ...userProfile, savedSchools: [], discardedSchools: [] });
    setIsLoadingWelcome(true);

    // Initialize chat logic but defer the visual transition
    initializeChatSession(userProfile);

    try {
        const response = await generateWelcomeMessage(userProfile);
        
        const welcomeMsg: ChatMessage = {
            id: 'welcome-msg',
            role: 'model',
            text: response.text,
            sources: response.sources,
            recommendations: response.recommendations, // Ensure initial recs are captured
            timestamp: new Date()
        };
        
        setInitialMessages([welcomeMsg]);
        setView('chat');
    } catch (error) {
        console.error("Failed to generate welcome:", error);
        setInitialMessages([{
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
      // Also remove from saved if it was there
      setSavedSchools(prev => prev.filter(s => s.id !== schoolId));
  };

  const handleGoToDashboard = () => {
      setIsTransitioningToDashboard(true);
      setTimeout(() => {
          setView('dashboard');
          setIsTransitioningToDashboard(false);
      }, 2000);
  };

  if (!profile && view === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (isLoadingWelcome) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-800 space-y-6">
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

  if (isTransitioningToDashboard) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-indigo-50 text-indigo-900 space-y-6">
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
              onDiscardSchool={handleDiscardSchool}
              onUpdateProfile={handleUpdateProfile}
              renderChat={() => (
                  <ChatInterface 
                    profile={profile} 
                    initialMessages={initialMessages} 
                    onUpdateProfile={handleUpdateProfile}
                    onSaveSchool={handleSaveSchool}
                    onDiscardSchool={handleDiscardSchool}
                    savedSchools={savedSchools}
                    discardedSchools={discardedSchools}
                    onGoToDashboard={() => {}} // No-op in dashboard
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
            initialMessages={initialMessages} 
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
