import { Station } from "../types";

export const mockStations: Station[] = [
  {
    id: "1",
    name: "Ataköy 4.Kısım Basketbol Sahası",
    location: {
      latitude: 40.9839,
      longitude: 28.8734,
    },
    address: "Ataköy 4. Kısım, Bakırköy/İstanbul",
    equipment: ["basketball", "football"],
    distance: 2.3,
    operatingHours: {
      open: "09:00",
      close: "22:00",
    },
    pricing: {
      basketball: 50,
      football: 60,
    },
    available: {
      basketball: 3,
      football: 2,
    },
  },
  {
    id: "2",
    name: "Florya Sahil Parkı",
    location: {
      latitude: 40.9756,
      longitude: 28.7892,
    },
    address: "Florya, Bakırköy/İstanbul",
    equipment: ["basketball", "football"],
    distance: 4.1,
    operatingHours: {
      open: "08:00",
      close: "23:00",
    },
    pricing: {
      basketball: 45,
      football: 55,
    },
    available: {
      basketball: 5,
      football: 4,
    },
  },
  {
    id: "3",
    name: "Maçka Demokrasi Parkı",
    location: {
      latitude: 41.0422,
      longitude: 28.9937,
    },
    address: "Maçka, Şişli/İstanbul",
    equipment: ["basketball"],
    distance: 8.5,
    operatingHours: {
      open: "07:00",
      close: "21:00",
    },
    pricing: {
      basketball: 60,
      football: 0,
    },
    available: {
      basketball: 2,
      football: 0,
    },
  },
];
