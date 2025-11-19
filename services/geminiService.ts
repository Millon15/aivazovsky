import { GoogleGenAI, Type } from "@google/genai";
import { Painting } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to construct the redirect URL for Wikimedia Commons
// This avoids needing to know the MD5 hash folder structure (e.g. /a/a1/)
const getWikimediaUrl = (filename: string): string => {
  // Remove potential "File:" prefix if the model hallucinates it
  const cleanName = filename.replace(/^File:/, '').trim();
  // Encode the filename to handle spaces and special characters correctly
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(cleanName)}?width=1200`;
};

export const fetchPaintings = async (): Promise<Painting[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Compile a list of the 9 most valuable and famous paintings by Ivan Aivazovsky. 
      
      CRITICAL IMAGE REQUIREMENT:
      For each painting, provide the EXACT "filename" as it is stored on Wikimedia Commons.
      Do NOT provide a URL. Provide ONLY the filename with the extension (usually .jpg).
      
      Prefer the high-resolution scans labeled with "Google Art Project" when available, as they are the highest quality.
      
      Example format: 
      "Ivan_Aivazovsky_-_The_Ninth_Wave_-_Google_Art_Project.jpg"
      "Ivan_Konstantinovich_Aivazovsky_-_Among_the_Waves,_1898.jpg"
      
      Focus on his marine art and masterpieces.
      Provide accurate historical details.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              year: { type: Type.INTEGER },
              description: { type: Type.STRING },
              significance: { type: Type.STRING },
              aestheticScore: { type: Type.INTEGER, description: "A subjective score from 80-100 representing its fame and impact" },
              dimensions: { type: Type.STRING },
              location: { type: Type.STRING },
              imageFilename: { type: Type.STRING, description: "The exact filename on Wikimedia Commons (e.g. 'File.jpg')" },
            },
            required: ["id", "title", "year", "description", "significance", "aestheticScore", "dimensions", "location", "imageFilename"],
          },
        },
      },
    });

    if (response.text) {
      const rawData = JSON.parse(response.text);
      // Transform the filename into a valid redirect URL
      return rawData.map((item: any) => ({
        ...item,
        imageUrl: getWikimediaUrl(item.imageFilename)
      })) as Painting[];
    }
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Failed to fetch paintings:", error);
    
    // Fallback data with KNOWN correct filenames
    const fallbackData = [
      {
        id: "ninth_wave",
        title: "The Ninth Wave",
        year: 1850,
        description: "The most famous seascape by Aivazovsky, depicting people clinging to debris after a shipwreck at sunrise.",
        significance: "Iconic example of Russian Romanticism, symbolizing the struggle between man and nature.",
        aestheticScore: 100,
        dimensions: "221 cm × 332 cm",
        location: "State Russian Museum, St. Petersburg",
        imageFilename: "Ivan_Aivazovsky_-_The_Ninth_Wave_-_Google_Art_Project.jpg"
      },
      {
        id: "among_waves",
        title: "Among the Waves",
        year: 1898,
        description: "Painted near the end of his life, this work shows the artist's ability to capture the movement of waves with incredible realism.",
        significance: "Considered the pinnacle of his late period work.",
        aestheticScore: 98,
        dimensions: "285 cm × 429 cm",
        location: "Aivazovsky National Art Gallery, Feodosia",
        imageFilename: "Ivan_Konstantinovich_Aivazovsky_-_Among_the_Waves,_1898.jpg"
      },
      {
        id: "chaos_creation",
        title: "Chaos (The Creation)",
        year: 1841,
        description: "A depiction of the creation of the world, showing the separation of light from darkness.",
        significance: "Awarded a gold medal by Pope Gregory XVI, who was deeply moved by its spiritual power.",
        aestheticScore: 95,
        dimensions: "106 cm × 75 cm",
        location: "Mekhitarist Congregation, Venice",
        imageFilename: "Ivan_Aivazovsky_-_Chaos_(The_Creation)_-_Google_Art_Project.jpg"
      },
      {
        id: "black_sea",
        title: "The Black Sea",
        year: 1881,
        description: "A dark, brooding depiction of the sea in a storm, showcasing Aivazovsky's mastery of water transparency without any land or ships.",
        significance: "Considered by Kramskoy to be one of the most powerful realistic depictions of the element.",
        aestheticScore: 92,
        dimensions: "149 cm × 208 cm",
        location: "Tretyakov Gallery, Moscow",
        imageFilename: "Ivan_Aivazovsky_-_Black_Sea_-_Google_Art_Project.jpg"
      },
      {
        id: "battle_chesma",
        title: "Battle of Chesma",
        year: 1848,
        description: "Depicts the Battle of Chesma in 1770, a significant naval battle of the Russo-Turkish War.",
        significance: "A masterpiece of battle painting, highlighting the dramatic destruction of the Turkish fleet.",
        aestheticScore: 90,
        dimensions: "193 cm × 183 cm",
        location: "Aivazovsky National Art Gallery, Feodosia",
        imageFilename: "Ivan_Aivazovsky_-_Battle_of_Chesma_-_Google_Art_Project.jpg"
      },
      {
        id: "brig_mercury",
        title: "Brig 'Mercury' Attacked by Two Turkish Ships",
        year: 1892,
        description: "Shows the Russian brig Mercury engaged in battle against two larger Turkish ships of the line.",
        significance: "Commemorates a heroic moment in Russian naval history.",
        aestheticScore: 88,
        dimensions: "212 cm × 339 cm",
        location: "Aivazovsky National Art Gallery, Feodosia",
        imageFilename: "Ivan_Aivazovsky_-_Brig_Mercury_Attacked_by_Two_Turkish_Ships_-_Google_Art_Project.jpg"
      }
    ];

    return fallbackData.map(item => ({
      ...item,
      imageUrl: getWikimediaUrl(item.imageFilename)
    })) as Painting[];
  }
};

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