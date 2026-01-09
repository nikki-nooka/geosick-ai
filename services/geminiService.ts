
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { AnalysisResult, LocationAnalysisResult, Facility, PrescriptionAnalysisResult, HealthForecast, MentalHealthResult, SymptomAnalysisResult, Page, BotCommandResponse, Alert, AlertSource, CityHealthSnapshot, AlertCategory } from '../types';
import * as cache from './cacheService';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callGeminiWithRetry<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await apiCall();
        } catch (error: any) {
            const isRateLimitError = error.toString().includes('429') || error.toString().includes('RESOURCE_EXHAUSTED');
            if (isRateLimitError && attempt < maxRetries - 1) {
                const delay = initialDelay * Math.pow(2, attempt);
                await sleep(delay);
                attempt++;
            } else {
                throw error;
            }
        }
    }
    throw new Error('Exceeded maximum retries.');
}

/**
 * Enhanced recursive string extractor to prevent React Error #31.
 * Flattens objects like { area: "...", coordinates: { lat: 1, lng: 2 } } into simple strings.
 */
const safeString = (val: any, fallback: string = ''): string => {
    if (typeof val === 'string') return val;
    if (val === null || val === undefined) return fallback;
    
    if (typeof val === 'object') {
        // High-priority keys for labels
        const keys = ['name', 'label', 'cityName', 'locationName', 'area', 'address', 'fullAddress', 'description'];
        for (const key of keys) {
            if (val[key]) {
                const result = safeString(val[key]);
                if (result) return result;
            }
        }
        
        // If it's a coordinate object, don't use it as a label
        if (typeof val.lat === 'number' || typeof val.lng === 'number') return fallback;

        // Fallback to stringification for unknown structures
        try {
            return JSON.stringify(val);
        } catch {
            return fallback;
        }
    }
    return String(val);
};

const locationAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        locationName: { type: Type.STRING },
        hazards: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    hazard: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["hazard", "description"]
            }
        },
        diseases: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    cause: { type: Type.STRING },
                    precautions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["name", "cause", "precautions"]
            }
        },
        summary: { type: Type.STRING }
    },
    required: ["locationName", "hazards", "diseases", "summary"]
};

const geocodeSchema = {
    type: Type.OBJECT,
    properties: {
        lat: { type: Type.NUMBER },
        lng: { type: Type.NUMBER },
        foundLocationName: { type: Type.STRING }
    },
    required: ["lat", "lng", "foundLocationName"]
};

const cityHealthSnapshotSchema = {
    type: Type.OBJECT,
    properties: {
        cityName: { type: Type.STRING },
        country: { type: Type.STRING },
        lastUpdated: { type: Type.STRING },
        overallSummary: { type: Type.STRING },
        diseases: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    reportedCases: { type: Type.STRING },
                    affectedDemographics: { type: Type.STRING },
                    trend: { type: Type.STRING, enum: ['Increasing', 'Stable', 'Decreasing', 'Unknown'] }
                },
                required: ["name", "summary", "reportedCases", "affectedDemographics", "trend"]
            }
        },
        dataDisclaimer: { type: Type.STRING },
        sources: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    uri: { type: Type.STRING },
                    title: { type: Type.STRING }
                },
                required: ["uri", "title"]
            }
        }
    },
    required: ["cityName", "country", "lastUpdated", "overallSummary", "diseases", "dataDisclaimer", "sources"]
};

const mentalHealthSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING },
        potentialConcerns: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                },
                required: ["name", "explanation"]
            }
        },
        copingStrategies: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["title", "description"]
            }
        },
        recommendation: { type: Type.STRING }
    },
    required: ["summary", "potentialConcerns", "copingStrategies", "recommendation"]
};

const cleanJsonString = (str: string): string => {
    return str.replace(/```json\n?|```/g, '').trim();
};

export const analyzeLocationByCoordinates = async (lat: number, lng: number, language: string, knownLocationName?: string): Promise<{ analysis: LocationAnalysisResult, imageUrl: string | null }> => {
    const cacheKey = `loc_v5_${lat.toFixed(4)}_${lng.toFixed(4)}_${language}`;
    const cachedItem = cache.get<{ analysis: LocationAnalysisResult, imageUrl: string | null }>(cacheKey);
    if (cachedItem) return cachedItem;

    const contents = `Perform environmental health analysis for coordinates ${lat}, ${lng} (Context: ${safeString(knownLocationName)}). Return JSON.`;

    const [analysisResult, imageResult] = await Promise.allSettled([
        callGeminiWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: contents,
            config: { responseMimeType: "application/json", responseSchema: locationAnalysisSchema }
        })),
        callGeminiWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: `Synthetic satellite view of the biome at latitude ${lat}, longitude ${lng}. High detail.`,
        }))
    ]);

    if (analysisResult.status === 'rejected') throw new Error("Analysis failed");

    let analysis = JSON.parse(cleanJsonString(analysisResult.value.text || '{}'));
    analysis.locationName = safeString(analysis.locationName, knownLocationName || 'Selected Area');

    let imageUrl: string | null = null;
    if (imageResult.status === 'fulfilled') {
        for (const part of imageResult.value.candidates[0].content.parts) {
            if (part.inlineData) {
                imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                break;
            }
        }
    }
    
    const result = { analysis, imageUrl };
    cache.set(cacheKey, result, 30);
    return result;
};

export const analyzeImage = async (base64ImageData: string, language: string): Promise<AnalysisResult> => {
    const response = await callGeminiWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64ImageData } }, { text: "Perform hazard analysis. JSON." }] },
        config: { responseMimeType: "application/json", responseSchema: locationAnalysisSchema }
    }));
    return JSON.parse(cleanJsonString(response.text || '{}'));
};

export const findFacilitiesByCoordinates = async (coords: { lat: number; lng: number }): Promise<Omit<Facility, 'distance'>[]> => {
    const cacheKey = `hospitals_v6_real_${coords.lat.toFixed(4)}_${coords.lng.toFixed(4)}`;
    const cached = cache.get<Omit<Facility, 'distance'>[]>(cacheKey);
    if (cached) return cached;

    // Use broader "nearby" prompt to avoid strict 5km failures in rural areas
    const searchResponse = await callGeminiWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `I need a list of the 10 nearest verified medical facilities (Hospitals, Clinics, or Pharmacies) near GPS ${coords.lat}, ${coords.lng}. Use the Maps tool. For each, provide its official name, type, and exact coordinates.`,
        config: { 
            tools: [{ googleMaps: {} }],
            toolConfig: { retrievalConfig: { latLng: { latitude: coords.lat, longitude: coords.lng } } }
        }
    }));

    const groundingChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const structureResponse = await callGeminiWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Extract verified medical facilities into a JSON array. Use the provided grounding data: ${JSON.stringify(groundingChunks)}. Source: "${searchResponse.text}"`,
        config: { 
            responseMimeType: "application/json", 
            responseSchema: { 
                type: Type.ARRAY, 
                items: { 
                    type: Type.OBJECT, 
                    properties: { 
                        name: { type: Type.STRING }, 
                        type: { type: Type.STRING, enum: ['Hospital', 'Clinic', 'Pharmacy'] }, 
                        lat: { type: Type.NUMBER }, 
                        lng: { type: Type.NUMBER },
                        url: { type: Type.STRING }
                    }, 
                    required: ["name", "type", "lat", "lng"] 
                } 
            } 
        }
    }));

    const results = JSON.parse(cleanJsonString(structureResponse.text || '[]'));
    
    // Safety Pass to prevent Error #31
    const sanitizedResults = results.map((f: any) => ({
        ...f,
        name: safeString(f.name, 'Medical Center')
    }));

    cache.set(cacheKey, sanitizedResults, 60);
    return sanitizedResults;
};

export const analyzePrescription = async (base64ImageData: string, language: string): Promise<PrescriptionAnalysisResult> => {
    const response = await callGeminiWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64ImageData } }, { text: "Extract prescription details to JSON." }] },
        config: { responseMimeType: "application/json" }
    }));
    return JSON.parse(cleanJsonString(response.text || '{}'));
};

export const analyzeMentalHealth = async (answers: Record<string, string>, language: string): Promise<MentalHealthResult> => {
    const prompt = `Perform mental wellness reflection based on: ${JSON.stringify(answers)}. JSON.`;
    const response = await callGeminiWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: mentalHealthSchema }
    }));
    return JSON.parse(cleanJsonString(response.text || '{}'));
};

export const getBotCommand = async (prompt: string, language: string, availablePages: Page[]): Promise<BotCommandResponse> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            systemInstruction: `Assistant mode. Pages: [${availablePages.join(', ')}]. JSON only.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    action: { type: Type.STRING, enum: ["navigate", "speak"] },
                    page: { type: Type.STRING },
                    responseText: { type: Type.STRING }
                },
                required: ["action", "responseText"]
            }
        }
    });
    return JSON.parse(cleanJsonString(response.text || '{}'));
};

export const geocodeLocation = async (query: string): Promise<{ lat: number, lng: number, foundLocationName: string }> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Geocode "${query}". JSON.`,
        config: { responseMimeType: "application/json", responseSchema: geocodeSchema }
    });
    const parsed = JSON.parse(cleanJsonString(response.text || '{}'));
    return {
        lat: Number(parsed.lat) || 0,
        lng: Number(parsed.lng) || 0,
        foundLocationName: safeString(parsed.foundLocationName, query)
    };
};

export const getHealthForecast = async (coords: { lat: number; lng: number }, language: string): Promise<HealthForecast> => {
    const response = await callGeminiWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Health briefing for ${coords.lat}, ${coords.lng}. JSON.`,
        config: { responseMimeType: "application/json" }
    }));
    const parsed = JSON.parse(cleanJsonString(response.text || '{}'));
    parsed.locationName = safeString(parsed.locationName, 'Current Area');
    return parsed;
};

export const analyzeSymptoms = async (symptoms: string, language: string): Promise<SymptomAnalysisResult> => {
    const response = await callGeminiWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze symptoms: "${symptoms}". JSON.`,
        config: { responseMimeType: "application/json" }
    }));
    return JSON.parse(cleanJsonString(response.text || '{}'));
};

export const getLiveHealthAlerts = async (forceRefresh: boolean = false): Promise<Alert[]> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "8 global health alerts. Search Grounding.",
        config: { tools: [{ googleSearch: {} }] }
    });
    const structure = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Structure into JSON Alert array: ${response.text}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(structure.text || '[]'));
};

export const getLocalHealthAlerts = async (lat: number, lng: number, forceRefresh: boolean = false): Promise<Alert[]> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Local health alerts for GPS ${lat}, ${lng}. Search Grounding.`,
        config: { tools: [{ googleSearch: {} }] }
    });
    const structure = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Structure into JSON Alert array: ${response.text}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(structure.text || '[]'));
};

export const getCityHealthSnapshot = async (cityName: string, country: string, language: string): Promise<CityHealthSnapshot> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Health snapshot for ${cityName}, ${country}. Search Grounding.`,
        config: { tools: [{ googleSearch: {} }] }
    });
    const structure = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Structure into CityHealthSnapshot JSON. Source: "${response.text}". Ensure cityName is "${cityName}".`,
        config: { responseMimeType: "application/json", responseSchema: cityHealthSnapshotSchema }
    });
    const parsed = JSON.parse(cleanJsonString(structure.text || '{}'));
    parsed.cityName = safeString(parsed.cityName, cityName);
    return parsed;
};
