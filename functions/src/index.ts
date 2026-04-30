
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { GoogleGenAI, GenerateContentRequest } from "@google/genai";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

export const askGemini = onCall({ secrets: [geminiApiKey] }, async (request) => {
  // 1. Authenticate Request
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  const { message, systemInstruction, history } = request.data as { 
    message: string; 
    systemInstruction: string;
    history?: any[];
  };

  if (!message || !systemInstruction) {
    throw new HttpsError("invalid-argument", "Message and systemInstruction are required.");
  }

  const apiKey = geminiApiKey.value();
  const genAI = new GoogleGenAI(apiKey);
  
  // Using Gemini 2.5 Flash as requested
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemInstruction,
    tools: [{ googleSearch: {} }] as any,
  });

  try {
    const chat = model.startChat({
        history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const fullText = response.text();
    
    // Extract Grounding Sources
    const sources: { title: string; uri: string }[] = [];
    const candidate = response.candidates?.[0];
    if (candidate?.groundingMetadata?.groundingChunks) {
        candidate.groundingMetadata.groundingChunks.forEach((c: any) => {
            if (c.web?.uri && c.web?.title) {
                sources.push({ title: c.web.title, uri: c.web.uri });
            }
        });
    }

    // Basic parsing for the divider and JSON section
    // In a real scenario, we'd share the parsing logic between client/server
    // but for this implementation, we return the raw text and sources
    // and let the client handle structural parsing (recommendations)
    // or we can parse here. Let's return everything for the client service to handle.

    return { 
      text: fullText, 
      sources: sources,
    };
  } catch (error: any) {
    console.error("Gemini Cloud Function Error:", error);
    throw new HttpsError("internal", error.message || "An error occurred while calling Gemini.");
  }
});
