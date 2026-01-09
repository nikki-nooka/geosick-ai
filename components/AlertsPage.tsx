import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getLiveHealthAlerts, getLocalHealthAlerts } from '../services/geminiService';
import type { Alert, AlertCategory } from '../types';
import { BiohazardIcon, WindIcon, SunIcon, GlobeIcon, MapPinIcon, MegaphoneIcon, BellIcon } from './icons';
import { AlertDetailModal } from './AlertDetailModal';

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

const AlertSkeleton: React.FC = () => (
    <div className="w-full flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-slate-200/80 animate-pulse">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-200"></div>
        <div className="flex-grow space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
    </div>
);

export const AlertsPage: React.FC = () => {
    const [alerts, setAlerts] = useState<{ global: Alert[], local: Alert[] }>({ global: [], local: [] });
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<{ global?: string, local?: string }>({});
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    
    const { localAlerts, globalAlerts } = useMemo(() => {
        const local = alerts.local;
        const global = alerts.global;
        const uniqueGlobal = global.filter(g => 
            !local.some(l => l.title === g.title && l.location === g.location)
        );
        return { localAlerts: local, globalAlerts: uniqueGlobal };
    }, [alerts]);

    const fetchAlerts = useCallback(async (isManualRefresh = false) => {
        if (isManualRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError({});

        const fetchGlobal = getLiveHealthAlerts(isManualRefresh).catch(e => {
            console.error("Failed to fetch global alerts:", e);
            setError(prev => ({...prev, global: "Could not fetch global alerts."}));
            return [];
        });

        const fetchLocal = new Promise<Alert[]>(resolve => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    getLocalHealthAlerts(latitude, longitude, isManualRefresh)
                        .then(resolve)
                        .catch(e => {
                            console.error("Failed to fetch local alerts:", e);
                            setError(prev => ({...prev, local: "Could not fetch local alerts for your area."}));
                            resolve([]);
                        });
                },
                (geoError) => {
                    console.warn("Geolocation failed:", geoError.message);
                    setError(prev => ({...prev, local: "Could not get your location to find local alerts."}));
                    resolve([]);
                },
                { timeout: 8000 }
            );
        });

        const [globalResult, localResult] = await Promise.all([fetchGlobal, fetchLocal]);
        
        setAlerts({ global: globalResult, local: localResult });
        setLastUpdated(new Date());
        setIsLoading(false);
        setIsRefreshing(false);
    }, []);

    useEffect(() => {
        fetchAlerts();
    }, []); // Run only on initial mount. Refresh is manual via button.
    
    const AlertCard: React.FC<{alert: Alert}> = ({ alert }) => (
        <button
            onClick={() => setSelectedAlert(alert)}
            className="w-full flex items-start text-left gap-4 p-4 bg-white rounded-lg shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-300 transition-all"
        >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mt-1">
                {getIconForCategory(alert.category, "w-6 h-6")}
            </div>
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    {alert.source === 'local' && (
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Local</span>
                    )}
                    <p className="font-semibold text-slate-800">{alert.title}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{alert.location}, {alert.country}</span>
                </div>
            </div>
             <span className="text-xs font-bold text-blue-500 self-center hidden sm:block">Details &rarr;</span>
        </button>
    );

    const renderAlerts = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => <AlertSkeleton key={i} />)}
                </div>
            );
        }
        
        const hasErrors = Object.keys(error).length > 0;
        const noAlerts = localAlerts.length === 0 && globalAlerts.length === 0;

        if (noAlerts) {
            return (
                <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-slate-200/80">
                    <BellIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold text-slate-700">{hasErrors ? "Could Not Fetch Alerts" : "No Active Alerts"}</h2>
                    <p className="text-slate-500 mt-2">
                        {hasErrors 
                            ? `${error.local || ''} ${error.global || ''}`.trim()
                            : "No significant public health alerts found at this time."
                        }
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {localAlerts.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Local Alerts</h2>
                        <div className="space-y-4">
                            {localAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
                        </div>
                    </section>
                )}
                 {globalAlerts.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Global Alerts</h2>
                        <div className="space-y-4">
                            {globalAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
                        </div>
                    </section>
                )}
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center animate-fade-in bg-slate-50">
            <main className="w-full max-w-3xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-3">
                        <BellIcon className="w-10 h-10 text-slate-500" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
                                Live Health Alerts
                            </h1>
                            <p className="text-slate-600">The latest public health updates from around the world.</p>
                        </div>
                    </div>
                     <div className="mt-4 flex justify-between items-center bg-slate-100 p-2 rounded-lg">
                        <p className="text-xs text-slate-500">
                            Last Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'N/A'}
                        </p>
                        <button 
                            onClick={() => fetchAlerts(true)}
                            disabled={isRefreshing || isLoading}
                            className="text-xs font-semibold bg-white text-slate-700 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-200 transition-colors disabled:opacity-50"
                        >
                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </header>
                {renderAlerts()}
            </main>
            {selectedAlert && <AlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />}
        </div>
    );
};