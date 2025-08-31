import { GoogleGenAI } from "@google/genai";
import { FOOTBALL_FILM_ROOM_SYSTEM_INSTRUCTION, ANALYSIS_SCHEMA } from '../constants';
import type { AnalysisResponse, AnalysisResult, PlayAnalysis } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extracts the YouTube video ID from a URL.
 * @param url The YouTube URL.
 * @returns The video ID or null if not found.
 */
function extractYouTubeVideoId(url: string): string | null {
  // Regex to find video ID from various YouTube URL formats.
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}


export async function analyzeVideo(youtubeUrl: string): Promise<AnalysisResult> {
  const originalVideoId = extractYouTubeVideoId(youtubeUrl);
  if (!originalVideoId) {
    throw new Error("Invalid YouTube URL provided. Could not extract video ID.");
  }

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
          {
            text: youtubeUrl,
          },
        ],
      },
      config: {
        systemInstruction: FOOTBALL_FILM_ROOM_SYSTEM_INSTRUCTION,
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

    // Validate and normalize the API response data
    const validatedPlays: AnalysisResult = parsedResponse.plays.map((play: any): PlayAnalysis => {
      const correctedPlay = { ...play };

      // 1. Validate and correct timestampedLink
      const responseVideoId = extractYouTubeVideoId(correctedPlay.timestampedLink);
      if (!responseVideoId || responseVideoId !== originalVideoId) {
        let correctedLink = `https://www.youtube.com/watch?v=${originalVideoId}`;
        try {
          const responseUrl = new URL(correctedPlay.timestampedLink);
          const timestamp = responseUrl.searchParams.get('t');
          if (timestamp) {
            correctedLink += `&t=${timestamp}`;
          }
        } catch (e) {
          console.warn("Could not parse timestamp from model response URL:", correctedPlay.timestampedLink);
        }
        correctedPlay.timestampedLink = correctedLink;
      }
      
      // 2. Normalize technicalTerms to handle potential key casing issues from the model (e.g., Term vs term).
      if (Array.isArray(correctedPlay.technicalTerms)) {
        correctedPlay.technicalTerms = correctedPlay.technicalTerms.map((term: any) => ({
          term: term.term || term.Term,
          definition: term.definition || term.Definition,
        }));
      } else {
        correctedPlay.technicalTerms = [];
      }

      return correctedPlay as PlayAnalysis;
    });

    return validatedPlays;
  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during analysis.");
  }
}
