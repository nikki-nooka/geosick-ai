import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { ImageUploader } from './ImageUploader';
import { AnalysisReport } from './AnalysisReport';
import { ReportSkeleton } from './ReportSkeleton';
import { analyzeImage } from '../services/geminiService';
import type { AnalysisResult, ActivityLogItem } from '../types';
import { HeartPulseIcon, ScanIcon, CloseIcon } from './icons';
import { BackButton } from './BackButton';
import { useI18n } from './I18n';

interface ImageAnalysisPageProps {
  onBack: () => void;
  onScheduleCheckup: () => void;
  onAnalysisComplete: (item: Omit<ActivityLogItem, 'id' | 'timestamp' | 'userPhone'>) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const ImageAnalysisPage: React.FC<ImageAnalysisPageProps> = ({ onBack, onScheduleCheckup, onAnalysisComplete }) => {
  const { t, language } = useI18n();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  const handleAnalyze = async () => {
    if (!imageFile || !imagePreview) return;
    
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const imageData = await fileToBase64(imageFile);
      const result = await analyzeImage(imageData, language);
      setAnalysis(result);
      onAnalysisComplete({ type: 'image-analysis', title: 'Environmental Image Analysis', data: result, language });
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Model busy.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
      setImageFile(null);
      setAnalysis(null);
      setError(null);
  }

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col animate-fade-in">
        <div className="w-full max-w-7xl mx-auto self-start mb-6">
            <BackButton onClick={onBack}>{t('back')}</BackButton>
        </div>

        <Header />

        <main className="w-full max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="animate-fade-in-up">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80 h-full flex flex-col">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">{t('upload_area_scan')}</h2>
                    <div className="flex-grow aspect-video relative">
                        {imagePreview ? (
                            <div className="w-full h-full">
                                <img src={imagePreview} alt="Selected preview" className="w-full h-full object-contain rounded-md" />
                                {!isLoading && (
                                     <button onClick={clearImage} className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors">
                                        <CloseIcon className="w-5 h-5" />
                                     </button>
                                )}
                            </div>
                        ) : (
                            <ImageUploader onFileSelect={setImageFile} disabled={isLoading} />
                        )}
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={!imageFile || isLoading}
                        className="w-full mt-6 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200"
                    >
                        <ScanIcon className="w-5 h-5 mr-2" />
                        {isLoading ? '...' : t('analyze_image')}
                    </button>
                </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                {isLoading ? (
                    <ReportSkeleton />
                ) : analysis ? (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200/80">
                         <div className="flex justify-between items-center p-4 border-b border-slate-200/80">
                           <h2 className="text-xl font-bold text-slate-800">{t('analysis_report')}</h2>
                            <button
                                onClick={onScheduleCheckup}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-all transform hover:scale-105"
                            >
                                <HeartPulseIcon className="w-5 h-5 mr-2" />
                                {t('schedule_checkup_cta')}
                            </button>
                        </div>
                        <div className="p-6">
                            <AnalysisReport result={analysis} imageUrl={imagePreview} />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80 h-full flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <ScanIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{t('awaiting_analysis')}</h2>
                    </div>
                )}
            </div>
        </main>
    </div>
  );
};
