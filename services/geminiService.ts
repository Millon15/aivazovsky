import { GoogleGenAI } from "@google/genai";
import { Painting } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPaintingDetailsChat = async (
  currentHistory: { role: 'user' | 'model'; text: string }[],
  paintingContext: Painting,
  userMessage: string
): Promise<string> => {
  try {
    const systemInstruction = `You are an expert art curator specializing in Ivan Aivazovsky. 
    The user is currently looking at the painting "${paintingContext.title}" (${paintingContext.year}).
    Description: ${paintingContext.description}
    Significance: ${paintingContext.significance}
    
    Answer their questions specifically about this painting or Aivazovsky's style (Romanticism, marine art, light effects).
    Keep answers concise (under 100 words), polite, and educational.`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: currentHistory.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to the art archives right now.";
  }
};