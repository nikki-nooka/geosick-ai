import React from 'react';
import type { CityHealthSnapshot, DiseaseReport } from '../types';
import {
    HazardIcon, LinkIcon, InfoIcon, UserGroupIcon, ClockIcon,
    ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon
} from './icons';

const TrendIndicator: React.FC<{ trend: DiseaseReport['trend'] }> = ({ trend }) => {
    switch (trend) {
        case 'Increasing':
            return <span className="flex items-center text-sm font-semibold text-red-600"><ArrowTrendingUpIcon className="w-5 h-5 mr-1"/> Increasing</span>;
        case 'Decreasing':
            return <span className="flex items-center text-sm font-semibold text-green-600"><ArrowTrendingDownIcon className="w-5 h-5 mr-1"/> Decreasing</span>;
        case 'Stable':
            return <span className="flex items-center text-sm font-semibold text-slate-600"><MinusIcon className="w-5 h-5 mr-1"/> Stable</span>;
        default:
            return <span className="text-sm text-slate-500">Trend Unknown</span>;
    }
};

export const CityHealthReport: React.FC<{ snapshot: CityHealthSnapshot }> = ({ snapshot }) => {
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
        {/* Disclaimer */}
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4" role="alert">
            <div className="flex">
                <div className="py-1"><HazardIcon className="w-6 h-6 text-red-600 mr-3"/></div>
                <div>
                    <p className="font-bold">Important Disclaimer</p>
                    <p className="text-sm">{snapshot.dataDisclaimer}</p>
                </div>
            </div>
        </div>

        {/* Header & Summary */}
        <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-500 text-sm">
                <ClockIcon className="w-5 h-5"/> 
                <span>{snapshot.lastUpdated}</span>
            </div>
             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                 <div className="flex items-start">
                    <InfoIcon className="w-6 h-6 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-base text-blue-800">Overall Summary</h4>
                        <p className="mt-1 text-sm text-blue-700">{snapshot.overallSummary}</p>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Disease Reports */}
        <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Prevalent Disease Reports</h3>
            <div className="space-y-4">
                {snapshot.diseases.map(disease => (
                    <div key={disease.name} className="bg-white rounded-lg border border-slate-200/80 overflow-hidden">
                        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex justify-between items-center">
                            <h4 className="text-base font-bold text-slate-800">{disease.name}</h4>
                            <TrendIndicator trend={disease.trend} />
                        </div>
                        <div className="p-4 space-y-3 text-sm">
                            <p className="text-slate-600">{disease.summary}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                                <div>
                                    <p className="font-semibold text-slate-500">Reported Cases:</p>
                                    <p className="text-slate-800">{disease.reportedCases}</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <UserGroupIcon className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-500">Affected Demographics:</p>
                                        <p className="text-slate-800">{disease.affectedDemographics}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {snapshot.diseases.length === 0 && (
                     <div className="text-center p-8 bg-slate-50 rounded-lg border">
                        <InfoIcon className="w-12 h-12 mx-auto text-slate-400 mb-2"/>
                        <p className="font-semibold text-slate-700">No Significant Outbreaks Found</p>
                        <p className="text-sm text-slate-500">No widespread public health threats were identified from recent data.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Sources */}
        {snapshot.sources && snapshot.sources.length > 0 && (
            <div className="border-t border-slate-200 pt-6">
                <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-gray-500"/>
                    Information Sources
                </h3>
                <ul className="space-y-2 text-sm max-h-40 overflow-y-auto pr-2 bg-slate-50 p-3 rounded-md border">
                    {snapshot.sources.map(source => (
                        <li key={source.uri} className="truncate">
                            <a 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                                title={source.uri}
                            >
                                {source.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
};
