
import { GoogleGenAI, Type } from "@google/genai";
import { Agreement, AgreementStatus, Milestone } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMilestones = async (description: string, totalAmount: number): Promise<Partial<Milestone>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a professional milestone schedule for this project: "${description}". 
      Total Budget: ${totalAmount} CSPR. 
      Format the response as a JSON array of objects with title, description, and amount (number).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              amount: { type: Type.NUMBER }
            },
            required: ["title", "description", "amount"]
          }
        }
      }
    });
    
    const parsed = JSON.parse(response.text || '[]');
    return parsed.map((m: any, idx: number) => ({
      ...m,
      id: `ai-${idx}-${Date.now()}`,
      status: 'Pending',
      deadline: new Date(Date.now() + (idx + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error("AI Milestone Gen Error:", error);
    return [];
  }
};

export const getAgreementAnalysis = async (agreement: Agreement) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        As a decentralized legal analyst for TrustFlow, analyze this smart agreement:
        Title: ${agreement.title}
        Description: ${agreement.description}
        Status: ${agreement.status}
        Total Amount: ${agreement.totalAmount} CSPR
        Milestones: ${JSON.stringify(agreement.milestones)}
        
        Provide a concise risk assessment and clarity summary for the parties involved.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "AI analysis currently unavailable.";
  }
};

export const suggestDisputeResolution = async (agreement: Agreement, reason: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Smart contract dispute on Casper Network:
        Agreement: ${agreement.title}
        Dispute Reason: ${reason}
        
        Suggest a fair resolution path (e.g., partial refund, extension, or mediator intervention) based on standard freelance/enterprise best practices.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("AI Resolution Error:", error);
    return "Could not generate dispute suggestion.";
  }
};
