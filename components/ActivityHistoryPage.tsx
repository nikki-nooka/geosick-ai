

import React, { useState } from 'react';
import type { ActivityLogItem, AnalysisResult, PrescriptionAnalysisResult, MentalHealthResult, SymptomAnalysisResult } from '../types';
import { HistoryIcon, ScanIcon, ClipboardListIcon, BrainCircuitIcon, StethoscopeIcon, CloseIcon } from './icons';
import { AnalysisReport } from './AnalysisReport';
import { PrescriptionReport } from './PrescriptionReport';
import { MentalHealthReport } from './MentalHealthReport';
import { SymptomAnalysisReport } from './SymptomAnalysisReport';
import { BackButton } from './BackButton';

interface ActivityHistoryPageProps {
  history: ActivityLogItem[];
  onBack: () => void;
}

const ReportModal: React.FC<{ item: ActivityLogItem, onClose: () => void }> = ({ item, onClose }) => {
    const renderReport = () => {
        switch(item.type) {
            case 'image-analysis':
                return <AnalysisReport result={item.data as AnalysisResult} imageUrl={null} />;
            case 'prescription-analysis':
                // Note: The original image isn't saved, so we pass an empty string or placeholder.
                // The report component is designed to handle this.
                return <PrescriptionReport result={item.data as PrescriptionAnalysisResult} imageUrl="" />;
            case 'mental-health':
                return <MentalHealthReport result={item.data as MentalHealthResult} />;
            case 'symptom-checker':
                // FIX: Pass the language prop to SymptomAnalysisReport, with a fallback for older items.
                return <SymptomAnalysisReport result={item.data as SymptomAnalysisResult} language={item.language || 'en-US'} />;
            default:
                return <p>Report type not recognized.</p>;
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
                <header className="p-4 flex justify-between items-center border-b border-slate-200">
                     <h2 className="text-lg font-bold text-slate-800">{item.title}</h2>
                     <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 flex-shrink-0">
                        <CloseIcon className="w-6 h-6 text-slate-600" />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto">
                    {renderReport()}
                </div>
            </div>
        </div>
    );
};


const ActivityIcon: React.FC<{ type: ActivityLogItem['type'] }> = ({ type }) => {
    switch (type) {
        case 'image-analysis': return <ScanIcon className="w-6 h-6 text-blue-500" />;
        case 'prescription-analysis': return <ClipboardListIcon className="w-6 h-6 text-green-500" />;
        case 'mental-health': return <BrainCircuitIcon className="w-6 h-6 text-indigo-500" />;
        case 'symptom-checker': return <StethoscopeIcon className="w-6 h-6 text-teal-500" />;
        default: return <HistoryIcon className="w-6 h-6 text-slate-500" />;
    }
};

export const ActivityHistoryPage: React.FC<ActivityHistoryPageProps> = ({ history, onBack }) => {
    const [selectedItem, setSelectedItem] = useState<ActivityLogItem | null>(null);

    return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center animate-fade-in bg-slate-50">
        <header className="w-full max-w-2xl mx-auto mb-8">
            <div className="mb-6">
                <BackButton onClick={onBack} />
            </div>
            <div className="flex items-center gap-3">
                <HistoryIcon className="w-10 h-10 text-slate-500" />
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
                        Activity History
                    </h1>
                    <p className="text-slate-600">A log of your recent analyses.</p>
                </div>
            </div>
        </header>

        <main className="w-full max-w-2xl mx-auto">
            {history.length > 0 ? (
                <div className="space-y-4">
                    {history.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="w-full flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-300 transition-all text-left animate-fade-in-up"
                        >
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                <ActivityIcon type={item.type} />
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-slate-800">{item.title}</p>
                                <p className="text-sm text-slate-500">
                                    {new Date(item.timestamp).toLocaleString(undefined, {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })}
                                </p>
                            </div>
                            <span className="text-xs font-bold text-blue-500">View Report &rarr;</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-slate-200/80">
                    <HistoryIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold text-slate-700">No Activity Yet</h2>
                    <p className="text-slate-500 mt-2">Your analysis reports will appear here once you use the app's features.</p>
                </div>
            )}
        </main>
        
        {selectedItem && <ReportModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
    );
};