import { Station } from "@/types";
import { mockStationSlots } from "./stationSlots";

export const mockStations: Station[] = [
  {
    id: "station1",
    name: "Ataköy 4.Kısım Basketbol Sahası",
    location: {
      latitude: 40.9839,
      longitude: 28.8734,
    },
    address: "Ataköy 4. Kısım, Bakırköy/İstanbul",
    city: "İstanbul",
    district: "Bakırköy",
    slots: mockStationSlots,
    totalSlots: 3,
    availableSlots: 1,
    operatingHours: {
      open: "08:00",
      close: "22:00",
      isOpen: true,
    },
    isActive: true,
    maintenanceSchedule: new Date("2025-06-25T10:00:00Z"),
    pricing: {
      basketball: {
        perHour: 50,
        perDay: 200,
        currency: "TRY",
      },
      football: {
        perHour: 40,
        perDay: 150,
        currency: "TRY",
      },
      volleyball: {
        perHour: 30,
        perDay: 120,
        currency: "TRY",
      },
      tennis: {
        perHour: 60,
        perDay: 250,
        currency: "TRY",
      },
    },
    images: [
      "https://example.com/station1/img1.jpg",
      "https://example.com/station1/img2.jpg",
    ],
    coverImage: "https://example.com/station1/cover.jpg",
    rating: 4.7,
    totalRatings: 128,
    popularTimes: {
      "08": 10,
      "09": 25,
      "10": 35,
      "11": 50,
      "17": 90,
      "18": 100,
      "19": 95,
    },
    features: ["lighting", "water_fountain", "parking", "security"],
    nearbyFacilities: ["Cafe", "Restrooms", "Metro Station"],
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date(),
  },
  {
    id: "station2",
    name: "Florya Sahil Parkı",
    location: {
      latitude: 40.9756,
      longitude: 28.7892,
    },
    address: "Florya, Bakırköy/İstanbul",
    city: "İstanbul",
    district: "Bakırköy",
    slots: [],
    totalSlots: 5,
    availableSlots: 3,
    operatingHours: {
      open: "08:00",
      close: "23:00",
      isOpen: true,
    },
    isActive: true,
    pricing: {
      basketball: {
        perHour: 45,
        currency: "TRY",
      },
      football: {
        perHour: 55,
        currency: "TRY",
      },
      volleyball: {
        perHour: 0,
        currency: "TRY",
      },
      tennis: {
        perHour: 0,
        currency: "TRY",
      },
    },
    images: ["https://example.com/station2/img1.jpg"],
    coverImage: "https://example.com/station2/cover.jpg",
    rating: 4.4,
    totalRatings: 76,
    popularTimes: {
      "16": 60,
      "17": 80,
      "18": 95,
    },
    features: ["water_fountain", "parking"],
    nearbyFacilities: ["Beach", "Ice Cream Stand", "Bike Rental"],
    createdAt: new Date("2024-03-10T08:30:00Z"),
    updatedAt: new Date(),
  },
];
