import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { WaterLogSettings, WaterLogEntry } from '../types';
import { BackButton } from './BackButton';
import { GlassWaterIcon, BellIcon, ClockIcon } from './icons';

interface WaterLogPageProps {
  onBack: () => void;
}

const WATER_LOG_SETTINGS_KEY = 'geosick_waterlog_settings';
const WATER_LOG_TODAY_KEY = 'geosick_waterlog_today';
const LAST_NOTIFICATION_KEY = 'geosick_last_notification_timestamp';

const DEFAULT_SETTINGS: WaterLogSettings = {
  goal: 2500,
  notifications: {
    enabled: false,
    startTime: '09:00',
    endTime: '21:00',
    frequency: 60, // in minutes
  },
};

// Custom hook to handle the notification logic
const useWaterReminder = (settings: WaterLogSettings['notifications']) => {
  useEffect(() => {
    if (!settings.enabled) {
      return;
    }

    const checkAndNotify = () => {
      if (Notification.permission !== 'granted') {
        return;
      }

      const now = new Date();
      const [startHour, startMinute] = settings.startTime.split(':').map(Number);
      const [endHour, endMinute] = settings.endTime.split(':').map(Number);
      
      const startTime = new Date();
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date();
      endTime.setHours(endHour, endMinute, 0, 0);

      if (now < startTime || now > endTime) {
        return;
      }

      const lastNotificationTimestamp = parseInt(localStorage.getItem(LAST_NOTIFICATION_KEY) || '0', 10);
      const minutesSinceLast = (now.getTime() - lastNotificationTimestamp) / (1000 * 60);

      if (minutesSinceLast >= settings.frequency) {
        new Notification('💧 Time to Hydrate!', {
          body: "A friendly reminder to drink some water.",
          icon: '/favicon.svg',
          tag: 'geosick-water-reminder'
        });
        localStorage.setItem(LAST_NOTIFICATION_KEY, now.getTime().toString());
      }
    };

    const intervalId = setInterval(checkAndNotify, 60 * 1000); // Check every minute
    return () => clearInterval(intervalId);
  }, [settings]);
};

export const WaterLogPage: React.FC<WaterLogPageProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<WaterLogSettings>(DEFAULT_SETTINGS);
  const [log, setLog] = useState<WaterLogEntry[]>([]);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  
  useEffect(() => {
    // Load settings
    const storedSettings = localStorage.getItem(WATER_LOG_SETTINGS_KEY);
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }

    // Load today's log, clearing old data
    const storedLog = localStorage.getItem(WATER_LOG_TODAY_KEY);
    if (storedLog) {
        const todayLog = JSON.parse(storedLog) as WaterLogEntry[];
        const today = new Date().toDateString();
        const filteredLog = todayLog.filter(entry => new Date(entry.timestamp).toDateString() === today);
        if (filteredLog.length !== todayLog.length) {
            localStorage.setItem(WATER_LOG_TODAY_KEY, JSON.stringify(filteredLog));
        }
        setLog(filteredLog);
    }
    
    // Add event listener to check permission when tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setNotificationPermission(Notification.permission);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

  }, []);

  useWaterReminder(settings.notifications);

  const totalIntake = useMemo(() => log.reduce((sum, entry) => sum + entry.amount, 0), [log]);
  const progress = useMemo(() => Math.min((totalIntake / settings.goal) * 100, 100), [totalIntake, settings.goal]);

  const saveSettings = (newSettings: WaterLogSettings) => {
      setSettings(newSettings);
      localStorage.setItem(WATER_LOG_SETTINGS_KEY, JSON.stringify(newSettings));
  };
  
  const addWater = (amount: number) => {
    if (amount <= 0) return;
    const newEntry: WaterLogEntry = {
      id: new Date().toISOString(),
      timestamp: Date.now(),
      amount,
    };
    const newLog = [newEntry, ...log];
    setLog(newLog);
    localStorage.setItem(WATER_LOG_TODAY_KEY, JSON.stringify(newLog));
  };
  
  const requestNotificationPermission = async () => {
    if (Notification.permission === 'granted') return true;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
        localStorage.setItem(LAST_NOTIFICATION_KEY, '0'); // Reset timer on grant
        return true;
    }
    return false;
  };

  const handleNotificationToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = e.target.checked;
    if (isEnabled) {
      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) {
        // User denied permission, so we don't enable it.
        return; 
      }
    }
    saveSettings({ ...settings, notifications: { ...settings.notifications, enabled: isEnabled }});
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center animate-fade-in bg-slate-50">
      <header className="w-full max-w-3xl mx-auto mb-8">
        <div className="mb-6">
          <BackButton onClick={onBack} />
        </div>
        <div className="flex items-center gap-3">
          <GlassWaterIcon className="w-10 h-10 text-cyan-500" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Water Log</h1>
            <p className="text-slate-600">Stay hydrated, stay healthy.</p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Intake Tracker */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Today's Progress</h2>
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray={`${progress}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-slate-800">{totalIntake}</span>
                <span className="text-slate-500">/ {settings.goal} ml</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-slate-700 text-center mb-3">Add Intake</h3>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => addWater(250)} className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-semibold py-3 rounded-lg transition-colors">250ml</button>
                <button onClick={() => addWater(500)} className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-semibold py-3 rounded-lg transition-colors">500ml</button>
                <button onClick={() => addWater(750)} className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-semibold py-3 rounded-lg transition-colors">750ml</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80">
             <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><BellIcon className="w-6 h-6 text-slate-500" /> Drink Reminders</h2>
             <div className="flex items-center justify-between">
                <label htmlFor="notif-toggle" className="font-semibold text-slate-700">Enable Reminders</label>
                <input 
                    type="checkbox"
                    id="notif-toggle"
                    className="h-6 w-11 rounded-full bg-slate-300 relative cursor-pointer appearance-none 
                               before:absolute before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow-sm before:transform before:top-0.5 before:left-0.5 before:transition-all 
                               checked:bg-cyan-500 checked:before:translate-x-5"
                    checked={settings.notifications.enabled}
                    onChange={handleNotificationToggle}
                />
             </div>
             {notificationPermission === 'denied' && (
                <p className="text-xs text-red-600 mt-2">Notification permission is blocked. Please enable it in your browser settings to use this feature.</p>
             )}

             {settings.notifications.enabled && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-fade-in">
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-slate-600">Start Time</label>
                        <input type="time" id="startTime" value={settings.notifications.startTime} onChange={e => saveSettings({ ...settings, notifications: {...settings.notifications, startTime: e.target.value}})} className="mt-1 w-full p-2 border border-slate-300 rounded-md" />
                    </div>
                     <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-slate-600">End Time</label>
                        <input type="time" id="endTime" value={settings.notifications.endTime} onChange={e => saveSettings({ ...settings, notifications: {...settings.notifications, endTime: e.target.value}})} className="mt-1 w-full p-2 border border-slate-300 rounded-md" />
                    </div>
                     <div>
                        <label htmlFor="frequency" className="block text-sm font-medium text-slate-600">Frequency</label>
                        <select id="frequency" value={settings.notifications.frequency} onChange={e => saveSettings({ ...settings, notifications: {...settings.notifications, frequency: Number(e.target.value)}})} className="mt-1 w-full p-2 border border-slate-300 rounded-md bg-white">
                            <option value={30}>Every 30 minutes</option>
                            <option value={60}>Every hour</option>
                            <option value={90}>Every 90 minutes</option>
                            <option value={120}>Every 2 hours</option>
                        </select>
                    </div>
                </div>
             )}
          </div>
        </div>

        {/* Right Column: Today's Log */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><ClockIcon className="w-6 h-6 text-slate-500" />Today's Log</h2>
          <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
            {log.length > 0 ? log.map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                    <div className="flex items-center gap-3">
                        <GlassWaterIcon className="w-5 h-5 text-cyan-600"/>
                        <p className="font-semibold text-slate-700">{entry.amount} ml</p>
                    </div>
                    <p className="text-sm text-slate-500">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            )) : (
                <div className="text-center py-12 text-slate-500">
                    <p>No water logged yet today.</p>
                    <p className="text-sm">Click a button to add your first entry!</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
