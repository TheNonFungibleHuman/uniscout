
import { useState, useEffect } from 'react';
import { AuthUser } from '../types';

// Mock database for the "Better Auth" simulation
const MOCK_USER: AuthUser = {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    name: 'Alex Rivera',
    email: 'alex.rivera@gradwyn.edu',
    emailVerified: true,
    image: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=162714&color=F6F1E9&font-size=0.33',
    createdAt: new Date(),
    updatedAt: new Date(),
    type: 'applicant'
};

export const authClient = {
  signIn: {
    social: async ({ provider }: { provider: 'google' | 'github' }) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        localStorage.setItem('gradwyn_session', JSON.stringify(MOCK_USER));
        return { data: MOCK_USER, error: null };
    },
    email: async ({ email, password }: any) => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        // Basic mock
        const user = { ...MOCK_USER, email, name: email.split('@')[0] };
        localStorage.setItem('gradwyn_session', JSON.stringify(user));
        return { data: user, error: null };
    }
  },
  signOut: async () => {
     await new Promise(resolve => setTimeout(resolve, 500));
     localStorage.removeItem('gradwyn_session');
     return { data: true, error: null };
  },
  useSession: () => {
    const [data, setData] = useState<AuthUser | null>(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                // Simulate verifying token
                await new Promise(resolve => setTimeout(resolve, 300));
                const session = localStorage.getItem('gradwyn_session');
                if (session) {
                    setData(JSON.parse(session));
                } else {
                    setData(null);
                }
            } catch (e) {
                setError(e);
            } finally {
                setIsPending(false);
            }
        };
        checkSession();
    }, []);

    return { data, isPending, error };
  }
};
