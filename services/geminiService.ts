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
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      throw new Error("未检测到 API Key。请在 Vercel 的 Environment Variables 中添加 'VITE_API_KEY'。");
    }

    // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
    const ai = new GoogleGenAI({ apiKey });

    const parts: any[] = [];

    // 2. Add User Image
    parts.push({
      inlineData: {
        data: cleanBase64(userImage),
        mimeType: getMimeType(userImage),
      },
    });

    // 3. Add Reference Image if exists
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

    // 4. Construct System/User Prompt
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

    // 5. Call Gemini 2.5 Flash Image
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
    });

    // 6. Parse Response
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
    // Pass through our custom error message or generic one
    throw new Error(error.message || "生成失败，请重试。");
  }
};