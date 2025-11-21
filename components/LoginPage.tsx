
import React, { useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { authClient } from '../lib/auth';

interface LoginPageProps {
  initialRole: 'applicant' | 'mentor' | 'university';
  onLoginSuccess: (user: AuthUser) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ initialRole, onLoginSuccess, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'applicant' | 'mentor' | 'university'>(initialRole);
  
  // Ensure state syncs if prop changes
  useEffect(() => {
      setSelectedRole(initialRole);
  }, [initialRole]);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Map 'university' role to 'applicant' logic effectively for now, 
  // or pass it through if we want to store it as such.
  // Since the Auth system in lib/auth handles these strings, we pass it directly.

  const handleSocialLogin = async (provider: 'google' | 'github') => {
      setIsLoading(true);
      setError(null);
      
      try {
          const { data, error } = await authClient.signIn.social({ provider, role: selectedRole });
          if (error) setError(error);
          else if (data) onLoginSuccess(data);
      } catch (e) {
          setError("An unexpected error occurred.");
      } finally {
          setIsLoading(false);
      }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
          if (isSignUp) {
              if (!name || !email || !password) {
                  setError("All fields are required.");
                  setIsLoading(false);
                  return;
              }
              const { data, error } = await authClient.signIn.signUpEmail({ email, password, name, role: selectedRole });
              if (error) setError(error);
              else if (data) onLoginSuccess(data);
          } else {
              if (!email || !password) {
                  setError("Please enter email and password.");
                  setIsLoading(false);
                  return;
              }
              const { data, error } = await authClient.signIn.signInEmail({ email, password });
              if (error) setError(error);
              else if (data) onLoginSuccess(data);
          }
      } catch (e) {
          setError("Authentication failed.");
      } finally {
          setIsLoading(false);
      }
  };

  const getRoleLabel = (role: string) => {
      switch(role) {
          case 'applicant': return 'Student';
          case 'mentor': return 'Mentor';
          case 'university': return 'University';
          default: return 'User';
      }
  };

  return (
    <div className="min-h-screen bg-beige-100 flex flex-col items-center justify-center p-4 font-sans text-brand-900">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-slate-400 hover:text-brand-700 font-bold font-heading uppercase tracking-widest text-xs flex items-center gap-2 transition-colors z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back to Selection
      </button>

      <div className="w-full max-w-md bg-white shadow-[8px_8px_0px_0px_rgba(22,39,20,0.1)] border border-slate-200 overflow-hidden relative">
        <div className="h-2 bg-brand-700 w-full absolute top-0"></div>
        
        <div className="p-8 pb-4 text-center">
           <div className="w-12 h-12 bg-brand-700 flex items-center justify-center text-white font-bold font-serif text-2xl shadow-none mx-auto mb-4 rounded-none">
             G
           </div>
           <p className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-1">
               {isSignUp ? 'Registering as' : 'Login as'} {getRoleLabel(selectedRole)}
           </p>
           <h2 className="text-2xl font-bold text-brand-900 font-serif mb-2">
             {isSignUp ? 'Create Account' : 'Welcome Back'}
           </h2>
           <p className="text-slate-500 text-sm font-medium">
             {isSignUp ? 'Join the elite academic network.' : 'Secure access to your intelligence dashboard'}
           </p>
        </div>

        <div className="px-8 pb-8 space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs font-bold uppercase tracking-wide mb-4 leading-relaxed">
                    {error}
                </div>
            )}

            {/* Role Toggle for visibility, though pre-selected from previous screen */}
            {isSignUp && (
                <div className="flex p-1 bg-slate-100 rounded-md mb-4">
                    <button 
                        type="button"
                        onClick={() => setSelectedRole('applicant')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${selectedRole === 'applicant' ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Student
                    </button>
                    <button 
                        type="button"
                        onClick={() => setSelectedRole('mentor')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${selectedRole === 'mentor' ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Mentor
                    </button>
                    <button 
                        type="button"
                        onClick={() => setSelectedRole('university')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${selectedRole === 'university' ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Uni
                    </button>
                </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-3">
                {isSignUp && (
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-4 bg-white border border-slate-300 outline-none font-medium placeholder:text-slate-400 focus:border-brand-700 transition-colors text-sm text-slate-900" 
                    />
                )}
                <input 
                    type="email" 
                    placeholder="Email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-white border border-slate-300 outline-none font-medium placeholder:text-slate-400 focus:border-brand-700 transition-colors text-sm text-slate-900" 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-white border border-slate-300 outline-none font-medium placeholder:text-slate-400 focus:border-brand-700 transition-colors text-sm text-slate-900" 
                />
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-brand-700 text-white font-bold font-heading uppercase tracking-widest py-4 hover:bg-brand-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </button>
            </form>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Or</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button 
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-slate-200 hover:border-brand-700 bg-white hover:bg-beige-50 transition-all text-brand-900 font-bold relative group text-sm"
            >
                <svg className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
            </button>

            <div className="text-center pt-2">
                <button 
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError(null);
                    }}
                    className="text-xs font-bold text-brand-700 hover:text-brand-900 uppercase tracking-wider underline decoration-brand-200 underline-offset-4"
                >
                    {isSignUp ? 'Already have an account? Log In' : 'New here? Create an Account'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
