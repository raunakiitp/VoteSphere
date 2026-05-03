import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { GoogleMap, GoogleMarker, GooglePlace, Station } from '@/types';

export function useGoogleMaps(apiKey: string | undefined) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const markersRef = useRef<GoogleMarker[]>([]);

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    const initialMap = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 28.6139, lng: 77.2090 },
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#0b1120' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0b1120' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e2a45' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#04080f' }] },
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      ],
      disableDefaultUI: true,
      zoomControl: true,
    });

    setMap(initialMap);
    setMapReady(true);
  }, []);

  useEffect(() => {
    if (!apiKey || apiKey.includes('your_')) return;

    window.initVoteSphereMap = initMap;

    if (window.google?.maps?.places) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.id = 'gm-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initVoteSphereMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => toast.error('Google Maps failed to load');
    document.head.appendChild(script);

    return () => {
      delete window.initVoteSphereMap;
    };
  }, [apiKey, initMap]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
  }, []);

  const addMarker = useCallback((loc: { lat: number; lng: number }, title: string, icon?: object, onClick?: () => void) => {
    if (!map || !window.google) return null;

    const marker = new window.google.maps.Marker({
      position: loc,
      map,
      title,
      icon,
    });

    if (onClick) {
      marker.addListener('click', onClick);
    }

    markersRef.current.push(marker);
    return marker;
  }, [map]);

  return { mapRef, map, mapReady, clearMarkers, addMarker };
}
