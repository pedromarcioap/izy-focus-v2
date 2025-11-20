
// FIX: Changed import from 'import type' to a regular import and added 'Type' for response schema, as per Gemini API guidelines.
import { GoogleGenAI, Type } from "@google/genai";
import type { CycleStat } from '../types';

// FIX: Initialized the GoogleGenAI client as per the guidelines to enable API calls.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAISiteSuggestions = async (browsingHistory: string[]): Promise<string[]> => {
  console.log("Calling Gemini to suggest distracting sites based on history:", browsingHistory);
  
  // FIX: Replaced mock implementation with a real Gemini API call using responseSchema for structured JSON output.
  const prompt = `Com base nesta lista de domínios visitados, identifique os top 3 mais prováveis de serem distrações para alguém tentando focar. Responda apenas com os domínios (ex: ['site.com']). Histórico: ${JSON.stringify(browsingHistory)}`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
                description: 'A distracting website domain.'
            }
        }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini API response as JSON", e);
    return [];
  }
};

export const getAIInsights = async (stats: CycleStat[]): Promise<string> => {
    console.log("Calling Gemini to generate insights from user stats:", stats);
    
    // FIX: Replaced mock implementation with a real Gemini API call.
    const prompt = `Aja como um coach de produtividade gentil e motivador. Analise os seguintes dados de sessão de foco e forneça um insight curto (máximo 2 frases) e encorajador em Português do Brasil. Dados: ${JSON.stringify(stats)}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
};
