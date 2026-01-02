require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

console.log("🔑 API Key loaded:", !!process.env.GEMINI_API_KEY);

// Available models with fallback
const modelsToTry = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-3-flash",
    "gemini-2.0-flash-exp",
];

// Helper function to generate content with model fallback
async function generateWithFallback(prompt) {
    for (const modelName of modelsToTry) {
        try {
            console.log(`🔄 Trying model: ${modelName}`);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            console.log(`✅ Success with ${modelName}`);
            return response.text;
        } catch (error) {
            console.log(`❌ ${modelName} failed:`, error.message);
        }
    }
    throw new Error("All models failed");
}

module.exports = { generateWithFallback };