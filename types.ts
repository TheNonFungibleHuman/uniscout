
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  type: 'applicant' | 'mentor' | 'university';
}

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  university: University;
  status: ApplicationStatus;
  submittedDate?: Date;
  lastUpdated: Date;
  progress: number; // 0-100
  currentStep: number; // 1-4
  formData: {
    personal?: {
      fullName?: string;
      email?: string;
      phone?: string;
      address?: string;
    };
    academic?: {
      gpa?: string;
      major?: string;
      testScores?: string;
    };
    essay?: string;
  };
}

export interface UserProfile {
  // Auth details
  email?: string;
  photoUrl?: string;
  
  // App details
  name: string;
  degreeLevel: string;
  fieldOfStudy: string;
  budgetRange: string;
  preferredLocations: string[];
  keyMetrics: string[];
  vibe: string[];
  priorities: string;
  savedSchools: University[];
  discardedSchools: string[]; // IDs of discarded schools
}

export interface OnboardingQuestion {
  id: keyof UserProfile;
  question: string;
  subtext?: string;
  type: 'text' | 'select' | 'multiselect' | 'button-group';
  options?: string[];
  placeholder?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
  placeAnswerSources?: { reviewSnippets: { snippet: string }[] }
}

export interface University {
  id: string;
  name: string;
  location: string;
  matchScore: number;
  tuition: string;
  description: string;
  website: string;
  tags: string[];
  logo?: string; // URL or placeholder color
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  university: string;
  image: string;
  bio: string;
  availability: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: GroundingSource[];
  isThinking?: boolean;
  recommendations?: University[];
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
}
