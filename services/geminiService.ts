import { GoogleGenAI } from "@google/genai";
import { NFL_FILM_ROOM_SYSTEM_INSTRUCTION, ANALYSIS_SCHEMA } from '../constants';
import type { AnalysisResponse, AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeVideo(youtubeUrl: string): Promise<AnalysisResult> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            fileData: {
              mimeType: 'video/youtube',
              fileUri: youtubeUrl,
            },
          },
        ],
      },
      config: {
        systemInstruction: NFL_FILM_ROOM_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: ANALYSIS_SCHEMA,
      },
    });

    const responseText = response.text.trim();
    
    // Sometimes the model might wrap the JSON in markdown backticks, so we clean it.
    const cleanedJsonText = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    const parsedResponse: AnalysisResponse = JSON.parse(cleanedJsonText);

    if (!parsedResponse.plays || !Array.isArray(parsedResponse.plays)) {
      throw new Error("Invalid response structure from API.");
    }

    return parsedResponse.plays;
  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during analysis.");
  }
}