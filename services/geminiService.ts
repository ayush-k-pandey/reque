
import { GoogleGenAI, Type } from "@google/genai";
import { NewsUpdate } from "../types";

// Initializing the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "PLACEHOLDER_KEY"});

export const getAIGeneratedAlerts = async (location: string): Promise<NewsUpdate[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 realistic disaster management news updates for ${location}. Include one URGENT, one UPDATE, and one ADVISORY. Return as a JSON array of objects with fields: id, title, timestamp, category (URGENT, UPDATE, or ADVISORY), and content.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              category: { type: Type.STRING },
              content: { type: Type.STRING }
            },
            required: ["id", "title", "timestamp", "category", "content"]
          }
        }
      }
    });

    const text = response.text;
    return JSON.parse(text || "[]");
  } catch (error) {
    console.error("Error fetching AI alerts:", error);
    return [];
  }
};

export interface IndiaLocationData {
  name: string;
  state: string;
  district: string;
  pinCode: string;
  lat: string;
  lng: string;
  famousPlaces: string[];
  population: string;
  languages: string[];
  timeZone: string;
  weatherOverview: string;
  nearbyHospitals: string[];
  nearbyPoliceStations: string[];
  sources?: { title: string; uri: string }[];
}

export const getIndiaLocationDetails = async (location: string): Promise<IndiaLocationData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for and provide complete details for the location "${location}" in India. Include state, district, pin code, coordinates, famous places, population, official languages, time zone, current weather overview, and names of nearby hospitals and police stations. Return as a JSON object.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            state: { type: Type.STRING },
            district: { type: Type.STRING },
            pinCode: { type: Type.STRING },
            lat: { type: Type.STRING },
            lng: { type: Type.STRING },
            famousPlaces: { type: Type.ARRAY, items: { type: Type.STRING } },
            population: { type: Type.STRING },
            languages: { type: Type.ARRAY, items: { type: Type.STRING } },
            timeZone: { type: Type.STRING },
            weatherOverview: { type: Type.STRING },
            nearbyHospitals: { type: Type.ARRAY, items: { type: Type.STRING } },
            nearbyPoliceStations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "state", "district", "pinCode", "lat", "lng", "famousPlaces", "population", "languages", "timeZone", "weatherOverview", "nearbyHospitals", "nearbyPoliceStations"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}") as IndiaLocationData;
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    data.sources = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Source",
        uri: chunk.web.uri
      }));

    return data;
  } catch (error) {
    console.error("India location lookup failed:", error);
    throw error;
  }
};

export interface MapGroundingResult {
  text: string;
  links: { title: string; uri: string }[];
}

export const searchNearbyPlaces = async (query: string, lat: number, lng: number): Promise<MapGroundingResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const text = response.text || "No results found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const links = chunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        title: chunk.maps.title || "View on Maps",
        uri: chunk.maps.uri
      }));

    return { text, links };
  } catch (error) {
    console.error("Error with Maps grounding:", error);
    return { text: "Failed to search nearby places.", links: [] };
  }
};

export interface EmergencyServiceDetail {
  name: string;
  address: string;
  distance: string;
  contact: string;
  uri: string;
  type: 'Hospital' | 'Police' | 'Shelter';
}

export const getEmergencyServicesInIndia = async (location: string, type: string): Promise<MapGroundingResult> => {
  try {
    // We strictly search within India as requested
    const prompt = `Find the nearest ${type} in or around ${location}, India. For each place, list its name, full address, approximate distance from the search point, and contact number. Ensure the results are specifically for the Indian region.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const text = response.text || "No essential services found in this area.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const links = chunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        title: chunk.maps.title || "View Service",
        uri: chunk.maps.uri
      }));

    return { text, links };
  } catch (error) {
    console.error("India Emergency Service lookup failed:", error);
    return { text: "An error occurred while searching for services in India.", links: [] };
  }
};

export interface IncidentAnalysis {
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  safetySteps: string[];
  estimatedImpact: string;
}

export const analyzeIncidentImage = async (base64Image: string, mimeType: string): Promise<IncidentAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this disaster-related image. Determine severity, summary, safety steps, and impact estimate.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
            summary: { type: Type.STRING },
            safetySteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedImpact: { type: Type.STRING },
          },
          required: ['severity', 'summary', 'safetySteps', 'estimatedImpact']
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Image analysis failed:", error);
    throw error;
  }
};
