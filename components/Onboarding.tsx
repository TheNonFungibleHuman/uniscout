
import React, { useState } from 'react';
import { ONBOARDING_STEPS } from '../constants';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    preferredLocations: [],
    vibe: []
  });
  const [inputValue, setInputValue] = useState('');

  const question = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    // Save current input for text fields
    if (question.type === 'text') {
      setProfile(prev => ({ ...prev, [question.id]: inputValue }));
    }
    
    if (isLastStep) {
        // For the last step (text), we need to make sure we save the input value before completing
        const finalProfile = {
            ...profile,
            [question.id]: question.type === 'text' ? inputValue : profile[question.id as keyof UserProfile]
        } as UserProfile;
        onComplete(finalProfile);
    } else {
      setInputValue(''); // Reset input for next text question
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (question.type === 'button-group') {
      setProfile(prev => ({ ...prev, [question.id]: option }));
      setTimeout(handleNext, 200); // Auto advance for single select
    } else if (question.type === 'multiselect') {
      setProfile(prev => {
        const currentList = (prev[question.id as keyof UserProfile] as string[]) || [];
        
        // Logic for 'Doesn't matter to me'
        if (option === "Doesn't matter to me") {
          // If checking "doesn't matter", clear everything else and just select it
          if (!currentList.includes(option)) {
             return { ...prev, [question.id]: [option] };
          }
          // If unchecking it, just return empty
          return { ...prev, [question.id]: [] };
        }

        // If selecting a normal option, make sure "Doesn't matter" is removed
        const listWithoutDoesntMatter = currentList.filter(item => item !== "Doesn't matter to me");

        if (listWithoutDoesntMatter.includes(option)) {
          return { ...prev, [question.id]: listWithoutDoesntMatter.filter(item => item !== option) };
        } else {
          // Limit vibes to 3
          if (question.id === 'vibe' && listWithoutDoesntMatter.length >= 3) return prev;
          return { ...prev, [question.id]: [...listWithoutDoesntMatter, option] };
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const isNextDisabled = () => {
    if (question.type === 'text') return inputValue.trim().length === 0;
    if (question.type === 'button-group') return !profile[question.id as keyof UserProfile];
    if (question.type === 'multiselect') return (profile[question.id as keyof UserProfile] as string[] || []).length === 0;
    return false;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-brand-50 to-indigo-50">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-slate-100 transition-all duration-500">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-brand-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 animate-fade-in">
            {question.question}
          </h2>
          {question.subtext && (
            <p className="text-slate-500 text-lg">{question.subtext}</p>
          )}
        </div>

        {/* Input Area */}
        <div className="min-h-[200px] flex flex-col justify-start">
          {question.type === 'text' && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isNextDisabled() && handleNext()}
              placeholder={question.placeholder}
              className="w-full text-xl p-4 border-b-2 border-brand-200 focus:border-brand-600 outline-none bg-transparent transition-colors placeholder:text-slate-300 text-slate-800"
              autoFocus
            />
          )}

          {question.type === 'button-group' && question.options && (
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleOptionSelect(opt)}
                  className={`p-4 text-left rounded-xl border-2 transition-all duration-200 font-medium text-lg
                    ${profile[question.id as keyof UserProfile] === opt 
                      ? 'border-brand-600 bg-brand-50 text-brand-700' 
                      : 'border-slate-200 hover:border-brand-300 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {question.type === 'multiselect' && question.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((opt) => {
                const isSelected = (profile[question.id as keyof UserProfile] as string[])?.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect(opt)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 font-medium
                      ${isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-700' 
                        : 'border-slate-200 hover:border-brand-300 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors
              ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className={`px-8 py-3 rounded-lg bg-brand-600 text-white font-bold shadow-lg shadow-brand-200 transition-all
              ${isNextDisabled() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-700 hover:translate-y-[-1px]'}`}
          >
            {isLastStep ? 'Start Exploring' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
