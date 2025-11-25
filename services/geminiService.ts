import { GoogleGenAI, Type } from "../libs/deps.js";
import type { CycleStat } from '../types';

// Helper to safely get the API key or return null
// In a real extension without a bundler, process.env isn't available.
// You must replace this string with your actual key or implement a settings input.
const getApiKey = () => {
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
     // @ts-ignore
     return process.env.API_KEY;
  }
  // Fallback or Placeholder. 
  // User should ideally input this in the Options screen if not hardcoded.
  return ""; 
};

export const getAISiteSuggestions = async (browsingHistory: string[]): Promise<string[]> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key missing. Skipping suggestion.");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log("Calling Gemini to suggest distracting sites based on history:", browsingHistory);
  
  const prompt = `Com base nesta lista de domínios visitados, identifique os top 3 mais prováveis de serem distrações para alguém tentando focar. Responda apenas com os domínios (ex: ['site.com']). Histórico: ${JSON.stringify(browsingHistory)}`;
  
  try {
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

    if (response.text) {
        return JSON.parse(response.text);
    }
    return [];
  } catch (e) {
    console.error("Gemini API Error:", e);
    return [];
  }
};

export const getAIInsights = async (stats: CycleStat[]): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) {
        return "Configure sua chave de API para receber insights.";
    }

    const ai = new GoogleGenAI({ apiKey });

    console.log("Calling Gemini to generate insights from user stats:", stats);
    
    const prompt = `Aja como um coach de produtividade gentil e motivador. Analise os seguintes dados de sessão de foco e forneça um insight curto (máximo 2 frases) e encorajador em Português do Brasil. Dados: ${JSON.stringify(stats)}`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "Continue o bom trabalho!";
    } catch (e) {
        console.error("Gemini Insight Error:", e);
        return "Não foi possível gerar insights no momento.";
    }
};