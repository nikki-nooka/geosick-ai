
import React, { useState, useEffect } from 'react';
import { getHealthForecast } from '../services/geminiService';
import type { HealthForecast as HealthForecastData, RiskFactor } from '../types';
import { HealthForecastSkeleton } from './HealthForecastSkeleton';
import { NewspaperIcon, PrecautionIcon, HazardIcon, SunIcon, WindIcon, SummaryIcon } from './icons';
import { BackButton } from './BackButton';
import { useI18n } from './I18n';

interface HealthForecastProps {
    onBack: () => void;
}

type Status = 'idle' | 'locating' | 'fetching' | 'success' | 'error';

const RiskLevelBadge: React.FC<{ level: RiskFactor['level'] }> = ({ level }) => {
    const levelStyles = {
        'Low': { color: 'bg-green-500', text: 'Low' },
        'Moderate': { color: 'bg-yellow-500', text: 'Moderate' },
        'High': { color: 'bg-orange-500', text: 'High' },
        'Very High': { color: 'bg-red-600', text: 'Very High' },
    };
    const style = (levelStyles[level as keyof typeof levelStyles]) || levelStyles['Low'];
    return (
        <span className={`px-2.5 py-1 text-xs font-bold text-white rounded-full ${style.color}`}>
            {style.text}
        </span>
    );
};

const RiskFactorIcon: React.FC<{ name: string }> = ({ name }) => {
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName.includes('air quality')) {
        return <WindIcon className="w-6 h-6 text-slate-500" />;
    }
    if (lowerCaseName.includes('uv index')) {
        return <SunIcon className="w-6 h-6 text-orange-500" />;
    }
    if (lowerCaseName.includes('mosquito') || lowerCaseName.includes('respiratory')) {
        return <HazardIcon className="w-6 h-6 text-red-500" />;
    }
    return <HazardIcon className="w-6 h-6 text-gray-500" />;
};


export const HealthForecast: React.FC<HealthForecastProps> = ({ onBack }) => {
    const [status, setStatus] = useState<Status>('idle');
    const [forecast, setForecast] = useState<HealthForecastData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { language } = useI18n();

    const fetchForecast = () => {
        setStatus('locating');
        setError(null);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                setStatus('fetching');
                const { latitude, longitude } = position.coords;
                try {
                    const result = await getHealthForecast({ lat: latitude, lng: longitude }, language);
                    setForecast(result);
                    setStatus('success');
                } catch (err) {
                    console.error(err);
                    setError("Failed to generate your health briefing. The AI model might be busy. Please try again later.");
                    setStatus('error');
                }
            },
            (geoError) => {
                console.error("Geolocation error:", geoError.message);
                let errorMessage = "An unknown error occurred while trying to get your location.";
                switch (geoError.code) {
                    case 1: // PERMISSION_DENIED
                        errorMessage = "Location access was denied. Please check your browser and system settings. Ad-blockers or privacy extensions can also interfere with this feature.";
                        break;
                    case 2: // POSITION_UNAVAILABLE
                        errorMessage = "Location information is unavailable. This may be due to a poor network connection or being indoors. Please try again.";
                        break;
                    case 3: // TIMEOUT
                        errorMessage = "The request to get your location timed out. Please check your connection and try again.";
                        break;
                }
                setError(errorMessage);
                setStatus('error');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    useEffect(() => {
        fetchForecast();
    }, [language]);

    if (status === 'locating' || status === 'fetching') {
        return (
             <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <HealthForecastSkeleton status={status} />
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl text-center bg-white p-8 rounded-lg shadow-lg animate-fade-in">
                    <h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2>
                    <p className="text-slate-600 mt-2">{error}</p>
                    <div className="mt-6 flex gap-4 justify-center">
                        <button onClick={onBack} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded-lg">Back</button>
                        <button onClick={fetchForecast} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">Try Again</button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (status === 'success' && forecast) {
        // Defensive checks
        const riskFactors = Array.isArray(forecast.riskFactors) ? forecast.riskFactors : [];
        const recommendations = Array.isArray(forecast.recommendations) ? forecast.recommendations : [];

        return (
            <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in bg-slate-100/50">
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200/80">
                     <div className="p-4 sm:p-6">
                        <BackButton onClick={onBack} />
                    </div>
                    {/* Header */}
                    <div className="px-6 pb-6 flex items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <NewspaperIcon className="w-7 h-7 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Your Daily Health Briefing</h1>
                                <p className="text-slate-500">{forecast.locationName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 pb-6 space-y-6">
                        {/* Overall Outlook */}
                        <div className="bg-blue-50 border border-blue-200/80 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <SummaryIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-blue-800 text-sm">{forecast.summary}</p>
                            </div>
                        </div>

                        {/* Key Risk Factors */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 mb-3">Today's Key Risk Factors</h2>
                            <div className="space-y-3">
                                {riskFactors.length > 0 ? riskFactors.map(factor => (
                                    <div key={factor.name} className="flex items-start gap-4 p-4 bg-slate-50/70 rounded-lg border border-slate-200/80">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mt-1">
                                            <RiskFactorIcon name={factor.name} />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-semibold text-slate-700">{factor.name}</p>
                                                <RiskLevelBadge level={factor.level} />
                                            </div>
                                            <p className="text-sm text-slate-500">{factor.description}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-slate-500 italic">No specific risk factors identified for today.</p>}
                            </div>
                        </div>

                        {/* Recommended Actions */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                               <PrecautionIcon className="w-6 h-6 text-green-600"/> Recommended Actions
                            </h2>
                            <ul className="space-y-2 pl-2 text-sm text-slate-700">
                                 {recommendations.length > 0 ? recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-2.5">
                                       <span className="text-green-500 mt-1">&#10003;</span> 
                                       <span>{rec}</span>
                                    </li>
                                 )) : <li className="text-sm text-slate-500 italic">No specific recommendations provided. Stay healthy!</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null;
}
