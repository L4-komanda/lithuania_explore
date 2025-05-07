
export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  friends: string[];
}

export interface Race {
  id: string;
  name: string;
  description: string;
  image: string;
  date: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  distance: number;
  participants: string[];
  maxParticipants: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  location: {
    lat: number;
    lng: number;
  };
  adress: string;
  rating: number;
  category: string;
}
export interface RoutePoint {
  attraction: Attraction;
  distanceToPrev: number | null;
  timeByCarToPrev: number | null; 
  timeByFootToPrev: number | null;
}

export interface Route {
  id: string;
  name: string;
  startPoint: string;
  points: RoutePoint[];
  totalDistance: number;
  totalTimeByFoot: number;
  totalTimeByCar: number;
}
