import React, { useState, useEffect, useMemo } from 'react';
import type { User, WaterLogSettings, WaterLogEntry, HealthForecast as HealthForecastData, RiskFactor, ActivityLogItem } from '../types';
import { ScanIcon, StethoscopeIcon, DocumentChartBarIcon, SparklesIcon, ChevronRightIcon, SunIcon, WindIcon, HazardIcon, GlassWaterIcon } from './icons';
import { getHealthForecast } from '../services/geminiService';
import { HealthForecast } from './HealthForecast';
import { useI18n } from './I18n';

const WATER_LOG_SETTINGS_KEY = 'geosick_waterlog_settings';
const WATER_LOG_TODAY_KEY = 'geosick_waterlog_today';
const ACTIVITY_HISTORY_KEY = 'geosick_activity_history';

const DEFAULT_SETTINGS: WaterLogSettings = {
  goal: 2500,
  notifications: { enabled: false, startTime: '09:00', endTime: '21:00', frequency: 60, },
};

const Card: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
    <div 
        className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-md border border-white/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-white/60 ${className}`}
        style={style}
    >
        {children}
    </div>
);

const RiskFactorIcon: React.FC<{ name: string }> = ({ name }) => {
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName.includes('air quality')) return <WindIcon className="w-5 h-5 text-slate-50" />;
    if (lowerCaseName.includes('uv index')) return <SunIcon className="w-5 h-5 text-orange-400" />;
    if (lowerCaseName.includes('mosquito') || lowerCaseName.includes('pollen')) return <HazardIcon className="w-5 h-5 text-red-500" />;
    return <HazardIcon className="w-5 h-5 text-gray-500" />;
};

const HealthCastWidget: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
    const [forecast, setForecast] = useState<HealthForecastData | null>(null);
    const { language, t } = useI18n();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const result = await getHealthForecast({ lat: latitude, lng: longitude }, language);
                    setForecast(result);
                } catch (err) { console.error(err); }
            },
            (err) => console.error(err),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, [language]);

    const topRisks = useMemo(() => {
        if (!forecast || !Array.isArray(forecast.riskFactors)) return [];
        const riskOrder = { 'Very High': 4, 'High': 3, 'Moderate': 2, 'Low': 1 };
        return [...forecast.riskFactors]
            .sort((a, b) => {
                const levelA = b.level as keyof typeof riskOrder;
                const levelB = a.level as keyof typeof riskOrder;
                return (riskOrder[levelA] || 0) - (riskOrder[levelB] || 0);
            })
            .slice(0, 3);
    }, [forecast]);

    return (
        <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800">{t('local_health_briefing')}</h3>
            <p className="text-sm text-slate-600 mb-4">{forecast?.locationName || t('fetching_location')}</p>
            {forecast ? (
                <>
                    <p className="text-sm text-slate-700 mb-4">{forecast.summary}</p>
                    <div className="space-y-3">
                        {topRisks.map(risk => (
                            <div key={risk.name} className="flex items-center gap-3">
                                <RiskFactorIcon name={risk.name} />
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{risk.name}</p>
                                    <p className="text-xs text-slate-500">{risk.level}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={onNavigate} className="text-sm font-semibold text-blue-600 hover:text-blue-700 mt-4">
                        {t('view_full_forecast')}
                    </button>
                </>
            ) : <p className="text-sm text-slate-500">{t('fetching_location')}</p>}
        </div>
    );
};

const WaterLogWidget: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
    const [settings, setSettings] = useState<WaterLogSettings>(DEFAULT_SETTINGS);
    const [log, setLog] = useState<WaterLogEntry[]>([]);
    const { t } = useI18n();
    
    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem(WATER_LOG_SETTINGS_KEY);
            if (storedSettings) setSettings(JSON.parse(storedSettings));

            const storedLog = localStorage.getItem(WATER_LOG_TODAY_KEY);
            if (storedLog) {
                const todayLog = JSON.parse(storedLog);
                const today = new Date().toDateString();
                const filteredLog = todayLog.filter((entry: WaterLogEntry) => new Date(entry.timestamp).toDateString() === today);
                setLog(filteredLog);
            }
        } catch (e) { console.error("Failed to load water log data", e); }
    }, []);

    const totalIntake = useMemo(() => log.reduce((sum, entry) => sum + entry.amount, 0), [log]);
    const progress = useMemo(() => Math.min((totalIntake / settings.goal) * 100, 100), [totalIntake, settings.goal]);

    return (
        <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800">{t('hydration_tracker')}</h3>
            <div className="flex items-center gap-4 mt-3">
                <div className="relative w-20 h-20">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeDasharray={`${progress}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-bold text-slate-800">{Math.round(progress)}%</span>
                    </div>
                </div>
                <div>
                    <p className="text-lg font-semibold text-slate-800">{totalIntake} ml</p>
                    <p className="text-sm text-slate-600">{t('goal_label', { amount: settings.goal.toString() }) || `Goal: ${settings.goal} ml`}</p>
                </div>
            </div>
            <button onClick={onNavigate} className="text-sm font-semibold text-blue-600 hover:text-blue-700 mt-3">
                {t('log_water_cta')}
            </button>
        </div>
    );
};

const ActivityChart: React.FC = () => {
    const [data, setData] = useState<number[]>([]);
    const { t } = useI18n();
    const days = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);

    useEffect(() => {
        try {
            const history: ActivityLogItem[] = JSON.parse(localStorage.getItem(ACTIVITY_HISTORY_KEY) || '[]');
            const activityByDay = Array(7).fill(0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            history.forEach(item => {
                const itemDate = new Date(item.timestamp);
                itemDate.setHours(0, 0, 0, 0);
                const diffDays = Math.floor((today.getTime() - itemDate.getTime()) / (1000 * 3600 * 24));
                if (diffDays >= 0 && diffDays < 7) {
                    const dayIndex = (today.getDay() - diffDays + 7) % 7;
                    activityByDay[dayIndex]++;
                }
            });

            // Reorder so today is the last day
            const dayOfWeek = today.getDay();
            const orderedData = [];
            for (let i = 0; i < 7; i++) {
                const index = (dayOfWeek + 1 + i) % 7;
                orderedData.push(activityByDay[index]);
            }
            setData(orderedData);
        } catch (e) {
            console.error("Failed to process activity data", e);
        }
    }, []);

    const maxActivity = Math.max(...data, 1);

    return (
        <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <DocumentChartBarIcon className="w-6 h-6 text-slate-600" />
                {t('activity_7_day')}
            </h3>
            <div className="bar-chart-container">
                {data.map((value, index) => {
                    const dayIndex = (new Date().getDay() + 1 + index) % 7;
                    return (
                        <div key={index} className="bar-wrapper">
                            <div className="bar-tooltip">{value} analysis</div>
                            <div 
                                className="bar" 
                                style={{ height: `${(value / maxActivity) * 100}%` }}
                            ></div>
                            <span className="bar-label">{days[dayIndex]}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const QuickActionCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; onClick: () => void; }> = ({ icon, title, subtitle, onClick }) => (
    <button
        onClick={onClick}
        className="group flex items-center justify-between w-full text-left p-4 rounded-xl bg-white/60 backdrop-blur-md transition-all duration-300 border border-slate-200/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:bg-white/80"
    >
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/70 group-hover:bg-white border border-white/30 flex items-center justify-center transition-colors duration-300">
                {icon}
            </div>
            <div>
                <p className="font-semibold text-slate-800">{title}</p>
                <p className="text-sm text-slate-600">{subtitle}</p>
            </div>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
    </button>
);

interface WelcomePageProps {
  user: User;
  onAnalyze: () => void;
  onAnalyzePrescription: () => void;
  onAnalyzeMentalHealth: () => void;
  onCheckSymptoms: () => void;
  onWaterLog: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ user, onAnalyze, onAnalyzePrescription, onAnalyzeMentalHealth, onCheckSymptoms, onWaterLog }) => {
    const [view, setView] = useState<'actions' | 'briefing'>('actions');
    const { t } = useI18n();
    const actions = [
        { icon: <ScanIcon className="w-5 h-5 text-blue-500" />, title: t('area_scan'), subtitle: t('area_scan_desc'), onClick: onAnalyze },
        { icon: <StethoscopeIcon className="w-5 h-5 text-teal-500" />, title: t('symptom_checker'), subtitle: t('symptom_checker_desc'), onClick: onCheckSymptoms },
        { icon: <DocumentChartBarIcon className="w-5 h-5 text-orange-500" />, title: t('script_reader'), subtitle: t('script_reader_desc'), onClick: onAnalyzePrescription },
        { icon: <SparklesIcon className="w-5 h-5 text-indigo-500" />, title: t('mind_check'), subtitle: t('mind_check_desc'), onClick: onAnalyzeMentalHealth },
        { icon: <GlassWaterIcon className="w-5 h-5 text-cyan-500" />, title: t('water_log'), subtitle: t('water_log_desc'), onClick: onWaterLog },
    ];

    if (view === 'briefing') {
        return <HealthForecast onBack={() => setView('actions')} />;
    }

    return (
        <div className="relative w-full min-h-full overflow-y-auto animated-gradient-bg">
            <div className="relative z-10 w-full min-h-full p-4 sm:p-6 lg:p-8">
                <header className="mb-8 w-full max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-800 animate-fade-in-up">{t('welcome_user', { name: user.name.split(' ')[0] })}</h1>
                    <p className="text-slate-600 mt-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>{t('what_today')}</p>
                </header>
                
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <HealthCastWidget onNavigate={() => setView('briefing')} />
                        </Card>
                         <Card className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                           <ActivityChart />
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                           <WaterLogWidget onNavigate={onWaterLog} />
                        </Card>
                        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                            <h3 className="text-lg font-bold text-slate-800 px-2">{t('quick_actions')}</h3>
                            {actions.map((action, index) => (
                                <QuickActionCard key={index} {...action} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};