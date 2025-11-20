
import { GoogleGenAI, Chat, GroundingChunk } from "@google/genai";
import { UserProfile, GroundingSource, University } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

let chatSession: Chat | null = null;

const createSystemInstruction = (profile: UserProfile) => `
    You are Gradwyn, an elite AI university researcher for high-achieving students.
    
    USER PROFILE:
    - Name: ${profile.name}
    - Citizenship: ${profile.citizenship} (Consider visa requirements and international fees)
    - Degree: ${profile.degreeLevel}
    - Field: ${profile.fieldOfStudy}
    - Academic Stats: GPA ${profile.gpa}, Tests: ${profile.testScores}
    - Budget: ${profile.budgetRange}
    - Locations: ${profile.preferredLocations.join(', ')}
    - Key Metrics: ${profile.keyMetrics.join(', ')}
    - Vibe: ${profile.vibe.join(', ')}
    - Priorities: ${profile.priorities}

    STRICT BEHAVIORAL RULES:
    1. **ACTION OVER CONVERSATION:** Do not ask "Would you like me to look for...?" or "Shall I proceed?". Just DO the research and present the results immediately.
    2. **REALISTIC MATCHING:** Use their GPA/Test scores to categorize schools as Reach, Target, or Safety. Be honest if a school is likely out of reach.
    3. **MANDATORY CARDS:** If you mention specific universities that fit the user's criteria, you MUST generate the JSON block for them at the end of the response.
    4. **DEEP DETAIL:** In your text response, provide specific, "meaty" details about why you chose these schools. Mention specific professors, labs, clubs, or student sentiments found on forums.
    5. **SILENT JSON:** **NEVER** write "Here are the JSON blocks" or "Here is the data". The JSON block must be completely silent and invisible to the user in your text response. It exists ONLY for the code to read.
    6. **HYPERLINKS:** Always hyperlink university names in the text: [University Name](URL).

    OUTPUT FORMAT:
    Part 1: Detailed Markdown analysis. Compare the schools, discuss pros/cons/red flags.
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
    // We re-initialize to ensure the system instruction is fresh
    initializeChatSession(newProfile);
    
    const updateMessage = `
      SYSTEM UPDATE: The user has updated their profile.
      - Budget: ${newProfile.budgetRange}
      - Locations: ${newProfile.preferredLocations.join(', ')}
      - Field: ${newProfile.fieldOfStudy}
      - Stats: GPA ${newProfile.gpa}, Tests ${newProfile.testScores}
      - Priorities: ${newProfile.priorities}
      
      Reset your context. Ignore previous suggestions if they no longer fit. 
      Immediately provide 3 NEW university recommendations based on this new profile.
      Remember: SILENT JSON. Do not announce the data.
    `;
    
    return sendMessageToGemini(updateMessage);
};

export const sendMessageToGemini = async (message: string): Promise<{ text: string; sources: GroundingSource[]; recommendations?: University[] }> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const result = await chatSession.sendMessage({ message });
    let fullText = result.text || "I found some information, but couldn't generate a text summary.";
    let recommendations: University[] = [];
    
    // 1. Extract JSON
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
        
        // 2. Remove the JSON block from the text
        fullText = fullText.replace(jsonMatch[0], '');

        // 3. Clean up any "Here is the JSON" introductory text that might have been left behind
        // This regex looks for common phrases at the end of the string
        fullText = fullText.replace(/(Here (is|are) the (JSON|data|blocks|recommendations).*?[:.]\s*$)/gim, '');
        fullText = fullText.trim();

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
    Citizenship: ${profile.citizenship}, Stats: ${profile.gpa}, ${profile.testScores}.
    Priorities: ${profile.priorities}.
    
    Immediately start researching and recommend 3 universities that match this profile. 
    Consider their academic stats for realistic matching (Reach/Target/Safety).
    Provide detailed analysis and include the JSON block for cards. 
    Do not simply welcome them, give them value immediately.
    Remember: Do NOT say "Here is the JSON". Keep the data hidden.
  `;

  return sendMessageToGemini(prompt);
};
