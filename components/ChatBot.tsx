import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { getBotCommand } from '../services/geminiService';
import type { ChatMessage, Page } from '../types';
import { BotIcon, SendIcon, CloseIcon, ChevronDownIcon, MicrophoneIcon, SpeakerWaveIcon, SpeakerXMarkIcon, SparklesIcon } from './icons';
import { useI18n } from './I18n';
import { supportedLanguages } from '../data/translations';
import { LanguageSelector } from './LanguageSelector';

interface ChatBotProps {
    onNavigate: (page: Page) => void;
}

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

export const ChatBot: React.FC<ChatBotProps> = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { language: selectedLanguage, t } = useI18n();
    
    const [isListening, setIsListening] = useState(false);
    const [isBotSpeaking, setIsBotSpeaking] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const isSpeechSupported = !!SpeechRecognitionAPI;

    const [isMuted, setIsMuted] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
    const [isVoiceAvailable, setIsVoiceAvailable] = useState(true);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { id: 'initial', role: 'bot', text: t('chatbot_welcome') }
            ]);
        }
    }, [isOpen, messages, t]);
    
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length === 0) {
                setIsVoiceAvailable(false);
                return;
            }

            const langPrefix = selectedLanguage.split('-')[0];
            const filteredVoices = availableVoices.filter(v => v.lang.startsWith(langPrefix));
            setVoices(filteredVoices);

            if (filteredVoices.length > 0) {
                const defaultVoice = filteredVoices.find(v => v.name.includes('Google')) || filteredVoices.find(v => v.default) || filteredVoices[0];
                setSelectedVoiceURI(defaultVoice.voiceURI);
                setIsVoiceAvailable(true);
            } else {
                setSelectedVoiceURI(null);
                setIsVoiceAvailable(false);
            }
        };

        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices(); 

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
            window.speechSynthesis.cancel();
        };
    }, [selectedLanguage]);

    const speak = (text: string) => {
        if (isMuted || !isVoiceAvailable || !('speechSynthesis' in window) || !text) return;
        window.speechSynthesis.cancel();
        
        const cleanedText = text.replace(/[*#_`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        
        const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.lang = selectedLanguage;
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onstart = () => setIsBotSpeaking(true);
        utterance.onend = () => setIsBotSpeaking(false);
        utterance.onerror = () => setIsBotSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stopEverything = () => {
        // Stop listening
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
        }
        // Stop speaking
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsBotSpeaking(false);
        }
    };

    useEffect(() => {
        if (!isSpeechSupported) return;

        if (recognitionRef.current) {
            recognitionRef.current.onresult = null;
            recognitionRef.current.onend = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.stop();
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true; 
        recognition.lang = selectedLanguage;

        recognition.onresult = (event: any) => {
            let fullTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
                fullTranscript += event.results[i][0].transcript;
            }
            setInput(fullTranscript);
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

    useLayoutEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        const textToSend = input.trim();
        if (textToSend === '' || isLoading) return;
        
        stopEverything();

        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const botMessageId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: botMessageId, role: 'bot', text: 'Analyzing your request...' }]);

        try {
            const availablePages: Page[] = ['welcome', 'image-analysis', 'prescription-analysis', 'mental-health', 'symptom-checker', 'activity-history', 'profile', 'about', 'contact', 'explore', 'water-log'];
            const languageName = supportedLanguages.find(l => l.code === selectedLanguage)?.name || 'English';
            
            const commandResponse = await getBotCommand(textToSend, languageName, availablePages);
            
            setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: commandResponse.responseText } : msg));
            speak(commandResponse.responseText);
            
            if (commandResponse.action === 'navigate' && commandResponse.page) {
                // Verification delay to allow user to see/hear the acknowledgment
                setTimeout(() => {
                    onNavigate(commandResponse.page!);
                    setIsOpen(false);
                }, 2500);
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorText = t('chatbot_error');
            setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: errorText } : msg));
            speak(errorText);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            if (isBotSpeaking) stopEverything();
            setInput('');
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error("Could not start recognition:", e);
                setIsListening(false);
            }
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-110 z-50 flex items-center justify-center group"
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <CloseIcon className="w-7 h-7"/> : (
                    <div className="relative">
                        <SparklesIcon className="w-7 h-7" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></div>
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[90vw] max-w-sm h-[70vh] max-h-[550px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col z-40 animate-fade-in-up overflow-hidden">
                    <header className="p-4 flex justify-between items-center bg-slate-50 border-b border-slate-200">
                         <div className="w-32">
                            <LanguageSelector variant="chatbot" />
                         </div>
                         <div className="flex items-center gap-2">
                            {(isListening || isBotSpeaking) && (
                                <button 
                                    onClick={stopEverything}
                                    className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-full border border-red-200 hover:bg-red-100 transition-all flex items-center gap-1"
                                >
                                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                    Stop
                                </button>
                            )}
                            <button 
                                onClick={() => setIsMuted(!isMuted)} 
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white transition-all disabled:text-slate-300"
                                aria-label={isMuted ? t('unmute') : t('mute')}
                                disabled={!isVoiceAvailable}
                            >
                                {isMuted || !isVoiceAvailable ? <SpeakerXMarkIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white transition-all">
                                <ChevronDownIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30 scroll-smooth">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'bot' && (
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <BotIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] p-3.5 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' : 'bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-100'}`}>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && messages[messages.length - 1]?.role !== 'bot' && (
                             <div className="flex items-start gap-2.5 justify-start">
                                 <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1 animate-pulse">
                                    <BotIcon className="w-5 h-5 text-blue-400" />
                                 </div>
                                 <div className="max-w-[85%] p-3.5 bg-white text-slate-400 rounded-2xl rounded-tl-none border border-slate-100 italic text-sm animate-pulse">
                                    Analyzing request...
                                 </div>
                             </div>
                         )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-slate-100">
                        <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={isListening ? "Listening closely..." : "Ask me anything..."}
                                className="flex-1 bg-transparent py-3 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                disabled={isLoading}
                            />
                            <div className="flex items-center gap-1 pr-2">
                                {isSpeechSupported && (
                                    <button
                                        onClick={handleToggleListening}
                                        disabled={isLoading}
                                        className={`p-2 rounded-lg transition-all ${
                                            isListening ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'
                                        }`}
                                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                                    >
                                        <MicrophoneIcon className="w-5 h-5" />
                                    </button>
                                )}
                                <button 
                                    onClick={handleSend} 
                                    disabled={isLoading || !input.trim()} 
                                    className="p-2 text-blue-600 disabled:text-slate-300 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                    <SendIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};