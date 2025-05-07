
import { Race, User, Friend, Attraction } from './types';

// Mock current user
export const currentUser: User = {
  id: 'user-1',
  name: 'Jonas Petraitis',
  avatar: 'https://ui-avatars.com/api/?name=Jonas+Petraitis&background=0D8ABC&color=fff',
  email: 'jonas@example.com',
  friends: ['friend-1', 'friend-2', 'friend-3']
};

export const races: Race[] = [
  {
    id: 'race-1',
    name: 'Vilniaus maratonas',
    description: 'Didžiausias bėgimo renginys Lietuvoje, vykstantis Vilniaus senamiestyje ir apylinkėse.',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1470&auto=format&fit=crop',
    date: '2023-09-10T09:00:00.000Z',
    location: {
      lat: 54.6872,
      lng: 25.2797,
      name: 'Vilnius, Katedros aikštė'
    },
    distance: 42.2,
    participants: ['user-1', 'friend-2'],
    maxParticipants: 5000
  },
  {
    id: 'race-2',
    name: 'Trakų pusmaratonis',
    description: 'Bėgimo renginys istoriniame Trakų mieste, aplink Galvės ežerą.',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1470&auto=format&fit=crop',
    date: '2023-06-04T11:00:00.000Z',
    location: {
      lat: 54.6458,
      lng: 24.9335,
      name: 'Trakai, Pilies sala'
    },
    distance: 21.1,
    participants: ['friend-1'],
    maxParticipants: 2000
  },
  {
    id: 'race-3',
    name: 'Palangos pajūrio bėgimas',
    description: 'Bėgimas Baltijos jūros pakrante, vienas gražiausių bėgimo maršrutų Lietuvoje.',
    image: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?q=80&w=1529&auto=format&fit=crop',
    date: '2023-07-22T10:00:00.000Z',
    location: {
      lat: 55.9175,
      lng: 21.0686,
      name: 'Palanga, Jūros tiltas'
    },
    distance: 10,
    participants: [],
    maxParticipants: 1000
  }
];

export const friends: Friend[] = [
  {
    id: 'friend-1',
    name: 'Marius Kazlauskas',
    avatar: 'https://ui-avatars.com/api/?name=Marius+Kazlauskas&background=4CAF50&color=fff',
    status: 'online'
  },
  {
    id: 'friend-2',
    name: 'Laura Petraitytė',
    avatar: 'https://ui-avatars.com/api/?name=Laura+Petraitytė&background=E91E63&color=fff',
    status: 'offline'
  },
  {
    id: 'friend-3',
    name: 'Tomas Jonaitis',
    avatar: 'https://ui-avatars.com/api/?name=Tomas+Jonaitis&background=FF9800&color=fff',
    status: 'online'
  }
];

export const attractions: Attraction[] = [
  {
    id: 'attraction-1',
    name: 'Gedimino pilis',
    description: 'Gedimino pilis – Vilniaus miesto simbolis, Lietuvos valstybingumo simbolis.',
    image: 'https://www.govilnius.lt/images/5ea6aeeb4a97c4372591f47e?w=750&h=500',
    location: {
      lat: 54.4872,
      lng: 25.8904
    },
    adress: 'Arsenalo g. 5, Vilnius, 01143 Vilniaus m. sav.0',
    rating: 4.8,
    category: 'Istoriniai paminklai'
  },
  {
    id: 'attraction-2',
    name: 'Trakai',
    description: 'Trakų pilis – vienintelė pilis Rytų Europoje, pastatyta ant salos.',
    location: {
      lat: 54.3458, 
      lng: 25.3335
    },
    image: 'https://media-cdn.tripadvisor.com/media/photo-c/1280x250/05/29/78/60/trakai-castle.jpg',
    adress: 'Karaimų g. 43C, Trakai, 21104 Trakų r. sav.',
    rating: 4.9,
    category: 'Istoriniai paminklai'
  },
  {
    id: 'attraction-3',
    name: 'Kryžių kalnas',
    description: 'Kryžių kalnas – unikalus sakralinis paminklas Lietuvoje, garsėjantis daugybe kryžių.',
    image: 'https://www.turistopasaulis.lt/wp-content/uploads/2013/10/kry%C5%BEi%C5%B3-kalnas-01.jpg',
    location: {
      lat: 56.0153,
      lng: 23.4169
    },
    adress:'Jurgaičiai, 81439 Šiaulių r. sav.',
    rating: 4.9,
    category: 'Religinis paveldas'
  },
  {
    id: 'attraction-4',
    name: 'Aukštumalos pelkė',
    description: 'Aukštumalos pelkė – viena didžiausių pelkių Lietuvoje, turinti unikalią ekosistemą.',
    image: 'https://photos.trip.lt/5ccacad3-7f56-4b47-aa88-987929e58713/3840x2160?crop=true',
    location: {
      lat: 55.2747,
      lng: 20.9715
    },
    adress: '99100 Šilutės r. sav.',
    rating: 4.9,
    category: 'Gamtos paminklai'
  },
  {
    id: 'attraction-5',
    name: 'Vilniaus senamiestis',
    description: 'Vilniaus senamiestis – vienas didžiausių ir gražiausių Rytų Europos senamiesčių.',
    image: 'https://m.atostogoskaime.lt/data/gallery/large/3_010.jpg',
    location: {
      lat: 54.3872,
      lng: 25.7904
    },
    adress: 'Vilnius, Vilniaus m. sav.',
    rating: 4.8,
    category: 'Senamiesčiai'
  }
];

