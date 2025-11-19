
import { GoogleGenAI, Chat, GroundingChunk } from "@google/genai";
import { UserProfile, GroundingSource, University } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

let chatSession: Chat | null = null;

const createSystemInstruction = (profile: UserProfile) => `
    You are UniScout, an elite AI university researcher.
    
    USER PROFILE:
    - Name: ${profile.name}
    - Degree: ${profile.degreeLevel}
    - Field: ${profile.fieldOfStudy}
    - Budget: ${profile.budgetRange}
    - Locations: ${profile.preferredLocations.join(', ')}
    - Key Metrics: ${profile.keyMetrics.join(', ')}
    - Vibe: ${profile.vibe.join(', ')}
    - Priorities: ${profile.priorities}

    STRICT BEHAVIORAL RULES:
    1. **ACTION OVER CONVERSATION:** Do not ask "Would you like me to look for...?" or "Shall I proceed?". Just DO the research and present the results immediately.
    2. **MANDATORY CARDS:** If you mention specific universities that fit the user's criteria, you MUST generate the JSON block for them at the end of the response.
    3. **DEEP DETAIL:** In your text response, provide specific, "meaty" details about why you chose these schools. Mention specific professors, labs, clubs, or student sentiments found on forums. Do not be vague.
    4. **MINIMAL FOLLOW-UPS:** Only ask a follow-up if it is critically impossible to proceed. Otherwise, make an educated guess based on the profile and provide options.
    5. **HYPERLINKS:** Always hyperlink university names in the text: [University Name](URL).

    OUTPUT FORMAT:
    Part 1: Detailed Markdown analysis. Compare the schools, discuss pros/cons/red flags from student forums.
    Part 2: JSON block at the VERY END.

    \`\`\`json
    [
      {
        "name": "University Name",
        "location": "City, Country",
        "matchScore": 95,
        "tuition": "$XX,XXX/yr",
        "description": "A detailed 2-sentence summary focusing on the specific 'vibe' and academic strength matching the user.",
        "website": "https://...",
        "tags": ["Tag1", "Tag2"]
      }
    ]
    \`\`\`
  `;

export const initializeChatSession = (profile: UserProfile) => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: createSystemInstruction(profile),
      tools: [{ googleSearch: {} }],
    },
  });
};

export const updateChatProfile = async (newProfile: UserProfile) => {
    if (!chatSession) {
        initializeChatSession(newProfile);
        return;
    }

    const updateMessage = `
      SYSTEM UPDATE: The user has updated their profile.
      - Budget: ${newProfile.budgetRange}
      - Locations: ${newProfile.preferredLocations.join(', ')}
      - Field: ${newProfile.fieldOfStudy}
      - Key Metrics: ${newProfile.keyMetrics.join(', ')}
      - Vibe: ${newProfile.vibe.join(', ')}
      
      Reset your context to align with these new preferences. Immediately provide 3 new university recommendations based on this new profile without asking for permission.
    `;
    
    return chatSession.sendMessage({ message: updateMessage });
};

export const sendMessageToGemini = async (message: string): Promise<{ text: string; sources: GroundingSource[]; recommendations?: University[] }> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const result = await chatSession.sendMessage({ message });
    let fullText = result.text || "I found some information, but couldn't generate a text summary.";
    
    // Extract JSON recommendations if present
    let recommendations: University[] = [];
    // Improved regex to handle potential json markdown variations
    const jsonMatch = fullText.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
    
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1];
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed)) {
            recommendations = parsed.map((u: any) => ({
                id: u.name.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now() + Math.random().toString(36).substr(2, 5),
                name: u.name,
                location: u.location || "Unknown Location",
                matchScore: u.matchScore || 80,
                tuition: u.tuition || "Contact for rates",
                description: u.description || "",
                website: u.website || "#",
                tags: u.tags || []
            }));
        }
        // Remove the JSON block from the displayed text to keep UI clean
        fullText = fullText.replace(jsonMatch[0], '').trim();
      } catch (e) {
        console.error("Failed to parse recommendation JSON", e);
      }
    }

    // Extract sources
    const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    const sources: GroundingSource[] = [];

    chunks.forEach(chunk => {
      if (chunk.web?.uri && chunk.web?.title) {
        sources.push({
          title: chunk.web.title,
          uri: chunk.web.uri
        });
      }
    });

    return { text: fullText, sources, recommendations };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I'm having trouble connecting to my research database right now. Please check your connection or API key.",
      sources: []
    };
  }
};

export const generateWelcomeMessage = async (profile: UserProfile): Promise<{ text: string; sources: GroundingSource[]; recommendations?: University[] }> => {
  if (!chatSession) {
    initializeChatSession(profile);
  }
  
  const prompt = `
    The user ${profile.name} has just completed onboarding.
    Field: ${profile.fieldOfStudy}, Locations: ${profile.preferredLocations.join(', ')}.
    
    Immediately start researching and recommend 3 universities that match this profile. 
    Provide detailed analysis and include the JSON block for cards. 
    Do not simply welcome them, give them value immediately.
  `;

  return sendMessageToGemini(prompt);
};
