
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { analyzeLocationByCoordinates, geocodeLocation, getCityHealthSnapshot } from '../services/geminiService';
import type { LocationAnalysisResult, Facility, CityHealthSnapshot } from '../types';
import { LocationReport } from './LocationReport';
import { CityHealthReport } from './CityHealthReport';
import { MagnifyingGlassIcon, CloseIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';
import { majorCities, City } from '../data/cities';
import { BackButton } from './BackButton';
import { useI18n } from './I18n';

// Helper to prevent React Error #31 (objects as children)
const safeText = (val: any): string => {
    if (typeof val === 'string') return val;
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') return val.name || val.address || JSON.stringify(val);
    return String(val);
};

export const GlobePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [locationAnalysis, setLocationAnalysis] = useState<{ result: LocationAnalysisResult, imageUrl: string | null } | null>(null);
  const [citySnapshot, setCitySnapshot] = useState<CityHealthSnapshot | null>(null);
  const [analysisType, setAnalysisType] = useState<'location' | 'city' | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const globeEl = useRef<any>(null);

  const [globeDimensions, setGlobeDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState<any | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const [panelTitle, setPanelTitle] = useState<string>('Analysis');
  const [facilityPoints, setFacilityPoints] = useState<any[]>([]);
  const { language } = useI18n();

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setGlobeDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    const timer = setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isGlobeReady && globeEl.current) {
      globeEl.current.pointOfView({ altitude: 2.5 }, 1000);
    }
  }, [isGlobeReady]);
  
  const openPanel = (title: string) => {
    setPanelTitle(safeText(title));
    setIsPanelOpen(true);
    setIsLoading(true);
    setError(null);
    setLocationAnalysis(null);
    setCitySnapshot(null);
    setFacilityPoints([]); 
  };

  const startLocationAnalysis = useCallback(async (lat: number, lng: number, locationName?: string) => {
    if (isLoading) return;
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat, lng, altitude: 0.4 }, 2000);
    }
    setClickedCoords({ lat, lng });
    setAnalysisType('location');
    openPanel(locationName || 'Location Analysis');
    try {
      const { analysis, imageUrl } = await analyzeLocationByCoordinates(lat, lng, language, locationName);
      setLocationAnalysis({ result: analysis, imageUrl: imageUrl });
      setPanelTitle(safeText(analysis.locationName));
    } catch (err) {
      setError('Failed to analyze. Model busy.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, language]);

  const startCityAnalysis = useCallback(async (city: City) => {
    if (isLoading) return;
    if (globeEl.current) {
        globeEl.current.pointOfView({ lat: city.lat, lng: city.lng, altitude: 0.4 }, 2000);
    }
    setClickedCoords({ lat: city.lat, lng: city.lng });
    setAnalysisType('city');
    openPanel(`Health Snapshot: ${city.name}`);
    try {
        const snapshot = await getCityHealthSnapshot(city.name, city.country, language);
        setCitySnapshot(snapshot);
    } catch (err) {
        setError('Failed to generate snapshot.');
    } finally {
        setIsLoading(false);
    }
  }, [isLoading, language]);

  const handleGlobeClick = useCallback(({ lat, lng }: { lat: number, lng: number }) => {
    startLocationAnalysis(lat, lng);
  }, [startLocationAnalysis]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    setSearchError(null);
    try {
        const { lat, lng, foundLocationName } = await geocodeLocation(searchQuery);
        startLocationAnalysis(lat, lng, foundLocationName);
    } catch (err) {
        setSearchError("Location not found.");
    } finally {
        setIsSearching(false);
    }
  };
  
  const closePanel = () => {
      setIsPanelOpen(false);
      setSearchQuery('');
      setSearchError(null);
      setAnalysisType(null);
      setClickedCoords(null);
      setFacilityPoints([]);
      if (globeEl.current) {
          const currentPos = globeEl.current.pointOfView();
          globeEl.current.pointOfView({ ...currentPos, altitude: Math.max(currentPos.altitude, 1.5) }, 1500);
      }
  }

  const handleFacilitiesFound = (facilities: Omit<Facility, 'distance'>[]) => {
      if (clickedCoords && facilities.length > 0 && globeEl.current) {
          globeEl.current.pointOfView({ lat: clickedCoords.lat, lng: clickedCoords.lng, altitude: 0.15 }, 2000); 
          const points = facilities.map(f => ({
              lat: f.lat,
              lng: f.lng,
              name: f.name,
              color: f.type === 'Hospital' ? '#ef4444' : (f.type === 'Clinic' ? '#f97316' : '#22c55e')
          }));
          setFacilityPoints(points);
      }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-screen overflow-hidden bg-black animate-fade-in">
      {globeDimensions.width > 0 && (
          <Globe
            ref={globeEl}
            width={globeDimensions.width}
            height={globeDimensions.height}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            globeTileEngineUrl={(x: number, y: number, z: number) => 
                `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`
            }
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            onGlobeClick={handleGlobeClick}
            atmosphereColor="lightblue"
            atmosphereAltitude={0.25}
            onGlobeReady={() => setIsGlobeReady(true)}
            ringsData={[]}
            pointsData={facilityPoints}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointAltitude={0.02}
            pointRadius={0.4}
            pointLabel="name"
            labelsData={majorCities}
            labelLat="lat"
            labelLng="lng"
            labelText="name"
            labelSize={(d: any) => d === hoveredLabel ? 1.0 : 0.6}
            labelDotRadius={0}
            labelColor={(d: any) => d === hoveredLabel ? 'rgba(255, 215, 0, 1)' : 'rgba(255, 255, 255, 0.8)'}
            labelAltitude={0.01}
            onLabelClick={(label: any) => startCityAnalysis(label as City)}
            onLabelHover={(label: any) => {
                setHoveredLabel(label);
                if (containerRef.current) containerRef.current.style.cursor = label ? 'pointer' : 'default';
            }}
          />
      )}

      <div className={`absolute top-4 left-4 right-4 flex items-center gap-2 sm:gap-4 transition-opacity duration-500 z-20 ${isPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <BackButton onClick={onBack} className="bg-white/80 backdrop-blur-md flex-shrink-0" />
        <div className="flex-grow min-w-0">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search a location..."
              className="w-full pl-4 pr-12 py-3 bg-white/80 backdrop-blur-md border border-slate-300/50 rounded-full shadow-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={isSearching}
            />
            <button type="submit" className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
              {isSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <MagnifyingGlassIcon className="w-5 h-5" />}
            </button>
          </form>
          {searchError && <p className="text-center text-sm text-red-400 mt-2 bg-black/50 p-2 rounded-md">{searchError}</p>}
        </div>
      </div>

      <div className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white/80 backdrop-blur-md shadow-2xl transition-transform duration-500 z-30 ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 p-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800 truncate pr-2">{safeText(panelTitle)}</h2>
                <button onClick={closePanel} className="p-2 rounded-full hover:bg-slate-200">
                    <CloseIcon className="w-6 h-6 text-slate-600" />
                </button>
            </div>
            <div className="flex-grow overflow-y-auto">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-slate-600 font-semibold">{analysisType === 'city' ? 'Generating Health Snapshot...' : 'Analyzing Location forensic data...'}</p>
                    </div>
                )}
                {error && <div className="bg-red-50 text-red-700 p-4 m-4 rounded">{error}</div>}
                {locationAnalysis && analysisType === 'location' && clickedCoords && <LocationReport result={locationAnalysis.result} imageUrl={locationAnalysis.imageUrl} coords={clickedCoords} onFacilitiesFound={handleFacilitiesFound} />}
                {citySnapshot && analysisType === 'city' && <CityHealthReport snapshot={citySnapshot} />}
            </div>
        </div>
      </div>

      <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 transition-opacity duration-500 z-10 ${isPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="bg-white/80 backdrop-blur-md py-2 px-4 rounded-full shadow-lg">
              <p className="text-sm text-slate-700 font-medium">Click on the globe or a city to begin analysis.</p>
          </div>
      </div>
    </div>
  );
};
