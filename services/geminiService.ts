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

    // Validate and correct video IDs in timestamped links
    const validatedPlays: AnalysisResult = parsedResponse.plays.map((play: PlayAnalysis) => {
      const responseVideoId = extractYouTubeVideoId(play.timestampedLink);

      // If the video ID in the response is missing or doesn't match, correct it.
      if (!responseVideoId || responseVideoId !== originalVideoId) {
        let correctedLink = `https://www.youtube.com/watch?v=${originalVideoId}`;
        try {
          // Try to preserve the timestamp if it exists
          const responseUrl = new URL(play.timestampedLink);
          const timestamp = responseUrl.searchParams.get('t');
          if (timestamp) {
            correctedLink += `&t=${timestamp}`;
          }
        } catch (e) {
          // If the URL is malformed, we can't get the timestamp, but we can still correct the base URL.
          console.warn("Could not parse timestamp from model response URL:", play.timestampedLink);
        }
        
        return {
          ...play,
          timestampedLink: correctedLink,
        };
      }

      return play;
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