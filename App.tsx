
import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import MentorOnboarding from './components/MentorOnboarding';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import MentorDashboard from './components/MentorDashboard';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import LoadingScreen from './components/LoadingScreen';
import { UserProfile, ChatMessage, University, AuthUser, Application, MentorProfile } from './types';
import { generateWelcomeMessage, initializeChatSession } from './services/geminiService';
import { authClient } from './lib/auth';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type AppView = 'landing' | 'login' | 'onboarding' | 'mentor-onboarding' | 'chat' | 'dashboard' | 'mentor-dashboard';

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
  const [selectedRole, setSelectedRole] = useState<'applicant' | 'mentor' | 'university'>('applicant');
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [userRole, setUserRole] = useState<'applicant' | 'mentor' | 'university' | null>(null);
  
  // Lifted Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [isLoadingWelcome, setIsLoadingWelcome] = useState(false);
  const [isTransitioningToDashboard, setIsTransitioningToDashboard] = useState(false);
  
  // Dashboard State
  const [savedSchools, setSavedSchools] = useState<University[]>([]);
  const [discardedSchools, setDiscardedSchools] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

  // Handle Persistence & Auth State
  useEffect(() => {
    if (!isSessionPending) {
        if (sessionUser) {
            const fetchUserData = async () => {
                setIsFetchingProfile(true);
                try {
                    const userDocRef = doc(db, 'users', sessionUser.id);
                    const docSnap = await getDoc(userDocRef);
                    
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const role = data.role || sessionUser.type;
                        setUserRole(role);
                        
                        if (role === 'mentor') {
                            if (data.bio && data.university) {
                                setMentorProfile(data as MentorProfile);
                                setView('mentor-dashboard');
                            } else {
                                setView('mentor-onboarding');
                            }
                        } else {
                            let loadedMessages: ChatMessage[] = [];
                            if (data.messages) {
                                loadedMessages = data.messages.map((m: any) => ({
                                    ...m,
                                    timestamp: new Date(m.timestamp)
                                }));
                                setMessages(loadedMessages);
                            }

                            if (data.profile) {
                                setProfile(data.profile as UserProfile);
                                initializeChatSession(data.profile as UserProfile, loadedMessages);
                            }
                            if (data.savedSchools) setSavedSchools(data.savedSchools);
                            if (data.discardedSchools) setDiscardedSchools(data.discardedSchools);
                            if (data.applications) {
                                setApplications(data.applications.map((app: any) => ({
                                    ...app,
                                    lastUpdated: new Date(app.lastUpdated),
                                    submittedDate: app.submittedDate ? new Date(app.submittedDate) : undefined
                                })));
                            }
                            if (data.profile) {
                                setView('dashboard');
                            } else {
                                setView('onboarding');
                            }
                        }
                    } else {
                        setUserRole(sessionUser.type);
                        if (sessionUser.type === 'mentor') {
                            setView('mentor-onboarding');
                        } else {
                            setView('onboarding');
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUserRole(sessionUser.type);
                    if (sessionUser.type === 'mentor') setView('mentor-onboarding');
                    else setView('onboarding');
                } finally {
                    setIsFetchingProfile(false);
                }
            };
            fetchUserData();
        } else {
            setView('landing');
        }
    }
  }, [sessionUser, isSessionPending]);

  // Persist data on changes
  useEffect(() => {
      if (profile && sessionUser && userRole !== 'mentor') {
          const userDocRef = doc(db, 'users', sessionUser.id);
          
          const dataToSave = { 
              profile, 
              savedSchools, 
              discardedSchools, 
              applications: applications.map(app => ({
                  ...app,
                  lastUpdated: app.lastUpdated.toISOString(),
                  submittedDate: app.submittedDate ? app.submittedDate.toISOString() : null
              })),
              messages: messages.map(m => ({
                  ...m,
                  timestamp: m.timestamp.toISOString()
              })),
              role: userRole || 'applicant',
              id: sessionUser.id,
              email: sessionUser.email
          };

          // Deep remove undefined values
          const cleanData = JSON.parse(JSON.stringify(dataToSave));

          setDoc(userDocRef, cleanData, { merge: true }).catch(console.error);
      }
  }, [profile, savedSchools, discardedSchools, applications, messages, sessionUser, userRole]);
  
  useEffect(() => {
      if (mentorProfile && sessionUser && userRole === 'mentor') {
          const userDocRef = doc(db, 'users', sessionUser.id);
          const dataToSave = { 
              ...mentorProfile,
              role: 'mentor',
              id: sessionUser.id,
              email: sessionUser.email
          };
          const cleanData = JSON.parse(JSON.stringify(dataToSave));
          setDoc(userDocRef, cleanData, { merge: true }).catch(console.error);
      }
  }, [mentorProfile, sessionUser, userRole]);

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

  const handleRoleSelect = (role: 'applicant' | 'mentor' | 'university') => {
      setSelectedRole(role);
      setView('login');
  };

  const handleLoginSuccess = (user: AuthUser) => {
    // The useEffect listening to sessionUser will handle fetching data and routing.
    // We don't need to manually set the view here anymore.
  };

  const handleLogout = async () => {
    await authClient.signOut();
    // Clear State
    setProfile(null);
    setMentorProfile(null);
    setSavedSchools([]);
    setApplications([]);
    setMessages([]);
    setDiscardedSchools([]);
    // Clear Local Storage (Optional: Keep specific user data, but clear session keys)
    localStorage.removeItem('gradwyn_profile');
    localStorage.removeItem('gradwyn_savedSchools');
    localStorage.removeItem('gradwyn_applications');
    localStorage.removeItem('gradwyn_user_role'); // Clear preferred role
    
    setView('landing');
  };

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    const fullProfile: UserProfile = {
        ...userProfile,
        id: sessionUser?.id || 'guest',
        email: sessionUser?.email || '',
        savedSchools: [],
        discardedSchools: []
    };
    
    if (sessionUser?.image) {
        fullProfile.photoUrl = sessionUser.image;
    }

    setProfile(fullProfile);
    startAnalysisFlow(fullProfile);
  };
  
  const handleMentorOnboardingComplete = (mProfile: MentorProfile) => {
      const fullProfile: MentorProfile = {
          ...mProfile,
          id: sessionUser?.id || Date.now().toString(),
      };
      setMentorProfile(fullProfile);
      setView('mentor-dashboard');
  };

  // Trigger the AI analysis and switch to chat view
  const startAnalysisFlow = async (userProfile: UserProfile) => {
      setIsLoadingWelcome(true);
      setMessages([]); // Clear any previous chat
      setView('chat'); // Force view to chat immediately behind loading screen

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
      } catch (error) {
          console.error("Failed to generate welcome:", error);
          setMessages([{
              id: 'error-fallback',
              role: 'model',
              text: `Welcome ${userProfile.name}! I'm ready to start researching universities for you. What would you like to know first?`,
              timestamp: new Date()
          }]);
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
      if (!school) return;
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
      
      // Only save school if it exists (scholarship applications do not have a university property)
      if (app.university) {
          handleSaveSchool(app.university);
      }
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
  if (isSessionPending || isFetchingProfile) {
      return <div className="h-screen bg-beige-100 flex items-center justify-center">
          <div className="animate-pulse text-brand-700 font-serif text-2xl">Loading...</div>
      </div>;
  }

  if (view === 'landing') {
    return <LandingPage onGetStarted={handleRoleSelect} />;
  }

  if (view === 'login') {
    return <LoginPage 
        initialRole={selectedRole}
        onLoginSuccess={handleLoginSuccess} 
        onBack={() => setView('landing')} 
    />;
  }

  if (isLoadingWelcome) {
    return <LoadingScreen messages={PROFILE_ANALYSIS_MESSAGES} />;
  }
  
  if (view === 'mentor-onboarding') {
      return <MentorOnboarding 
        onComplete={handleMentorOnboardingComplete} 
        initialName={sessionUser?.name} 
        initialEmail={sessionUser?.email} 
        initialPhoto={sessionUser?.image} 
        onBack={() => setView('login')}
      />;
  }
  
  if (view === 'mentor-dashboard' && mentorProfile) {
      return <MentorDashboard profile={mentorProfile} onUpdateProfile={setMentorProfile} onLogout={handleLogout} />;
  }

  if (view === 'onboarding') {
    return <Onboarding 
      onComplete={handleOnboardingComplete} 
      initialName={sessionUser?.name} 
      onExit={() => setView('login')} 
    />;
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
