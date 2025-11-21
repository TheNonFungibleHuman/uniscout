import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, University } from '../types';
import MessageBubble from './MessageBubble';
import EditProfileModal from './EditProfileModal';
import UniversityCard from './UniversityCard';
import { sendMessageToGemini, updateChatProfile } from '../services/geminiService';
import LoadingDots from './LoadingDots';

interface ChatInterfaceProps {
  profile: UserProfile;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onUpdateProfile: (newProfile: UserProfile) => void;
  onSaveSchool: (school: University) => void;
  onDiscardSchool: (schoolId: string) => void;
  savedSchools: University[];
  discardedSchools: string[];
  onGoToDashboard: () => void;
  embeddedInDashboard?: boolean;
}

const LOADING_PHRASES = [
  "Consulting academic archives...",
  "Analyzing global rankings...",
  "Cross-referencing student forums...",
  "Evaluating endowment opportunities...",
  "Synthesizing campus sentiments...",
  "Checking research outputs...",
  "Verifying accreditation status...",
  "Curating your shortlist..."
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
    profile, 
    messages,
    setMessages, 
    onUpdateProfile,
    onSaveSchool,
    onDiscardSchool,
    savedSchools,
    discardedSchools,
    onGoToDashboard,
    embeddedInDashboard = false
}) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadingIntervalRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Rotate loading text
  useEffect(() => {
    if (isProcessing) {
      let index = 0;
      loadingIntervalRef.current = setInterval(() => {
        index = (index + 1) % LOADING_PHRASES.length;
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.isThinking) {
             const newMessages = [...prev];
             newMessages[newMessages.length - 1] = { ...lastMsg, text: LOADING_PHRASES[index] };
             return newMessages;
          }
          return prev;
        });
      }, 2500);
    } else {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    }
    return () => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    };
  }, [isProcessing, setMessages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const userText = inputText.trim();
    setInputText('');
    setIsProcessing(true);

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: userText,
        timestamp: new Date()
    };

    // Add user message and thinking placeholder
    setMessages(prev => [
        ...prev, 
        userMsg,
        {
            id: 'thinking',
            role: 'model',
            text: LOADING_PHRASES[0],
            timestamp: new Date(),
            isThinking: true
        }
    ]);

    try {
        const response = await sendMessageToGemini(userText);
        
        setMessages(prev => {
            // Remove thinking message
            const filtered = prev.filter(m => m.id !== 'thinking');
            return [
                ...filtered,
                {
                    id: Date.now().toString(),
                    role: 'model',
                    text: response.text,
                    sources: response.sources,
                    recommendations: response.recommendations,
                    timestamp: new Date()
                }
            ];
        });
    } catch (error) {
        console.error("Chat error", error);
        setMessages(prev => {
            const filtered = prev.filter(m => m.id !== 'thinking');
            return [
                ...filtered,
                {
                    id: Date.now().toString(),
                    role: 'model',
                    text: "I encountered a temporary issue connecting to the research database. Please try again.",
                    timestamp: new Date()
                }
            ];
        });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleProfileUpdate = async (newProfile: UserProfile) => {
      onUpdateProfile(newProfile);
      setIsEditModalOpen(false);
      
      // Notify user and trigger AI update
      setMessages(prev => [...prev, {
          id: 'sys-update-' + Date.now(),
          role: 'user',
          text: "I've updated my preferences. Can you recommend universities based on my new profile?",
          timestamp: new Date()
      }, {
          id: 'thinking',
          role: 'model',
          text: "Recalibrating recommendations...",
          timestamp: new Date(),
          isThinking: true
      }]);
      
      setIsProcessing(true);
      
      try {
          const response = await updateChatProfile(newProfile);
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== 'thinking');
            return [
                ...filtered,
                {
                    id: Date.now().toString(),
                    role: 'model',
                    text: response.text,
                    sources: response.sources,
                    recommendations: response.recommendations,
                    timestamp: new Date()
                }
            ];
        });
      } catch (error) {
          console.error(error);
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${!embeddedInDashboard ? 'fixed inset-0' : 'relative'}`}>
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
        onSave={handleProfileUpdate}
      />

      {/* Header (only if not embedded) */}
      {!embeddedInDashboard && (
          <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-900 flex items-center justify-center text-white font-serif font-bold">G</div>
                <span className="font-serif font-bold text-xl text-brand-900">Gradwyn Intelligence</span>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-brand-700 px-3 py-1 border border-slate-200 hover:border-brand-300 transition-colors"
                >
                    Preferences
                </button>
                <button 
                    onClick={onGoToDashboard}
                    className="bg-brand-700 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-brand-800 transition-colors shadow-lg"
                >
                    Dashboard
                </button>
            </div>
          </header>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-beige-50 scroll-smooth">
        <div className="max-w-3xl mx-auto">
            {messages.map((msg, idx) => (
                <div key={msg.id || idx}>
                    <MessageBubble message={msg} />
                    
                    {/* Render Cards if present */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mb-8 ml-0 md:ml-12 animate-fade-in">
                            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
                                {msg.recommendations.map((uni) => (
                                    <UniversityCard 
                                        key={uni.id} 
                                        university={uni} 
                                        onSave={onSaveSchool}
                                        onDiscard={onDiscardSchool}
                                        isSaved={savedSchools.some(s => s.id === uni.id)}
                                        isDiscarded={discardedSchools.includes(uni.id)}
                                        className="snap-center shrink-0"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-slate-200 z-10">
        <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSendMessage} className="relative flex items-end gap-2 bg-white p-2 rounded-2xl border border-slate-300 shadow-sm focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-50 transition-all">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    placeholder="Ask about universities, scholarships, or campus life..."
                    className="w-full max-h-32 p-3 bg-transparent border-none outline-none resize-none text-slate-800 placeholder:text-slate-400"
                    rows={1}
                    style={{ minHeight: '48px' }}
                />
                <button 
                    type="submit"
                    disabled={!inputText.trim() || isProcessing}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                        !inputText.trim() || isProcessing 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-brand-700 text-white hover:bg-brand-800 shadow-md'
                    }`}
                >
                    {isProcessing ? (
                        <LoadingDots />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                        </svg>
                    )}
                </button>
            </form>
            <div className="text-center mt-2">
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">AI can make mistakes. Verify important info.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;