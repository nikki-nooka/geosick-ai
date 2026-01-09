
import React from 'react';

export const SymptomReportSkeleton: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80 animate-pulse w-full">
            <div className="space-y-6">
                {/* Triage Recommendation */}
                <div className="h-16 bg-slate-200 rounded-lg w-full"></div>

                {/* Summary */}
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                </div>

                {/* Potential Conditions */}
                <div>
                    <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-14 bg-slate-200 rounded w-full"></div>
                        <div className="h-14 bg-slate-200 rounded w-full"></div>
                    </div>
                </div>

                 {/* Next Steps */}
                <div>
                    <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-5 bg-slate-200 rounded w-full"></div>
                        <div className="h-5 bg-slate-200 rounded w-4/5"></div>
                        <div className="h-5 bg-slate-200 rounded w-full"></div>
                    </div>
                </div>

                 {/* Disclaimer */}
                <div className="h-20 bg-slate-200 rounded-lg w-full"></div>
            </div>
        </div>
    );
};
