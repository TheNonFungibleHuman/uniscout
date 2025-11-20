
import React, { useState } from 'react';
import { AuthUser } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onBack: () => void;
}

type UserType = 'applicant' | 'mentor' | 'university';

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [userType, setUserType] = useState<UserType>('applicant');
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleGoogleClick = () => {
      setIsLoading(true);
      // Simulate network request to open popup
      setTimeout(() => {
          setIsLoading(false);
          setShowGoogleModal(true);
      }, 600);
  };

  const handleAccountSelect = () => {
    setShowGoogleModal(false);
    // Simulate final auth verification
    const mockUser: AuthUser = {
        id: 'google-uid-123',
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        photoUrl: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=2563eb&color=fff',
        type: userType
    };
    onLoginSuccess(mockUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      {/* Mock Google Account Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-[400px] rounded-lg shadow-2xl overflow-hidden transform transition-all scale-100">
                <div className="p-6 pb-4 border-b border-slate-100 text-center">
                    <div className="flex justify-center mb-4">
                        <svg className="w-10 h-10" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-slate-800">Sign in with Google</h3>
                    <p className="text-slate-500 text-sm mt-1">Choose an account to continue to UniScout</p>
                </div>
                
                <div className="py-2">
                    <button 
                        onClick={handleAccountSelect}
                        className="w-full px-6 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left group"
                    >
                        <img src="https://ui-avatars.com/api/?name=Alex+Rivera&background=2563eb&color=fff" alt="Alex" className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Alex Rivera</p>
                            <p className="text-xs text-slate-500">alex.rivera@example.com</p>
                        </div>
                    </button>
                    <button className="w-full px-6 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left border-t border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">Use another account</p>
                        </div>
                    </button>
                </div>

                <div className="p-4 border-t border-slate-100 text-center">
                    <button onClick={() => setShowGoogleModal(false)} className="text-sm text-brand-600 hover:text-brand-700 font-medium">Cancel</button>
                </div>
            </div>
        </div>
      )}

      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-slate-500 hover:text-slate-800 font-medium flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 text-center">
           <div className="w-12 h-12 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-brand-200 mx-auto mb-4">
             US
           </div>
           <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
           <p className="text-slate-500">Sign in to access your dashboard</p>
        </div>

        {/* User Type Tabs */}
        <div className="flex border-b border-slate-100">
            <button 
                onClick={() => setUserType('applicant')}
                className={`flex-1 py-4 text-sm font-bold transition-colors relative ${userType === 'applicant' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Applicant
                {userType === 'applicant' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600"></div>}
            </button>
            <button 
                onClick={() => setUserType('mentor')}
                className={`flex-1 py-4 text-sm font-bold transition-colors relative ${userType === 'mentor' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Mentor
                {userType === 'mentor' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600"></div>}
            </button>
            <button 
                onClick={() => setUserType('university')}
                className={`flex-1 py-4 text-sm font-bold transition-colors relative ${userType === 'university' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
                University
                {userType === 'university' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600"></div>}
            </button>
        </div>

        <div className="p-8">
            {userType === 'applicant' ? (
                <div className="space-y-4">
                    <button 
                        onClick={handleGoogleClick}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-bold relative"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                        ) : (
                            <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign in with Google
                            </>
                        )}
                    </button>
                    
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">Or</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    <form className="space-y-3 opacity-50 pointer-events-none" aria-disabled="true">
                        <input type="email" placeholder="Email address" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none" />
                        <input type="password" placeholder="Password" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none" />
                        <button className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl">Sign In</button>
                    </form>
                    <p className="text-xs text-center text-slate-400">Note: Email login is disabled for this demo. Please use Google Sign In.</p>
                </div>
            ) : (
                <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Portal Access Restricted</h3>
                    <p className="text-slate-500 text-sm">The {userType === 'mentor' ? 'Mentor' : 'University'} portal is currently invite-only. Please contact support for access.</p>
                </div>
            )}
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-sm text-slate-500">Don't have an account? <button className="text-brand-600 font-bold hover:underline">Sign up</button></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
