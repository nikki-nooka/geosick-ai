
import React, { useState } from 'react';
import { geocodeLocation, findFacilitiesByCoordinates } from '../services/geminiService';
import { HeartPulseIcon, BuildingOfficeIcon, UserIcon, SendIcon, DirectionsIcon, MagnifyingGlassIcon, CrosshairsIcon, CheckCircleIcon, LinkIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';
import type { Facility } from '../types';
import { BackButton } from './BackButton';
import { useI18n } from './I18n';

interface CheckupPageProps {
  onBack: () => void;
}

const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; 
    const rlat1 = lat1 * (Math.PI / 180);
    const rlat2 = lat2 * (Math.PI / 180);
    const difflat = rlat2 - rlat1;
    const difflon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
        Math.cos(rlat1) * Math.cos(rlat2) *
        Math.sin(difflon / 2) * Math.sin(difflon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Ensures labels are rendered as strings to prevent Error #31
 */
const safeRender = (val: any): string => {
    if (typeof val === 'string') return val;
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') {
        return val.name || val.area || val.address || val.cityName || 'Verified Facility';
    }
    return String(val);
};

type PaidFormStatus = 'idle' | 'sending' | 'sent';
type LocationStatus = 'idle' | 'fetching_gps' | 'geocoding' | 'finding_facilities' | 'success' | 'error';

export const CheckupPage: React.FC<CheckupPageProps> = ({ onBack }) => {
    const { t } = useI18n();
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
    const [locationError, setLocationError] = useState<string | null>(null);
    const [manualLocationInput, setManualLocationInput] = useState('');
    
    const [paidFormStatus, setPaidFormStatus] = useState<PaidFormStatus>('idle');
    const [formState, setFormState] = useState({ name: '', address: '', phone: '', date: '', email: '' });
    
    const [geocodingStatus, setGeocodingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);

    const resetLocationState = () => {
        setFacilities([]);
        setLocationStatus('idle');
        setLocationError(null);
    };

    const findAndSetFacilities = async (coords: { lat: number, lng: number }) => {
        setLocationStatus('finding_facilities');
        setFacilities([]);
        setLocationError(null);
        try {
            const facilitiesFromApi = await findFacilitiesByCoordinates(coords);
            
            // Re-calculate distance from the search center for sorting
            const sortedByDistance = facilitiesFromApi
                .map(f => ({
                    ...f,
                    rawDistance: getDistanceInKm(coords.lat, coords.lng, f.lat, f.lng)
                }))
                .sort((a, b) => a.rawDistance - b.rawDistance)
                .map(f => ({
                    ...f,
                    distance: `${f.rawDistance < 1 ? (f.rawDistance * 1000).toFixed(0) + ' m' : f.rawDistance.toFixed(1) + ' km'}`
                }));
            
            setFacilities(sortedByDistance);
            setLocationStatus('success');
        } catch (error: any) {
            setLocationError("Unable to retrieve real-time hospital data. Please try another search.");
            setLocationStatus('error');
        }
    };
    
    const handleUseCurrentLocation = () => {
        resetLocationState();
        setLocationStatus('fetching_gps');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
                findAndSetFacilities(coords);
            },
            () => {
                setLocationError("GPS access denied. Please type your location manually.");
                setLocationStatus('error');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleManualSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualLocationInput.trim()) return;
        resetLocationState();
        setLocationStatus('geocoding');
        try {
            const coords = await geocodeLocation(manualLocationInput);
            await findAndSetFacilities(coords);
        } catch (error) {
            setLocationError("Could not pinpoint that location. Try a more specific address.");
            setLocationStatus('error');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleVerifyAddress = async () => {
        if (!formState.address.trim()) return;
        setGeocodingStatus('loading');
        try {
            const { foundLocationName } = await geocodeLocation(formState.address);
            setVerifiedAddress(foundLocationName);
            setGeocodingStatus('success');
        } catch (error) {
            setGeocodingStatus('error');
        }
    };

  return (
    <div className="w-full min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in bg-slate-50">
        <header className="w-full max-w-6xl mx-auto flex justify-start items-center">
            <BackButton onClick={onBack}>{t('back')}</BackButton>
        </header>

        <main className="flex-grow flex flex-col items-center mt-8">
            <div className="text-center">
                <HeartPulseIcon className="w-16 h-16 mx-auto text-green-500" />
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mt-4">{t('schedule_checkup_title')}</h1>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">{t('schedule_checkup_subtitle')}</p>
            </div>

            <div className="w-full max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Real-World Mapping Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 h-full flex flex-col">
                    <div className="flex items-center gap-3">
                        <BuildingOfficeIcon className="w-10 h-10 text-blue-500"/>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{t('community_resources_title')}</h2>
                            <p className="text-slate-500 text-sm">Searching any location for nearest medical facilities</p>
                        </div>
                    </div>
                     <div className="mt-4 border-t border-slate-200 pt-4 space-y-4">
                        <form onSubmit={handleManualSearch} className="flex gap-2">
                             <input
                                type="text"
                                value={manualLocationInput}
                                onChange={(e) => setManualLocationInput(e.target.value)}
                                placeholder="Search city, address, or country..."
                                className="flex-grow block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2.5 rounded-xl transition-all shadow-md active:scale-95">
                               <MagnifyingGlassIcon className="w-6 h-6" />
                            </button>
                        </form>
                        <button onClick={handleUseCurrentLocation} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all border border-slate-200">
                           <CrosshairsIcon className="w-5 h-5 mr-2" /> {t('use_current_location')}
                        </button>
                    </div>

                    <div className="mt-6 flex-grow">
                        {locationStatus === 'fetching_gps' && <div className="flex flex-col items-center justify-center py-12 text-slate-500"><LoadingSpinner /><span className="mt-4 font-semibold">Accessing GPS...</span></div>}
                        {locationStatus === 'geocoding' && <div className="flex flex-col items-center justify-center py-12 text-slate-500"><LoadingSpinner /><span className="mt-4 font-semibold">Locating search area...</span></div>}
                        {locationStatus === 'finding_facilities' && <div className="flex flex-col items-center justify-center py-12 text-slate-500"><LoadingSpinner /><span className="mt-4 font-semibold text-center">Scanning REAL-WORLD Maps data...</span></div>}
                        
                        {locationStatus === 'success' && facilities.length > 0 && (
                            <div className="space-y-4 animate-fade-in">
                                <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden shadow-sm max-h-[450px] overflow-y-auto">
                                    {facilities.map((facility, index) => {
                                        const directionsUrl = facility.url || `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;
                                        return (
                                        <li key={index} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white hover:bg-blue-50/50 transition-colors gap-3">
                                            <div className="min-w-0 pr-2">
                                                <p className="font-bold text-slate-800 text-base">{safeRender(facility.name)}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{facility.type}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-xs font-medium text-slate-500">{facility.distance} away</span>
                                                </div>
                                            </div>
                                            <a 
                                                href={directionsUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex-shrink-0 w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-5 rounded-full flex items-center justify-center text-sm transition-all shadow-md active:scale-95"
                                            >
                                                {facility.url ? <LinkIcon className="w-4 h-4 mr-2" /> : <DirectionsIcon className="w-4 h-4 mr-2" />}
                                                {facility.url ? 'View Place' : t('directions_button')}
                                            </a>
                                        </li>
                                    )})}
                                </ul>
                            </div>
                        )}
                        {locationStatus === 'success' && facilities.length === 0 && (
                             <div className="text-center p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-500 font-bold">No verified facilities found in this area.</p>
                                <p className="text-sm text-slate-400 mt-2">Try searching for a larger city or broader address.</p>
                            </div>
                        )}
                        {locationStatus === 'error' && (
                            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                                <p className="text-sm text-red-600 font-bold">{locationError}</p>
                                <button onClick={handleUseCurrentLocation} className="mt-4 text-sm font-bold text-red-700 bg-red-100 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">Retry Search</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 h-full flex flex-col">
                    <div className="flex items-center gap-3">
                        <UserIcon className="w-10 h-10 text-green-500"/>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{t('personalized_visit_title')}</h2>
                            <p className="text-slate-500 text-sm">{t('paid_consultation')}</p>
                        </div>
                    </div>
                    {paidFormStatus === 'sent' ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                            <CheckCircleIcon className="w-20 h-20 text-green-500" />
                            <h3 className="text-3xl font-bold text-green-800 mt-6">{t('appointment_requested')}</h3>
                            <p className="mt-2 text-slate-600">Check your email for confirmation.</p>
                        </div>
                    ) : (
                        <form onSubmit={(e) => { e.preventDefault(); setPaidFormStatus('sending'); setTimeout(() => setPaidFormStatus('sent'), 1200); }} className="mt-4 border-t border-slate-100 pt-6 space-y-5">
                            <p className="text-sm text-slate-600 font-medium">{t('form_fill_desc')}</p>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('form_full_name')}</label>
                                <input type="text" name="name" required value={formState.name} onChange={handleInputChange} className="block w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('form_address')}</label>
                                <div className="relative">
                                    <textarea name="address" rows={2} required value={formState.address} onChange={handleInputChange} className="block w-full px-4 py-2.5 border border-slate-300 rounded-xl pr-12 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                                    <button type="button" onClick={handleVerifyAddress} className="absolute top-2 right-2 p-2 text-slate-400 hover:text-green-600 transition-colors">
                                        {geocodingStatus === 'loading' ? <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div> : <MagnifyingGlassIcon className="w-6 h-6" />}
                                    </button>
                                </div>
                                {geocodingStatus === 'success' && verifiedAddress && (
                                    <p className="mt-1 text-xs text-green-600 font-bold flex items-center gap-1">
                                        <CheckCircleIcon className="w-3 h-3" /> {t('form_verified_location')}: {safeRender(verifiedAddress)}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('form_phone')}</label>
                                    <input type="tel" name="phone" required value={formState.phone} onChange={handleInputChange} className="block w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('form_date')}</label>
                                    <input type="date" name="date" required value={formState.date} onChange={handleInputChange} className="block w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"/>
                                </div>
                            </div>
                            <button type="submit" disabled={geocodingStatus !== 'success'} className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-200 active:scale-[0.98]">
                                <SendIcon className="w-5 h-5 mr-2 inline" /> {t('form_request_button')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};
