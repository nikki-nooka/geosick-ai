import React, { useState, useEffect, useRef } from 'react';
import { StethoscopeIcon, SendIcon, HazardIcon, MicrophoneIcon } from './icons';
import { analyzeSymptoms } from '../services/geminiService';
import type { SymptomAnalysisResult, ActivityLogItem } from '../types';
import { SymptomAnalysisReport } from './SymptomAnalysisReport';
import { SymptomReportSkeleton } from './SymptomReportSkeleton';
import { BackButton } from './BackButton';
import { useI18n } from './I18n';
import { supportedLanguages } from '../data/translations';

interface SymptomCheckerPageProps {
  onBack: () => void;
  onAnalysisComplete: (item: Omit<ActivityLogItem, 'id' | 'timestamp' | 'userPhone'>) => void;
}

// Manually defining SpeechRecognition for browsers that support it
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const SymptomCheckerPage: React.FC<SymptomCheckerPageProps> = ({ onBack, onAnalysisComplete }) => {
    const [symptoms, setSymptoms] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<SymptomAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { language: selectedLanguage, t } = useI18n();

    // Voice input state
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const isSpeechSupported = !!SpeechRecognitionAPI;
    

    // Setup speech recognition
    useEffect(() => {
        if (!isSpeechSupported) return;

        if (recognitionRef.current) {
            recognitionRef.current.onresult = null;
            recognitionRef.current.onend = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.stop();
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true; // Listen until manually stopped
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;

        recognition.onresult = (event: any) => {
            let fullTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
                fullTranscript += event.results[i][0].transcript;
            }
            setSymptoms(fullTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };
        
        recognition.onend = () => setIsListening(false);
        
        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onend = null;
                recognitionRef.current.stop();
            }
        };
    }, [isSpeechSupported, selectedLanguage]);

    const handleToggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setSymptoms(''); // Clear previous text before starting
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error("Could not start recognition:", e);
                setIsListening(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (symptoms.trim().length < 10) {
            setError(t('symptom_error_short_input'));
            return;
        }
        
        setStatus('loading');
        setError(null);
        setResult(null);

        try {
            const languageName = supportedLanguages.find(l => l.code === selectedLanguage)?.name || 'English';
            const analysisResult = await analyzeSymptoms(symptoms, languageName);
            setResult(analysisResult);
            setStatus('success');
            onAnalysisComplete({ type: 'symptom-checker', title: 'Symptom Check', data: analysisResult, language: selectedLanguage });
        } catch (err) {
            console.error(err);
            setError('Failed to get your symptom analysis. The AI model may be busy or the request was blocked. Please try again.');
            setStatus('error');
        }
    };
    
    const currentLanguageName = supportedLanguages.find(l => l.code === selectedLanguage)?.name || 'Language';

    return (
         <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center animate-fade-in bg-slate-50">
            <div className="w-full max-w-3xl mx-auto">
                <div className="mb-6">
                    <BackButton onClick={onBack}>{t('back')}</BackButton>
                </div>
                 <div className="flex items-center gap-3">
                    <StethoscopeIcon className="w-10 h-10 text-teal-500" />
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
                            {t('symptom_checker_title')}
                        </h1>
                    </div>
                </div>
            </div>
            
            <main className="w-full max-w-3xl mx-auto mt-8">
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mb-6 rounded-r-lg" role="alert">
                    <div className="flex items-center">
                        <HazardIcon className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0"/>
                        <div>
                            <p className="font-bold">{t('informational_purposes_only')}</p>
                            <p className="text-sm">{t('symptom_disclaimer_short')}</p>
                        </div>
                    </div>
                </div>

                {status !== 'success' && (
                     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80">
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="symptoms" className="block text-lg font-semibold text-slate-700">
                                {t('symptom_describe_label')}
                            </label>
                             <p className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                {t('language_label', { lang: currentLanguageName })}
                             </p>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 mb-4">{t('symptom_describe_detail')}</p>
                        <div className="relative">
                            <textarea
                                id="symptoms"
                                rows={6}
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition pr-12"
                                placeholder={isListening ? t('symptom_placeholder_listening') : t('symptom_placeholder_example')}
                                disabled={status === 'loading'}
                            />
                            {isSpeechSupported ? (
                                <button
                                    type="button"
                                    onClick={handleToggleListening}
                                    disabled={status === 'loading'}
                                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                                        isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-slate-500 hover:bg-slate-200'
                                    }`}
                                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                                >
                                    <MicrophoneIcon className="w-6 h-6" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="absolute top-3 right-3 p-2 text-slate-400 cursor-not-allowed"
                                    title="Voice input is not supported by your browser."
                                    disabled
                                >
                                    <MicrophoneIcon className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                         {error && status === 'idle' && <p className="text-sm text-red-600 mt-2">{error}</p>}
                        <button
                            type="submit"
                            disabled={status === 'loading' || symptoms.trim().length < 10}
                            className="w-full mt-4 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                        >
                            <SendIcon className="w-5 h-5 mr-2" />
                            {status === 'loading' ? t('symptom_analyzing_button') : t('symptom_analyze_button')}
                        </button>
                    </form>
                )}
                
                <div className="mt-8">
                     {status === 'loading' && <SymptomReportSkeleton />}
                     {status === 'error' && !result && (
                         <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md" role="alert">
                            <p className="font-bold">Analysis Error</p>
                            <p>{error}</p>
                        </div>
                     )}
                     {status === 'success' && result && (
                         <div>
                            <SymptomAnalysisReport result={result} language={selectedLanguage} />
                             <button
                                onClick={() => { setStatus('idle'); setSymptoms(''); setResult(null); }}
                                className="w-full mt-6 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200"
                            >
                                <StethoscopeIcon className="w-5 h-5 mr-2" />
                                {t('start_new_analysis')}
                            </button>
                         </div>
                     )}
                </div>

            </main>
         </div>
    );
};