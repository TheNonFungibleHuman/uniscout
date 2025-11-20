
import React, { useState } from 'react';
import { AuthUser } from '../types';
import { authClient } from '../lib/auth';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (provider: 'google' | 'github') => {
      setIsLoading(true);
      setError(null);
      
      try {
          const { data, error } = await authClient.signIn.social({ provider });
          
          if (error) {
              setError(error);
          } else if (data) {
              onLoginSuccess(data);
          }
      } catch (e) {
          setError("An unexpected error occurred. Please try again.");
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-beige-100 flex flex-col items-center justify-center p-4 font-sans text-brand-900">
      
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-slate-400 hover:text-brand-700 font-bold font-heading uppercase tracking-widest text-xs flex items-center gap-2 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back
      </button>

      <div className="w-full max-w-md bg-white shadow-[8px_8px_0px_0px_rgba(22,39,20,0.1)] border border-slate-200 overflow-hidden relative">
        <div className="h-2 bg-brand-700 w-full absolute top-0"></div>
        
        <div className="p-10 pb-8 text-center">
           <div className="w-14 h-14 bg-brand-700 flex items-center justify-center text-white font-bold font-serif text-3xl shadow-none mx-auto mb-6 rounded-none">
             G
           </div>
           <h2 className="text-3xl font-bold text-brand-900 font-serif mb-2">Welcome Scholar</h2>
           <p className="text-slate-500 text-sm font-medium">Secure access to your intelligence dashboard</p>
        </div>

        <div className="px-10 pb-10 space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs font-bold uppercase tracking-wide mb-4 leading-relaxed">
                    {error}
                </div>
            )}

            <button 
                onClick={() => handleLogin('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-4 px-4 border-2 border-slate-200 hover:border-brand-700 bg-white hover:bg-beige-50 transition-all text-brand-900 font-bold relative group"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-brand-700 rounded-full animate-spin"></div>
                ) : (
                    <>
                    <svg className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 24 24">
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
                    <span>Continue with Google</span>
                    </>
                )}
            </button>
            
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Or</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form className="space-y-3 opacity-60 pointer-events-none" aria-disabled="true">
                <input type="email" placeholder="Email address" className="w-full p-4 bg-white border border-slate-300 outline-none font-medium placeholder:text-slate-400 focus:border-brand-700 transition-colors" />
                <button className="w-full bg-brand-700 text-white font-bold font-heading uppercase tracking-widest py-4 hover:bg-brand-800 transition-colors">Sign In via Email</button>
            </form>
            <p className="text-xs text-center text-slate-400 font-medium">Institutional email login is currently restricted.</p>
        </div>
        
        <div className="bg-beige-50 p-5 text-center border-t border-slate-200">
            <p className="text-sm text-slate-600 font-medium">By continuing, you agree to our <a href="#" className="underline decoration-slate-300 hover:text-brand-700">Terms</a> & <a href="#" className="underline decoration-slate-300 hover:text-brand-700">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
