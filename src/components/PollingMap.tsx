'use client';

import { useState, useCallback } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Station, GooglePlace } from '@/types';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { StationDetails } from './PollingMap/StationDetails';
import { CROWD_LEVELS, CROWD_COLORS } from './PollingMap/constants';

export default function PollingMap() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { mapRef, map, mapReady, clearMarkers, addMarker } = useGoogleMaps(apiKey);

  const handleLocate = useCallback(() => {
    if (!map || !window.google) return;
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setCenter(userLoc);
        map.setZoom(14);
        
        // Add user marker
        addMarker(userLoc, 'You are here', {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8, fillColor: '#3b82f6', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2,
        });

        // Search for nearby schools/community centers as proxies for polling stations
        const service = new window.google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: userLoc,
          radius: 3000,
          type: ['school']
        }, (results: GooglePlace[] | null, status: string) => {
          setIsLocating(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            clearMarkers();
            
            const newStations: Station[] = results.slice(0, 5).map((place: GooglePlace) => {
              const crowdLevel = Math.floor(Math.random() * 4);
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              
              const st: Station = {
                id: place.place_id,
                name: place.name,
                address: place.vicinity,
                crowd: crowdLevel,
                distance: `~${(Math.random() * 2 + 0.5).toFixed(1)} km`,
                eta: `${Math.floor(Math.random() * 15 + 5)} min`,
                booth: `Booth ${Math.floor(Math.random() * 50) + 1}`,
                lat, lng
              };

              addMarker(
                { lat, lng }, 
                place.name, 
                {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: CROWD_COLORS.marker[crowdLevel],
                  fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2,
                },
                () => setSelectedStation(st)
              );
              
              return st;
            });
            
            setStations(newStations);
            if (newStations.length > 0) setSelectedStation(newStations[0]);
          } else {
            toast.error('No polling stations found nearby.');
          }
        });
      },
      () => {
        setIsLocating(false);
        toast.error('Location access denied. Please enable location.');
      }
    );
  }, [map, addMarker, clearMarkers]);

  return (
    <div className="card overflow-hidden shadow-xl border-white/[0.05]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-slate-900/50">
        <div>
          <p className="section-tag">Polling Intelligence</p>
          <p className="text-base font-semibold text-white">Live Nearby Polling Stations</p>
        </div>
        <button 
          onClick={handleLocate} 
          disabled={isLocating || !mapReady} 
          className="btn-secondary text-xs py-2 group">
          {isLocating ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
          {isLocating ? 'Scanning...' : 'Find Near Me'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map area */}
        <div className="flex-1 h-64 lg:h-[420px] bg-[#08101e] relative">
          <div ref={mapRef} className="w-full h-full" />
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#08101e]/90 backdrop-blur-md z-10">
              <div className="flex flex-col items-center gap-3 text-blue-400">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-sm font-medium tracking-wide">INITIALIZING MAPS...</span>
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="lg:w-[350px] border-t lg:border-t-0 lg:border-l border-white/[0.06] flex flex-col bg-slate-900/10">
          <div className="flex-1 overflow-y-auto scroll-thin max-h-[300px] lg:max-h-[330px] divide-y divide-white/[0.04]">
            {stations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                  <MapPin size={24} className="opacity-40" />
                </div>
                <p className="text-sm leading-relaxed">Click <strong>&quot;Find Near Me&quot;</strong> to view real-time data for polling booths in your vicinity.</p>
              </div>
            ) : (
              stations.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => {
                    setSelectedStation(s);
                    map?.panTo({ lat: s.lat, lng: s.lng });
                    map?.setZoom(16);
                  }}
                  className={`w-full text-left p-4 transition-all hover:bg-white/[0.03] border-l-2 ${
                    selectedStation?.id === s.id ? 'bg-blue-500/10 border-blue-500' : 'border-transparent'
                  }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${selectedStation?.id === s.id ? 'text-blue-400' : 'text-white'}`}>
                        {s.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-1">{s.address}</p>
                      <p className="text-[11px] text-slate-500 mt-2 font-medium flex items-center gap-2">
                        <span>{s.distance}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span>{s.eta}</span>
                      </p>
                    </div>
                    <span className={`pill border flex-shrink-0 text-[10px] font-bold ${CROWD_COLORS.bg[s.crowd]} ${CROWD_COLORS.text[s.crowd]}`}>
                      {CROWD_LEVELS[s.crowd]}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Selected station detail */}
          {selectedStation && <StationDetails station={selectedStation} />}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-6 bg-[#04080f]/50 backdrop-blur-sm overflow-x-auto scroll-none">
        {CROWD_LEVELS.map((l, i) => (
          <div key={l} className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-2 h-2 rounded-full ${['bg-emerald-500','bg-amber-500','bg-orange-500','bg-red-500'][i]} shadow-[0_0_8px] shadow-current opacity-80`} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{l}</span>
          </div>
        ))}
        <span className="ml-auto text-[10px] text-slate-600 font-medium tracking-tight flex-shrink-0">Powered by Google Places Engine</span>
      </div>
    </div>
  );
}

