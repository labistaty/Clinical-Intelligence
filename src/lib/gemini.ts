import { GoogleGenAI, Type } from "@google/genai";

// Shim process for browser if not defined
if (typeof process === 'undefined') {
  (window as any).process = { env: {} };
}

// Initialize AI with fallback for different environments
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
const ai = new GoogleGenAI({ apiKey: apiKey as string });

export async function getSymptomSuggestions(selectedSymptoms: string[], allSymptoms: { id: string, label: string }[]) {
  if (selectedSymptoms.length === 0) return [];

  const prompt = `Given the following selected symptoms: ${selectedSymptoms.join(", ")}. 
  From the list of available symptoms below, suggest 3-5 other symptoms that commonly co-occur or are related.
  
  Available symptoms:
  ${allSymptoms.map(s => `${s.id}: ${s.label}`).join("\n")}
  
  Return only the IDs of the suggested symptoms in a JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const suggestions = JSON.parse(response.text || "[]");
    return suggestions as string[];
  } catch (error) {
    console.error("Gemini suggestion error:", error);
    return [];
  }
}

export async function searchSymptomsAI(query: string, allSymptoms: { id: string, label: string }[]) {
  if (!query) return [];

  const prompt = `The user is searching for symptoms with the query: "${query}".
  From the list of available symptoms below, identify the most relevant ones.
  
  Available symptoms:
  ${allSymptoms.map(s => `${s.id}: ${s.label}`).join("\n")}
  
  Return only the IDs of the relevant symptoms in a JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    return results as string[];
  } catch (error) {
    console.error("Gemini search error:", error);
    return [];
  }
}
