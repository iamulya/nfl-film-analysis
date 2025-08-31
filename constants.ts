
import { Type } from "@google/genai";

export const NFL_FILM_ROOM_PROMPT = `
### **The Ultimate NFL Film Room Analyst Prompt **

**Persona & Role:**

You are an **Expert NFL Analyst and Film Breakdown Specialist**. Your name is "Coach JJ." You possess the deep tactical knowledge of an NFL offensive and defensive coordinator, the sharp eye of a professional scout, and the clear communication skills of a lead broadcast analyst. Your goal is to deconstruct football plays with precision, clarity, and insight, making complex concepts accessible to everyone.

**Primary Task:**

Your primary task is to watch the provided NFL YouTube video and generate a detailed, technical "Film Room" breakdown of the most significant plays. For each play, you will provide a direct, timestamped link and a simple explanation of any technical terms used. You are preparing a report for a coaching staff that is also clear enough for a dedicated fan to understand. The output must be a valid JSON object following the provided schema.

**Instructions & Workflow:**

1.  Thoroughly analyze the entire video content from the **YouTube URL** provided: {YOUTUBE_URL}.
2.  Identify a minimum of **8 significant plays**. A significant play is defined as a touchdown, a turnover, a sack, a key 4th down conversion/stop, or any play that demonstrates exceptional or flawed strategy and execution.
3.  For **each** of the identified plays, you must structure your analysis using the precise, multi-part template defined in the JSON schema.
4.  To create the **Timestamped Link**, take the EXACT YouTube URL provided by the user and append \`&t=[#]s\`, where \`[#]\` is the total number of seconds corresponding to the play's start time (e.g., a timestamp of 02:15 becomes \`&t=135s\`).
5.  After each play's breakdown, populate the **"technicalTerms"** array by identifying every single football-related jargon used in your analysis and defining it in simple, layman's terms.

**Output Format:**

Return ONLY a single, valid JSON object that conforms to the provided JSON schema. Do not include any markdown formatting or any text outside of the JSON object.
`;

export const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    plays: {
      type: Type.ARRAY,
      description: "An array of detailed analyses for each significant play.",
      items: {
        type: Type.OBJECT,
        required: ["playNumber", "title", "timestampedLink", "situation", "preSnapAnalysis", "offensiveBreakdown", "defensiveBreakdown", "keyToSuccessOrFailure", "outcome", "technicalTerms"],
        properties: {
          playNumber: { type: Type.INTEGER, description: "The sequential number of the play, starting from 1." },
          title: { type: Type.STRING, description: "A descriptive title for the play." },
          timestampedLink: { type: Type.STRING, description: "Full YouTube URL with timestamp (e.g., https://www.youtube.com/watch?v=...&t=135s)." },
          situation: {
            type: Type.OBJECT,
            properties: {
              currentScore: { type: Type.STRING, description: "Score at the time of the play." },
              downAndDistance: { type: Type.STRING, description: "e.g., 3rd & 7" },
              fieldPosition: { type: Type.STRING, description: "e.g., Ball on the Chargers' 45-yard line" },
              quarterAndTime: { type: Type.STRING, description: "e.g., 2nd Quarter, 8:15 remaining" }
            }
          },
          preSnapAnalysis: {
            type: Type.OBJECT,
            properties: {
              offensiveFormation: { type: Type.STRING, description: "e.g., Shotgun, Trips Right, 11 Personnel" },
              defensiveFormation: { type: Type.STRING, description: "e.g., 4-3 Under Front, showing Cover 2" }
            }
          },
          offensiveBreakdown: {
            type: Type.OBJECT,
            properties: {
              inferredPlayCall: { type: Type.STRING, description: "e.g., Play-Action Deep Post" },
              executionDetails: {
                type: Type.OBJECT,
                properties: {
                  QB: { type: Type.STRING },
                  "O-Line": { type: Type.STRING, description: "Describe O-Line blocking scheme."},
                  "Receivers/TEs": { type: Type.STRING, description: "Describe receiver route concepts."},
                  RunningBack: { type: Type.STRING, description: "Describe running back's role."}
                }
              }
            }
          },
          defensiveBreakdown: {
            type: Type.OBJECT,
            properties: {
              inferredPlayCall: { type: Type.STRING, description: "e.g., Cover 3 Zone Blitz" },
              executionDetails: {
                type: Type.OBJECT,
                properties: {
                  "D-Line": { type: Type.STRING, description: "Describe D-Line pass rush strategy."},
                  Linebackers: { type: Type.STRING, description: "Describe linebacker responsibility."},
                  Secondary: { type: Type.STRING, description: "Detail coverage execution."}
                }
              }
            }
          },
          keyToSuccessOrFailure: { type: Type.STRING, description: "The single most important factor that made the play succeed or fail." },
          outcome: { type: Type.STRING, description: "The result of the play, e.g., '15-yard touchdown reception'." },
          technicalTerms: {
            type: Type.ARRAY,
            description: "An array of technical terms used in the analysis with their definitions.",
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  }
};
