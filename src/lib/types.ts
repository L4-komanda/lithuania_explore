
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
  rating: number;
  category: string;
}

