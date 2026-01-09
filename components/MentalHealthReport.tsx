import React from 'react';
import type { MentalHealthResult } from '../types';
import { SummaryIcon, HazardIcon, ShieldCheckIcon, BrainCircuitIcon } from './icons';
import { useI18n } from './I18n';

interface MentalHealthReportProps {
  result: MentalHealthResult;
}

export const MentalHealthReport: React.FC<MentalHealthReportProps> = ({ result }) => {
  const { t } = useI18n();
  const potentialConcerns = result.potentialConcerns || [];
  const copingStrategies = result.copingStrategies || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-6 animate-fade-in space-y-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-start">
                <SummaryIcon className="w-6 h-6 mr-3 mt-1 text-indigo-500 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-base text-indigo-800">{t('wellness_reflection_label')}</h3>
                    <p className="mt-1 text-sm text-indigo-700">{result.summary || 'Summary unavailable.'}</p>
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <BrainCircuitIcon className="w-6 h-6 text-indigo-500" />
                {t('areas_reflection_label')}
            </h3>
            <div className="space-y-3">
                {potentialConcerns.length > 0 ? (
                    potentialConcerns.map((concern, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                           <p className="font-bold text-slate-800">{concern.name}</p>
                           <p className="text-sm text-slate-600 mt-1">{concern.explanation}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500 italic">No specific areas for reflection identified.</p>
                )}
            </div>
        </div>

        <div>
             <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-green-500"/>
                {t('coping_strategies_label')}
            </h3>
            <div className="space-y-4">
                {copingStrategies.length > 0 ? (
                    copingStrategies.map((strategy, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                           <div className="mt-1 flex-shrink-0"><ShieldCheckIcon className="w-5 h-5 text-green-500" /></div>
                           <div>
                                <p className="font-bold text-slate-800 text-sm">{strategy.title}</p>
                                <p className="text-sm text-slate-700 leading-relaxed mt-0.5">{strategy.description}</p>
                           </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500 italic">No specific coping strategies recommended.</p>
                )}
            </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-r-lg" role="alert">
            <div className="flex">
                <div className="py-1"><HazardIcon className="w-6 h-6 text-blue-500 mr-3"/></div>
                <div>
                    <p className="font-bold">Recommendation</p>
                    <p className="text-sm">{result.recommendation || 'Focus on your daily well-being.'}</p>
                </div>
            </div>
        </div>
    </div>
  );
};