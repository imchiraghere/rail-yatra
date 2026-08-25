export type TimeMode = 'golden_hour' | 'monsoon' | 'midnight' | 'morning';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  genre: string;
  coverColor: string;
  mood: string;
  lyricsSnippet: string;
  audioKey: string;
}

export interface AmbientSettings {
  masterVolume: number;
  trainRhythm: number; // 0 to 1
  trainSpeed: 'slow' | 'medium' | 'fast';
  fanHum: number; // 0 to 1
  fanSpeed: 'off' | 'slow' | 'medium' | 'fast';
  windBreeze: number; // 0 to 1
  chaiVendor: number; // 0 to 1
  rainIntensity: number; // 0 to 1
  locoHornEnabled: boolean;
}

export interface StationStop {
  code: string;
  name: string;
  nameHindi: string;
  distanceKm: number;
  scheduledArrival: string;
  platform: string;
  haltMins: number;
  state: string;
  specialty: string;
}

export interface JourneyInfo {
  trainNumber: string;
  trainName: string;
  trainNameHindi: string;
  origin: string;
  destination: string;
  totalDistanceKm: number;
  currentKm: number;
  speedKmh: number;
  currentStationIndex: number;
  coachNumber: string;
  seatNumber: string;
}
