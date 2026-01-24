import { GoogleGenAI, Type } from "@google/genai";

export interface StrategyResponse {
  summary: string;
  actionItems: string[];
  recommendedPlatforms: string[];
  aiInsight: string;
}

export const generateGrowthStrategy = async (
  ministryName: string,
  goals: string,
  mission: string
): Promise<StrategyResponse> => {
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : null;
  
  if (!apiKey) {
    throw new Error("Ministerial AI Key not found. Please check environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a specialist digital ministry consultant with 20 years of experience helping churches and nonprofits.
    Generate a digital stewardship and outreach roadmap for the following organization:
    Organization Name: ${ministryName}
    Ministry Goals: ${goals}
    Core Mission: ${mission}
    
    Guidelines:
    - Use language familiar to churches (e.g., 'Kingdom impact', 'discipleship', 'fellowship', 'outreach', 'shepherding', 'stewardship').
    - Focus on how digital tools can foster real-world spiritual connection.
    - Provide practical action items for a ministry team.
    
    Response must be a structured strategy.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A ministerial summary of the proposed strategy." },
          actionItems: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Step-by-step outreach and stewardship actions."
          },
          recommendedPlatforms: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Digital platforms best suited for this specific mission."
          },
          aiInsight: { type: Type.STRING, description: "A unique spiritual/technical insight on using AI for this mission." }
        },
        required: ["summary", "actionItems", "recommendedPlatforms", "aiInsight"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON parsing error:", text);
    throw new Error("Invalid roadmap format received.");
  }
};