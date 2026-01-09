import React from 'react';
import type { Alert, AlertCategory } from '../types';
import {
    BiohazardIcon, WindIcon, SunIcon, GlobeIcon, CloseIcon, MapPinIcon, HazardIcon, InfoIcon,
    LinkIcon, MegaphoneIcon, MapIcon, ClockIcon, GlobeAltIcon
} from './icons';

const getIconForCategory = (category: AlertCategory, className: string = "w-5 h-5") => {
    switch (category) {
        case 'disease': return <BiohazardIcon className={`${className} text-red-500`} />;
        case 'air': return <WindIcon className={`${className} text-slate-500`} />;
        case 'heat': return <SunIcon className={`${className} text-orange-500`} />;
        case 'environmental': return <GlobeIcon className={`${className} text-green-500`} />;
        case 'other': return <MegaphoneIcon className={`${className} text-purple-500`} />;
        default: return <GlobeIcon className={`${className} text-blue-500`} />;
    }
};

const timeAgo = (timestamp: number): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
};


export const AlertDetailModal: React.FC<{ alert: Alert, onClose: () => void }> = ({ alert, onClose }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex justify-between items-center border-b border-slate-200 bg-slate-50/70 rounded-t-xl">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0">{getIconForCategory(alert.category, "w-6 h-6")}</div>
                        <h2 className="text-lg font-bold text-slate-800 truncate">{alert.title}</h2>
                    </div>
                     <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 flex-shrink-0">
                        <CloseIcon className="w-6 h-6 text-slate-600" />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Context Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border">
                            <ClockIcon className="w-5 h-5 text-slate-500 flex-shrink-0"/>
                            <div>
                                <span className="font-semibold text-slate-800">Data Processed:</span> {timeAgo(alert.fetchedAt)}
                            </div>
                        </div>
                         <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border">
                            <GlobeAltIcon className="w-5 h-5 text-slate-500 flex-shrink-0"/>
                            <div>
                                <span className="font-semibold text-slate-800">Country/Region:</span> {alert.country || 'N/A'}
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 p-3 rounded-lg border ${alert.source === 'local' ? 'bg-green-50' : 'bg-blue-50'}`}>
                            {alert.source === 'local' ? <MapPinIcon className="w-5 h-5 text-green-600 flex-shrink-0"/> : <GlobeIcon className="w-5 h-5 text-blue-600 flex-shrink-0"/>}
                            <div>
                                <span className="font-semibold text-slate-800">Source:</span>
                                <span className={`font-bold ml-1 ${alert.source === 'local' ? 'text-green-700' : 'text-blue-700'}`}>
                                    {alert.source === 'local' ? 'Local Alert' : 'Global Alert'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Main Details */}
                    <div>
                        <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2"><InfoIcon className="w-5 h-5 text-blue-500"/>Details</h3>
                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border">{alert.detailedInfo}</p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2"><HazardIcon className="w-5 h-5 text-red-500"/>Threat Analysis</h3>
                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border">{alert.threatAnalysis}</p>
                    </div>
                    
                    <div>
                         <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-gray-500"/>Location Details</h3>
                         <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border">
                            <p><strong>Primary Location:</strong> {alert.location}</p>
                            {alert.locationDetails && <p className="mt-1"><strong>Specifics:</strong> {alert.locationDetails}</p>}
                         </div>
                    </div>

                    {alert.lat && alert.lng && (
                        <div>
                            <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2">
                                <MapIcon className="w-5 h-5 text-gray-500"/>
                                Event Map
                            </h3>
                            <div className="rounded-lg overflow-hidden border border-slate-200 aspect-video">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps/embed/v1/view?key=${process.env.API_KEY}&center=${alert.lat},${alert.lng}&zoom=10&maptype=satellite`}
                                ></iframe>
                            </div>
                        </div>
                    )}

                     {alert.sources && alert.sources.length > 0 && (
                        <div>
                            <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2"><LinkIcon className="w-5 h-5 text-gray-500"/>Sources</h3>
                            <ul className="space-y-2 text-sm max-h-40 overflow-y-auto pr-2">
                                {alert.sources.map(source => (
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
            </div>
        </div>
    );
};
