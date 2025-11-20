
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, University } from '../types';
import MessageBubble from './MessageBubble';
import EditProfileModal from './EditProfileModal';
import UniversityCard from './UniversityCard';
import { sendMessageToGemini, updateChatProfile } from '../services/geminiService';

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
  const [isListening, setIsListening] = useState(false);
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
            return [
              ...prev.slice(0, -1),
              { ...lastMsg, text: LOADING_PHRASES[index] }
            ];
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
    e?.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    // Add placeholder AI message for loading state
    const loadingMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingMsgId,
      role: 'model',
      text: LOADING_PHRASES[0],
      timestamp: new Date(),
      isThinking: true
    }]);

    try {
      const response = await sendMessageToGemini(userMsg.text);
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMsgId 
          ? { 
              ...msg, 
              text: response.text, 
              sources: response.sources, 
              recommendations: response.recommendations,
              isThinking: false 
            } 
          : msg
      ));
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMsgId 
          ? { ...msg, text: "My sincere apologies. I encountered a disruption in the archives. Please inquire again.", isThinking: false } 
          : msg
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) return;

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice input is unavailable on this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.start();
  };

  const handleSaveProfile = async (newProfile: UserProfile) => {
    onUpdateProfile(newProfile);
    setIsProcessing(true);
    
    const loadingMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingMsgId,
      role: 'model',
      text: "Recalibrating research parameters...",
      timestamp: new Date(),
      isThinking: true
    }]);

    try {
        const response = await updateChatProfile(newProfile);
        const text = response?.text || "Profile updated. How may I assist you with these new criteria?";

        setMessages(prev => prev.map(msg => 
            msg.id === loadingMsgId 
              ? { ...msg, text: text, isThinking: false } 
              : msg
          ));
    } catch (error) {
        setMessages(prev => prev.map(msg => 
            msg.id === loadingMsgId 
              ? { ...msg, text: "Preferences saved locally. Please proceed.", isThinking: false } 
              : msg
          ));
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-beige-50 relative font-sans">
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
        onSave={handleSaveProfile}
      />

      {/* Header - Hide if embedded in dashboard to avoid double headers */}
      {!embeddedInDashboard && (
        <header className="bg-white/80 backdrop-blur-md border-b border-brown-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-brand-700 flex items-center justify-center text-beige-100 font-serif font-bold text-xl">
                G
            </div>
            <div>
                <h1 className="font-serif text-xl font-bold text-brand-900 leading-tight">Gradwyn</h1>
                <p className="text-xs text-brown-500 font-heading uppercase tracking-wider">Researching for {profile.name}</p>
            </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onGoToDashboard}
                    className="hidden md:block text-sm text-brown-500 hover:text-brand-700 font-heading uppercase tracking-wide font-semibold transition-colors"
                >
                    Skip to Dashboard
                </button>
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-2 rounded-sm transition-colors font-heading"
                >
                    Edit Prefs
                </button>
            </div>
        </header>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar bg-beige-100">
        <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col mb-8 animate-fade-in">
                    <MessageBubble message={msg} />
                    
                    {/* University Cards Recommendations */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="ml-0 md:ml-12 mt-4 flex overflow-x-auto gap-5 pb-4 no-scrollbar snap-x">
                            {msg.recommendations.map(uni => {
                                const isDiscarded = discardedSchools.includes(uni.id);
                                const isSaved = savedSchools.some(s => s.id === uni.id);
                                
                                if (isDiscarded) return null;

                                return (
                                    <div key={uni.id} className="snap-center">
                                        <UniversityCard 
                                            university={uni} 
                                            onSave={onSaveSchool}
                                            onDiscard={onDiscardSchool}
                                            isSaved={isSaved}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Go To Dashboard Button - Only show if not embedded and has saved schools */}
      {!embeddedInDashboard && savedSchools.length >= 2 && (
         <div className="absolute bottom-28 left-0 right-0 flex justify-center pointer-events-none z-20">
             <button 
                onClick={onGoToDashboard}
                className="pointer-events-auto bg-brand-700 text-beige-50 font-heading uppercase tracking-widest font-bold py-3 px-8 rounded-sm shadow-xl hover:bg-brand-800 hover:scale-105 transition-all animate-bounce-in flex items-center gap-2"
             >
                <span>Open Dashboard</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm font-sans normal-case">{savedSchools.length}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
             </button>
         </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-brown-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSendMessage}
            className="relative flex items-center shadow-lg shadow-brown-900/5 rounded-sm bg-beige-50 border border-brown-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Inquire about endowments, faculty prestige, or campus traditions..."
              className="w-full py-4 pl-6 pr-24 rounded-sm outline-none text-brand-900 placeholder:text-brown-400 bg-transparent font-medium"
              disabled={isProcessing}
            />
            
            <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={isProcessing}
                  className={`p-2 rounded-sm transition-all ${isListening ? 'text-red-600 bg-red-50 animate-pulse' : 'text-brown-400 hover:text-brand-700 hover:bg-brand-50'}`}
                  title="Voice Input"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                  </svg>
                </button>

                <button
                  type="submit"
                  disabled={!inputText.trim() || isProcessing}
                  className={`p-2 rounded-sm transition-all
                    ${!inputText.trim() || isProcessing 
                      ? 'text-brown-300 bg-beige-100' 
                      : 'text-beige-50 bg-brand-700 hover:bg-brand-800'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
