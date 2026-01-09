
import React, { useState, useEffect } from 'react';
import type { SymptomAnalysisResult } from '../types';
import { SummaryIcon, HazardIcon, ShieldCheckIcon, DiseaseIcon, SpeakerWaveIcon, SpeakerXMarkIcon, LinkIcon } from './icons';

interface SymptomAnalysisReportProps {
  result: SymptomAnalysisResult;
  language: string;
}

const TriageIndicator: React.FC<{ recommendation: string }> = ({ recommendation }) => {
    const lowerRec = (recommendation || '').toLowerCase();
    let bgColor = 'bg-green-50';
    let borderColor = 'border-green-400';
    let textColor = 'text-green-800';
    let iconColor = 'text-green-500';

    if (lowerRec.includes('consult')) {
        bgColor = 'bg-yellow-50';
        borderColor = 'border-yellow-400';
        textColor = 'text-yellow-800';
        iconColor = 'text-yellow-500';
    } else if (lowerRec.includes('attention') || lowerRec.includes('urgent') || lowerRec.includes('emergency')) {
        bgColor = 'bg-red-50';
        borderColor = 'border-red-400';
        textColor = 'text-red-800';
        iconColor = 'text-red-500';
    }

    return (
        <div className={`${bgColor} border-l-4 ${borderColor} ${textColor} p-4 rounded-r-lg`} role="alert">
            <div className="flex">
                <div className="py-1"><HazardIcon className={`w-6 h-6 ${iconColor} mr-3`} /></div>
                <div>
                    <p className="font-bold">Triage Recommendation</p>
                    <p className="text-sm">{recommendation || 'No recommendation provided.'}</p>
                </div>
            </div>
        </div>
    );
};

export const SymptomAnalysisReport: React.FC<SymptomAnalysisReportProps> = ({ result, language }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(true);

  // CRITICAL FIX: Ensure these are always arrays to prevent ".map of undefined" crash
  const potentialConditions = result?.potentialConditions || [];
  const nextSteps = result?.nextSteps || [];
  const videos = result?.videos || [];

  const getReportAsText = () => {
    return [
      `Triage Recommendation: ${result.triageRecommendation || ''}`,
      `Symptom Summary: ${result.summary || ''}`,
      `Potential Conditions for Discussion: ${potentialConditions.map(c => `${c.name || ''}. ${c.description || ''}`).join('. ')}`,
      `Recommended Next Steps: ${nextSteps.join('. ')}`,
      `Disclaimer: ${result.disclaimer || ''}`
    ].join('\n\n');
  };

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length === 0) {
        return; // Voices might still be loading.
      }
      const langPrefix = language.split('-')[0];
      const filteredVoices = availableVoices.filter(v => v.lang.startsWith(langPrefix));
      setVoices(filteredVoices);
      setIsVoiceAvailable(filteredVoices.length > 0);
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [language]);

  const speak = (text: string) => {
    if (!isVoiceAvailable || !('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const selectedVoice = voices.find(v => v.name.includes('Google')) || voices.find(v => v.default) || voices[0];
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.lang = language;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };
  
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(getReportAsText());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 animate-fade-in">
        <div className="p-4 sm:p-6 border-b border-slate-200/80 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Analysis Report</h2>
            <button
                onClick={handleToggleSpeak}
                disabled={!isVoiceAvailable}
                className="p-2 rounded-full transition-colors text-slate-500 hover:bg-slate-200 disabled:text-slate-300 disabled:cursor-not-allowed"
                title={!isVoiceAvailable ? "Voice output is not available for this language on your device" : (isSpeaking ? "Stop speaking" : "Read report aloud")}
                aria-label={isSpeaking ? "Stop speaking" : "Read report aloud"}
            >
                {isSpeaking ? <SpeakerXMarkIcon className="w-6 h-6 text-red-500" /> : <SpeakerWaveIcon className="w-6 h-6" />}
            </button>
        </div>
        <div className="p-4 sm:p-6 space-y-6">
            <TriageIndicator recommendation={result.triageRecommendation} />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <SummaryIcon className="w-6 h-6 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-base text-blue-800">Symptom Summary</h3>
                        <p className="mt-1 text-sm text-blue-700">{result.summary || 'No summary available.'}</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <DiseaseIcon className="w-6 h-6 text-slate-600"/>
                    Potential Conditions for Discussion
                </h3>
                <div className="space-y-3">
                    {potentialConditions.length > 0 ? (
                        potentialConditions.map((condition, index) => (
                            <div key={index} className="bg-slate-50 p-3 rounded-md border-l-4 border-slate-400">
                               <p className="font-semibold text-sm text-slate-800">{condition.name || 'Unnamed Condition'}</p>
                               <p className="text-sm text-slate-600 mt-1">{condition.description || 'No description available.'}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500">Based on your symptoms, no specific common conditions were highlighted. It's still best to consult a doctor.</p>
                    )}
                </div>
            </div>

            {/* Advanced Feature: Video Recommendations */}
            {videos.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg>
                        Recommended Educational Videos
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {videos.map((video, idx) => (
                            <a 
                                key={idx} 
                                href={video.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-white hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{video.title}</p>
                                    <p className="text-xs text-blue-500 font-medium">Watch on YouTube &rarr;</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <ShieldCheckIcon className="w-6 h-6 text-green-500"/>
                    Recommended Next Steps
                </h3>
                <ul className="space-y-2 pl-2 text-sm text-slate-700">
                    {nextSteps.length > 0 ? (
                        nextSteps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2.5">
                               <span className="text-green-500 mt-1">&#10003;</span> 
                               <span>{step}</span>
                            </li>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500">No specific next steps provided. Please consult with a healthcare professional.</p>
                    )}
                </ul>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4" role="alert">
                <div className="flex">
                    <div className="py-1"><HazardIcon className="w-6 h-6 text-red-500 mr-3"/></div>
                    <div>
                        <p className="font-bold">Important Disclaimer</p>
                        <p className="text-sm">{result.disclaimer || 'This analysis is for informational purposes only and is not a medical diagnosis.'}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
