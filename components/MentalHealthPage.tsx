import React, { useState, useEffect, useMemo } from 'react';
import { BrainCircuitIcon, SendIcon } from './icons';
import { analyzeMentalHealth } from '../services/geminiService';
import type { MentalHealthResult, ActivityLogItem } from '../types';
import { MentalHealthReport } from './MentalHealthReport';
import { LoadingSpinner } from './LoadingSpinner';
import { BackButton } from './BackButton';
import { useI18n } from './I18n';

interface MentalHealthPageProps {
  onBack: () => void;
  onAnalysisComplete: (item: Omit<ActivityLogItem, 'id' | 'timestamp' | 'userPhone'>) => void;
}

const QUESTION_BANK = [
    { id: 'q1', text: "What do you usually do when you're feeling mentally drained?", options: ["Push through and keep working", "Take a short break", "Disconnect from screens", "Do something creative or relaxing"] },
    { id: 'q2', text: "Which of these best describes your thoughts most days?", options: ["Mostly negative or self-critical", "Neutral, just going through the motions", "Positive but with occasional doubts", "Optimistic and self-encouraging"] },
    { id: 'q3', text: "When was the last time you did something just for fun?", options: ["I can’t remember", "More than a week ago", "A few days ago", "Today or yesterday"] },
    { id: 'q4', text: "How do you handle mistakes or failures?", options: ["I beat myself up over them", "I avoid thinking about them", "I reflect and try to learn from them", "I accept them as part of growth"] },
    { id: 'q5', text: "What is your current energy level most of the time?", options: ["Completely exhausted", "Low and sluggish", "Manageable but not great", "Energized and motivated"] },
    { id: 'q6', text: "How often do you check in with your emotions or mood?", options: ["Rarely", "Occasionally", "Most days", "Daily and intentionally"] },
    { id: 'q7', text: "What’s your relationship with social media like?", options: ["It increases my stress or anxiety", "I scroll mindlessly out of habit", "I try to use it in moderation", "I use it intentionally or rarely"] },
    { id: 'q8', text: "Which of the following do you do regularly to support your mental health?", options: ["Nothing in particular", "Exercise or movement", "Journaling or mindfulness", "Talking to someone or seeking help"] },
    { id: 'q9', text: "When do you usually notice signs of burnout or emotional fatigue?", options: ["When it’s already too late", "After feeling off for a while", "As soon as my routine feels overwhelming", "I check in regularly and make adjustments"] },
    { id: 'q10', text: "What kind of support system do you have?", options: ["I feel like I have no one to talk to", "I have a few people but don’t reach out often", "I have people I can rely on when needed", "I have strong, regular support from others"] },
];

const NUM_QUESTIONS_TO_ASK = 6;

type Answers = Record<string, string>;
type Status = 'intro' | 'answering' | 'submitting' | 'loading' | 'success' | 'error';

export const MentalHealthPage: React.FC<MentalHealthPageProps> = ({ onBack, onAnalysisComplete }) => {
    const [answers, setAnswers] = useState<Answers>({});
    const [status, setStatus] = useState<Status>('intro');
    const [result, setResult] = useState<MentalHealthResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const { language, t } = useI18n();
    
    const loadingMessages = [
        t('chatbot_analyzing'),
        "Gathering helpful thoughts...",
        "Analyzing patterns with care...",
        "Just a moment more...",
    ];
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);
    
    const questions = useMemo(() => {
        return [...QUESTION_BANK].sort(() => 0.5 - Math.random()).slice(0, NUM_QUESTIONS_TO_ASK);
    }, []);
    
    useEffect(() => {
        if (status === 'loading') {
            const interval = setInterval(() => {
                setCurrentLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    return loadingMessages[(currentIndex + 1) % loadingMessages.length];
                });
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [status, loadingMessages]);

    const handleAnswerSelect = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setStatus('submitting');
        }
    };

    const handleSubmit = async () => {
        setStatus('loading');
        setError(null);
        setResult(null);

        const fullQuestionsAnswers: Record<string, string> = {};
        questions.forEach(q => {
            if (answers[q.id]) {
                fullQuestionsAnswers[q.text] = answers[q.id];
            }
        });

        try {
            const analysisResult = await analyzeMentalHealth(fullQuestionsAnswers, language);
            setResult(analysisResult);
            setStatus('success');
            onAnalysisComplete({ type: 'mental-health', title: 'Mental Wellness Check-in', data: analysisResult, language });
        } catch (err) {
            console.error(err);
            setError(t('chatbot_error'));
            setStatus('error');
        }
    };

    const progress = status === 'answering' || status === 'submitting' 
        ? ((currentQuestionIndex + 1) / questions.length) * 100
        : 0;
        
    const currentQuestion = questions[currentQuestionIndex];
    
    const renderContent = () => {
        switch (status) {
            case 'intro':
                return (
                    <div className="text-center bg-white p-8 sm:p-12 rounded-lg shadow-lg animate-fade-in-up">
                        <BrainCircuitIcon className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{t('mind_check_intro_title')}</h2>
                        <p className="mt-3 text-slate-600 max-w-prose mx-auto">{t('mind_check_intro_desc')}</p>
                        <button onClick={() => setStatus('answering')} className="mt-8 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                            {t('begin_checkin')}
                        </button>
                    </div>
                );
            case 'answering':
            case 'submitting':
                return (
                     <div className="bg-white w-full p-6 sm:p-8 rounded-lg shadow-lg animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-1.5 bg-indigo-200 w-full">
                            <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-sm font-semibold text-indigo-500">{t('question_label', { current: (currentQuestionIndex + 1).toString(), total: questions.length.toString() })}</p>
                            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mt-2 min-h-[6rem] flex items-center justify-center">{currentQuestion.text}</h3>
                        </div>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {currentQuestion.options.map(opt => (
                                <button key={opt} onClick={() => handleAnswerSelect(currentQuestion.id, opt)} className="text-left font-medium p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 bg-slate-50 border-slate-200">
                                    {opt}
                                </button>
                             ))}
                        </div>
                        {status === 'submitting' && (
                            <div className="mt-8 pt-6 border-t border-slate-200 text-center animate-fade-in">
                                <h3 className="text-xl font-bold text-slate-800">{t('checkin_complete')}</h3>
                                <button onClick={handleSubmit} className="w-full sm:w-auto mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full flex items-center justify-center transition-all duration-200 mx-auto">
                                    <SendIcon className="w-5 h-5 mr-2" />
                                    {t('get_reflection')}
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 'loading':
                return (
                    <div className="text-center bg-white p-8 sm:p-12 rounded-lg shadow-lg animate-fade-in-up">
                        <LoadingSpinner />
                        <p className="mt-4 font-semibold text-slate-700 animate-fade-in">{currentLoadingMessage}</p>
                    </div>
                );
            case 'success':
                 return result ? <MentalHealthReport result={result} /> : null;
            case 'error':
                 return (
                     <div className="mt-6 bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                        <button onClick={() => { setStatus('intro'); setCurrentQuestionIndex(0); setAnswers({}); }} className="mt-3 font-semibold hover:underline">Start Over</button>
                    </div>
                 );
            default:
                return null;
        }
    }

    return (
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center animate-fade-in bg-indigo-50">
            <div className="w-full max-w-2xl mx-auto relative z-10">
                <div className="mb-6"><BackButton onClick={onBack} /></div>
                <div className="flex items-center gap-3 justify-center text-center">
                    <BrainCircuitIcon className="w-8 h-8 text-indigo-500" />
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{t('mind_check_header')}</h1>
                </div>
            </div>
            <main className="w-full max-w-2xl mx-auto mt-8 flex-grow flex items-center justify-center">{renderContent()}</main>
        </div>
    );
};
