export type JourneyStage = 'awareness' | 'eligibility' | 'preparation' | 'participation' | 'followup';
export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  age?: number;
  region?: string;
  voterId?: string;
  isAdmin?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: Language;
}

export interface JourneyProgress {
  awareness: boolean;
  eligibility: boolean;
  preparation: boolean;
  participation: boolean;
  followup: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: Date;
}

export interface EligibilityResult {
  eligible: boolean;
  probability: number;
  reasons: string[];
}

export interface Station {
  id: string;
  name: string;
  address: string;
  crowd: number;
  distance: string;
  eta: string;
  booth: string;
  lat: number;
  lng: number;
}

// Google Maps Types
export interface GoogleMap {
  setCenter: (loc: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  panTo: (loc: { lat: number; lng: number }) => void;
}

export interface GoogleMarker {
  setMap: (map: GoogleMap | null) => void;
  addListener: (event: string, cb: () => void) => void;
}

export interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

declare global {
  interface Window {
    initVoteSphereMap?: () => void;
    google: {
      maps: {
        Map: new (el: HTMLElement, opt: object) => GoogleMap;
        Marker: new (opt: object) => GoogleMarker;
        SymbolPath: { CIRCLE: number };
        places: {
          PlacesService: new (map: GoogleMap) => {
            nearbySearch: (opt: object, cb: (res: GooglePlace[] | null, status: string) => void) => void;
          };
          PlacesServiceStatus: { OK: string };
        };
      };
    };
  }
}

