
export type Page =
  | 'home'
  | 'welcome'
  | 'image-analysis'
  | 'prescription-analysis'
  | 'checkup'
  | 'mental-health'
  | 'symptom-checker'
  | 'about'
  | 'contact'
  | 'explore'
  | 'live-alerts'
  | 'health-briefing'
  | 'activity-history'
  | 'profile'
  | 'admin-dashboard'
  | 'water-log';

export interface User {
  id?: string;
  phone: string;
  name: string;
  email?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  place?: string | null;
  created_at?: string | null;
  last_login_at?: string | null;
  password?: string;
  isAdmin?: boolean;
}

export interface ActivityLogItem {
  id: string;
  timestamp: number;
  userPhone: string;
  type: 'image-analysis' | 'prescription-analysis' | 'mental-health' | 'symptom-checker' | 'login';
  title: string;
  data: any;
  language?: string;
}

export interface Hazard {
  hazard: string;
  description: string;
}

export interface Disease {
  name: string;
  cause: string;
  precautions: string[];
}

export interface AnalysisResult {
  hazards: Hazard[];
  diseases: Disease[];
  summary: string;
}

export interface LocationAnalysisResult extends AnalysisResult {
  locationName: string;
}

export interface Facility {
    name: string;
    type: 'Hospital' | 'Clinic' | 'Pharmacy';
    lat: number;
    lng: number;
    distance: string; // e.g., "1.2 km"
    url?: string; // Direct Google Maps URL
}

export type MapPoint = {
    lat: number;
    lng: number;
    name: string;
    kind: 'analysis_point' | 'facility';
    type?: Facility['type'];
};


export interface PrescriptionAnalysisResult {
    summary: string;
    medicines: {
        name: string;
        dosage: string;
    }[];
    precautions: string[];
    videos: {
        title: string;
        url: string;
    }[];
}

export interface RiskFactor {
    name: string;
    level: 'Low' | 'Moderate' | 'High' | 'Very High';
    description: string;
}

export interface HealthForecast {
    locationName: string;
    summary: string;
    riskFactors: RiskFactor[];
    recommendations: string[];
}

export interface MentalHealthResult {
    summary: string;
    potentialConcerns: {
        name: string;
        explanation: string;
    }[];
    copingStrategies: {
        title: string;
        description: string;
    }[];
    recommendation: string;
}

export interface SymptomAnalysisResult {
    summary: string;
    triageRecommendation: string;
    potentialConditions: {
        name: string;
        description: string;
    }[];
    nextSteps: string[];
    disclaimer: string;
    videos: {
        title: string;
        url: string;
    }[];
}

export interface BotCommandResponse {
  action: 'navigate' | 'speak';
  page?: Page;
  responseText: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

export type AlertCategory = 'disease' | 'air' | 'heat' | 'environmental' | 'other';

export interface AlertSource {
    uri: string;
    title: string;
}

export interface Alert {
    id: string;
    fetchedAt: number;
    title: string;
    location: string;
    country: string;
    locationDetails?: string;
    category: AlertCategory;
    detailedInfo: string;
    threatAnalysis: string;
    lat?: number;
    lng?: number;
    sources: AlertSource[];
    source: 'global' | 'local';
}

export interface DiseaseReport {
    name: string;
    summary: string;
    reportedCases: string;
    affectedDemographics: string;
    trend: 'Increasing' | 'Stable' | 'Decreasing' | 'Unknown';
}

export interface CityHealthSnapshot {
    cityName: string;
    country: string;
    lastUpdated: string;
    overallSummary: string;
    diseases: DiseaseReport[];
    dataDisclaimer: string;
    sources: AlertSource[];
}

export interface WaterLogEntry {
  id: string;
  timestamp: number;
  amount: number; // in ml
}

export interface WaterLogSettings {
  goal: number; // in ml
  notifications: {
    enabled: boolean;
    startTime: string; // "HH:mm" format
    endTime: string;   // "HH:mm" format
    frequency: number; // in minutes
  };
}

export interface FeedbackItem {
  id: string;
  timestamp: number;
  userPhone: string;
  rating: number; // 1-5
  comment: string;
}
