// types/index.ts - Enhanced with all data fields

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;

  // Profile data
  age?: number;
  profileImage?: string;
  favoriteSports: SportType[];
  interests: string[];

  // Gamification
  level: number;
  experience: number;
  badges: Badge[];
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;

  // Usage statistics
  totalHoursPlayed: number;
  totalActivities: number;
  totalReservations: number;
  favoriteStation?: string;
  lastActiveDate: Date;

  // Preferences
  preferredLanguage: "tr" | "en";
  notifications: NotificationPreferences;

  // Social
  friends: string[]; // user IDs
  referralCode: string;
  referredBy?: string;
}

export interface Station {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  city: string;
  district: string;

  // Station details
  slots: StationSlot[];
  totalSlots: number;
  availableSlots: number;

  // Operating info
  operatingHours: {
    open: string;
    close: string;
    isOpen: boolean;
  };
  isActive: boolean;
  maintenanceSchedule?: Date;

  // Pricing
  pricing: {
    [key in EquipmentType]: {
      perHour: number;
      perDay?: number;
      currency: "TRY";
    };
  };

  // Media
  images: string[];
  coverImage: string;

  // Stats
  rating: number;
  totalRatings: number;
  popularTimes: { [hour: string]: number };

  // Features
  features: StationFeature[];
  nearbyFacilities: string[];

  createdAt: Date;
  updatedAt: Date;
}

export interface StationSlot {
  id: string;
  slotNumber: number; // 1, 2, or 3
  equipment: Equipment | null;
  isAvailable: boolean;
  isLocked: boolean;
  lastMaintenanceDate?: Date;
  condition: "excellent" | "good" | "fair" | "maintenance";
}

export interface Equipment {
  id: string;
  type: EquipmentType;
  brand?: string;
  model?: string;
  condition: "excellent" | "good" | "fair";
  size?: "official" | "youth" | "mini";
  lastCleanedDate: Date;
  totalUsageHours: number;
  qrCode: string;
  nfcTag?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  stationId: string;
  slotId: string;
  equipmentId: string;

  // Reservation details
  equipment: Equipment;
  station: Station;
  slot: StationSlot;

  // Timing
  startTime: Date;
  endTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  duration: number; // in minutes

  // Status
  status: ReservationStatus;

  // Access
  unlockCode: string;
  bluetoothToken?: string;

  // Pricing
  price: number;
  currency: "TRY";
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;

  // Ratings & Feedback
  rating?: number;
  feedback?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  stationId?: string;
  reservationId?: string;

  // Activity details
  sportType: SportType;
  duration: number; // minutes
  caloriesBurned?: number;
  distance?: number; // for running/cycling

  // Social
  withFriends: string[]; // user IDs
  isPublic: boolean;

  // Media
  photos: string[];

  createdAt: Date;
}

// Enums and Types
export type EquipmentType = "basketball" | "football" | "volleyball" | "tennis";
export type SportType = EquipmentType | "running" | "cycling" | "fitness";
export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled"
  | "no_show";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod = "credit_card" | "debit_card" | "wallet" | "cash";
export type ActivityType =
  | "reservation"
  | "free_play"
  | "tournament"
  | "training";
export type StationFeature =
  | "covered"
  | "lighting"
  | "water_fountain"
  | "parking"
  | "changing_room"
  | "security";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  completedAt?: Date;
  reward?: {
    experience: number;
    badge?: Badge;
  };
}

export interface NotificationPreferences {
  reservationReminders: boolean;
  promotions: boolean;
  friendActivities: boolean;
  systemUpdates: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
}
