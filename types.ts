
export enum ZoneType {
  RED = 'RED',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN'
}

export interface DisasterZone {
  id: string;
  name: string;
  type: ZoneType;
  coordinates: [number, number];
  radius: number;
  description: string;
  instructions: string[];
}

export interface EmergencyService {
  id: string;
  name: string;
  type: 'Hospital' | 'Shelter' | 'Police';
  distance: string;
  contact: string;
  address: string;
  lat: number;
  lng: number;
}

export interface NewsUpdate {
  id: string;
  title: string;
  timestamp: string;
  category: 'URGENT' | 'UPDATE' | 'ADVISORY';
  content: string;
}

export interface Language {
  code: string;
  name: string;
}
