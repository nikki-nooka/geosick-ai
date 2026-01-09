import React from 'react';
import { GlobeIcon, ScanIcon, StethoscopeIcon, BrainCircuitIcon, SparklesIcon } from './icons';
import { BackButton } from './BackButton';

interface AboutPageProps {
  onBack: () => void;
}

// Fixed: Made children optional in the prop type definition to resolve errors where TypeScript incorrectly identifies it as missing even when provided via JSX nested content
const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children?: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
        <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">{icon}</div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-slate-600 text-sm">{children}</p>
    </div>
);

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="w-full min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="w-full max-w-5xl mx-auto py-4 flex justify-start items-center">
            <BackButton onClick={onBack} />
        </header>
        
        <main className="flex-grow flex flex-col items-center px-4 py-8">
            <div className="w-full max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center gap-4 mb-4 animate-fade-in-up">
                    <SparklesIcon className="w-12 h-12 text-blue-500" />
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
                        About GeoSick
                    </h1>
                </div>
                <p className="max-w-3xl mx-auto text-lg text-slate-600 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    Translating complex environmental data into clear, actionable health intelligence to empower communities and preempt public health threats.
                </p>
                
                <div className="text-left space-y-12 mt-16">
                    {/* Mission & Vision */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200/60 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-3">
                               <GlobeIcon className="w-8 h-8 text-blue-500" />
                               Our Mission
                            </h2>
                            <p className="text-slate-600">
                                To democratize environmental health intelligence. We provide predictive, location-specific insights to help public health agencies and communities transition from reactive treatment to proactive prevention.
                            </p>
                        </div>
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200/60 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-3">
                               <SparklesIcon className="w-8 h-8 text-purple-500" />
                               Our Vision
                            </h2>
                            <p className="text-slate-600">
                                We envision a world where every community is equipped with the foresight to mitigate health crises before they begin, creating a healthier, more resilient future for everyone on the planet.
                            </p>
                        </div>
                    </div>
                    
                    {/* Core Features */}
                     <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Core Features</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <FeatureCard icon={<GlobeIcon className="w-6 h-6 text-blue-500" />} title="Globe Explorer">
                                Analyze any point on Earth to uncover environmental hazards and potential disease risks in real-time.
                           </FeatureCard>
                           <FeatureCard icon={<ScanIcon className="w-6 h-6 text-green-500" />} title="Area Scan">
                                Upload an image of your surroundings for an instant AI-driven report on visible health threats.
                           </FeatureCard>
                           <FeatureCard icon={<StethoscopeIcon className="w-6 h-6 text-teal-500" />} title="Symptom Checker">
                                Describe your symptoms to receive a cautious, AI-generated analysis of potential conditions.
                           </FeatureCard>
                           <FeatureCard icon={<BrainCircuitIcon className="w-6 h-6 text-indigo-500" />} title="Mind Check">
                                A confidential questionnaire to receive a supportive reflection on your mental well-being.
                           </FeatureCard>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        
        <footer className="w-full text-center p-8 text-slate-500 text-sm">
            GeoSick &copy; {new Date().getFullYear()} - Intelligence for a Healthier Planet.
        </footer>
    </div>
  );
};