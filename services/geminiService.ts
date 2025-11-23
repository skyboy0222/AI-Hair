import { GoogleGenAI } from "@google/genai";

/**
 * Helper to clean base64 string
 */
const cleanBase64 = (base64: string): string => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

/**
 * Helper to get mime type
 */
const getMimeType = (base64: string): string => {
  const match = base64.match(/^data:(image\/\w+);base64,/);
  return match ? match[1] : 'image/jpeg';
};

export const generateHairstyle = async (
  userImage: string,
  prompt: string,
  refImage?: string | null
): Promise<string> => {
  try {
    // Initialize inside the function to avoid load-time crashes if API_KEY is missing in environment
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const parts: any[] = [];

    // 1. Add User Image
    parts.push({
      inlineData: {
        data: cleanBase64(userImage),
        mimeType: getMimeType(userImage),
      },
    });

    // 2. Add Reference Image if exists
    if (refImage) {
      parts.push({
        inlineData: {
          data: cleanBase64(refImage),
          mimeType: getMimeType(refImage),
        },
      });
      parts.push({
        text: "Using the second image as a style reference, apply that hairstyle to the person in the first image.",
      });
    }

    // 3. Construct System/User Prompt
    // We blend the user prompt with a strong system instruction for the model to act as a stylist.
    const fullPrompt = `
      You are an expert professional hair stylist and image editor.
      Task: Edit the first image provided.
      Goal: ${prompt || "Analyze the person's face shape and features. Generate a new hairstyle that perfectly suits them. Maintain the original face identity, lighting, and background."}
      Requirements:
      - Keep the person's facial features and identity EXACTLY the same.
      - High realism, 8k resolution, photorealistic.
      - If a reference image is provided, use it as the primary inspiration for the cut and color.
      - If no specific text instruction is given, choose a trendy, flattering style.
    `;

    parts.push({ text: fullPrompt });

    // 4. Call Gemini 2.5 Flash Image
    // Note: The guideline specifies gemini-2.5-flash-image for editing/generation.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
    });

    // 5. Parse Response
    // The model returns parts. We look for the image part.
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate hairstyle.");
  }
};