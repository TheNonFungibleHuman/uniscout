
import { OnboardingQuestion, Mentor, University } from './types';

export const ONBOARDING_STEPS: OnboardingQuestion[] = [
  {
    id: 'name',
    question: "Hi! I'm UniScout. What should I call you?",
    type: 'text',
    placeholder: "Enter your name"
  },
  {
    id: 'degreeLevel',
    question: "What level of study are you looking for?",
    type: 'button-group',
    options: ["Bachelor's", "Master's", "PhD", "Associate's", "Certificate"]
  },
  {
    id: 'fieldOfStudy',
    question: "What are you interested in studying?",
    subtext: "It's okay if you're not 100% sure yet.",
    type: 'text',
    placeholder: "e.g. Computer Science, Psychology, Marine Biology"
  },
  {
    id: 'preferredLocations',
    question: "Where in the world do you want to study?",
    subtext: "Select as many as apply.",
    type: 'multiselect',
    options: [
        "USA - East Coast", 
        "USA - West Coast", 
        "USA - Midwest", 
        "UK", 
        "Europe", 
        "Canada", 
        "Australia", 
        "Africa", 
        "Asia", 
        "Remote/Online"
    ]
  },
  {
    id: 'budgetRange',
    question: "What is your approximate annual tuition budget?",
    subtext: "This helps me find realistic options.",
    type: 'button-group',
    options: ["Under $10k", "$10k - $25k", "$25k - $50k", "$50k+", "Scholarship Dependent"]
  },
  {
    id: 'keyMetrics',
    question: "What matters most to you?",
    subtext: "Select your top 3 priorities to speed up my research.",
    type: 'multiselect',
    options: [
        "Academic Ranking / Prestige",
        "Tuition Cost & Financial Aid",
        "Campus Culture & Social Life",
        "Location Safety & Comfort",
        "Career Support & Internships",
        "Diversity & Inclusion",
        "Research Opportunities",
        "Sports & Athletics"
    ]
  },
  {
    id: 'vibe',
    question: "What kind of campus vibe fits you best?",
    subtext: "Select up to 3.",
    type: 'multiselect',
    options: [
      "Big City Energy", 
      "College Town", 
      "Research Focused", 
      "Party / Social", 
      "Sports Heavy", 
      "Tight-knit Community", 
      "Nature / Outdoorsy",
      "Career Driven",
      "Doesn't matter to me"
    ]
  },
  {
    id: 'priorities',
    question: "Is there anything else specific you're looking for?",
    subtext: "e.g., specific clubs, disability support, LGBTQ+ friendly, internship programs...",
    type: 'text',
    placeholder: "Tell me your must-haves..."
  }
];

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: "Dr. Sarah Chen",
    role: "Alumni & Research Lead",
    university: "Stanford University",
    image: "https://i.pravatar.cc/150?u=sarah",
    bio: "PhD in Computer Science. I can help with navigating research grants and lab placements.",
    availability: "Mon, Wed 2pm-5pm EST",
    tags: ["STEM", "Research", "PhD"]
  },
  {
    id: 'm2',
    name: "Marcus Johnson",
    role: "Senior Student Ambassador",
    university: "University of Manchester",
    image: "https://i.pravatar.cc/150?u=marcus",
    bio: "Final year Engineering student. Ask me about finding housing and the international student experience.",
    availability: "Fri 10am-1pm GMT",
    tags: ["Engineering", "Student Life", "International"]
  },
  {
    id: 'm3',
    name: "Elena Rodriguez",
    role: "Admissions Consultant",
    university: "Columbia University",
    image: "https://i.pravatar.cc/150?u=elena",
    bio: "Former admissions officer. I specialize in essay review and interview prep for Ivy League schools.",
    availability: "Tue, Thu 4pm-7pm EST",
    tags: ["Admissions", "Essay Review", "Liberal Arts"]
  },
  {
    id: 'm4',
    name: "Akwasi Mensah",
    role: "Graduate Mentor",
    university: "University of Cape Town",
    image: "https://i.pravatar.cc/150?u=akwasi",
    bio: "Focusing on sustainable development. Happy to chat about scholarships in Africa.",
    availability: "Sat 9am-12pm SAST",
    tags: ["Development", "Scholarships", "Africa"]
  }
];

// Fallback data for the dashboard if user skips chat without recs
export const MOCK_DATABASE_UNIVERSITIES: University[] = [
  {
    id: 'd1',
    name: "Massachusetts Institute of Technology (MIT)",
    location: "Cambridge, MA, USA",
    matchScore: 98,
    tuition: "$57,000/yr",
    description: "World-renowned for STEM. Intense research focus with a collaborative, albeit stressful, culture.",
    website: "https://www.mit.edu",
    tags: ["Top Ranked", "Research", "Urban"]
  },
  {
    id: 'd2',
    name: "University of Oxford",
    location: "Oxford, UK",
    matchScore: 95,
    tuition: "£30,000/yr (Intl)",
    description: "Historic collegiate university. Unique tutorial system offering personalized academic attention.",
    website: "https://www.ox.ac.uk",
    tags: ["Historic", "Prestige", "Collegiate"]
  },
  {
    id: 'd3',
    name: "University of Toronto",
    location: "Toronto, Canada",
    matchScore: 90,
    tuition: "$45,000 CAD/yr",
    description: "Major research hub in a diverse global city. Large class sizes but incredible networking opportunities.",
    website: "https://www.utoronto.ca",
    tags: ["Diverse", "Urban", "Research"]
  },
  {
    id: 'd4',
    name: "University of Cape Town",
    location: "Cape Town, South Africa",
    matchScore: 88,
    tuition: "$15,000/yr",
    description: "Top university in Africa. Stunning campus setting and strong focus on development studies.",
    website: "https://www.uct.ac.za",
    tags: ["Scenic", "Development", "Africa"]
  }
];

// A mock list of universities to simulate the search functionality
export const AUTOCOMPLETE_UNIVERSITIES: University[] = [
    ...MOCK_DATABASE_UNIVERSITIES,
    { id: 's1', name: 'Harvard University', location: 'Cambridge, MA', matchScore: 96, tuition: '$57,000/yr', description: 'The oldest institution of higher learning in the US, known for its history, wealth, and influence.', website: 'https://harvard.edu', tags: ['Ivy League', 'Historic', 'Research'] },
    { id: 's2', name: 'Stanford University', location: 'Stanford, CA', matchScore: 97, tuition: '$56,000/yr', description: 'Located in Silicon Valley, known for its entrepreneurial spirit and strength in computer science.', website: 'https://stanford.edu', tags: ['Silicon Valley', 'Tech', 'Entrepreneurship'] },
    { id: 's3', name: 'ETH Zurich', location: 'Zurich, Switzerland', matchScore: 92, tuition: '$1,500/yr', description: 'A leading STEM university in Europe with extremely low tuition but high living costs.', website: 'https://ethz.ch', tags: ['STEM', 'Europe', 'Low Tuition'] },
    { id: 's4', name: 'National University of Singapore', location: 'Singapore', matchScore: 91, tuition: '$30,000/yr', description: 'A comprehensive research university and the oldest higher education institution in Singapore.', website: 'https://nus.edu.sg', tags: ['Asia', 'Research', 'Global'] },
    { id: 's5', name: 'University of Melbourne', location: 'Melbourne, Australia', matchScore: 89, tuition: '$40,000 AUD/yr', description: 'Australia’s leading comprehensive research university with a unique curriculum model.', website: 'https://unimelb.edu.au', tags: ['Australia', 'Urban', 'Research'] },
    { id: 's6', name: 'McGill University', location: 'Montreal, Canada', matchScore: 90, tuition: '$25,000 CAD/yr', description: 'Known as the Harvard of Canada, located in a bilingual and student-friendly city.', website: 'https://mcgill.ca', tags: ['Canada', 'Historic', 'Medical'] },
    { id: 's7', name: 'University of Tokyo', location: 'Tokyo, Japan', matchScore: 88, tuition: '$5,000/yr', description: 'Japan’s most prestigious university, offering world-class research facilities.', website: 'https://u-tokyo.ac.jp', tags: ['Japan', 'Prestige', 'Research'] },
    { id: 's8', name: 'Tsinghua University', location: 'Beijing, China', matchScore: 93, tuition: '$5,000/yr', description: 'Consistently ranked as one of the best universities in China and Asia.', website: 'https://tsinghua.edu.cn', tags: ['China', 'Engineering', 'Elite'] },
    { id: 's9', name: 'Imperial College London', location: 'London, UK', matchScore: 94, tuition: '£34,000/yr', description: 'A world-class university with a mission to benefit society through excellence in science, engineering, medicine and business.', website: 'https://imperial.ac.uk', tags: ['STEM', 'London', 'Innovation'] },
    { id: 's10', name: 'University of British Columbia', location: 'Vancouver, Canada', matchScore: 89, tuition: '$40,000 CAD/yr', description: 'A global center for research and teaching, consistently ranked among the top 20 public universities in the world.', website: 'https://ubc.ca', tags: ['Canada', 'Nature', 'Research'] },
    { id: 's11', name: 'Princeton University', location: 'Princeton, NJ', matchScore: 95, tuition: '$56,000/yr', description: 'A private Ivy League research university known for its beautiful campus and focus on undergraduate education.', website: 'https://princeton.edu', tags: ['Ivy League', 'Undergrad Focus', 'Suburban'] },
    { id: 's12', name: 'Yale University', location: 'New Haven, CT', matchScore: 94, tuition: '$60,000/yr', description: 'Known for its drama and music programs, as well as its secret societies and residential college system.', website: 'https://yale.edu', tags: ['Ivy League', 'Arts', 'Historic'] }
];
