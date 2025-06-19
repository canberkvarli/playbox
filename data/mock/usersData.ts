// mock/users.ts
import { User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Canberk Varli",
    email: "canberk@example.com",
    phone: "+905555555555",
    createdAt: new Date("2024-06-01T10:00:00Z"),
    updatedAt: new Date(),

    // Profile
    age: 29,
    profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
    favoriteSports: ["basketball", "fitness"],
    interests: ["mindfulness", "hiking", "technology"],

    // Gamification
    level: 5,
    experience: 1250,
    badges: [
      {
        id: "badge1",
        name: "First Hoop",
        description: "Completed first basketball session",
        icon: "🏀",
        earnedAt: new Date("2024-06-03T14:00:00Z"),
        rarity: "common",
      },
    ],
    achievements: [
      {
        id: "ach1",
        title: "Play 10 Hours",
        description: "Accumulate 10 hours of activity",
        progress: 10,
        maxProgress: 10,
        isCompleted: true,
        completedAt: new Date("2024-06-10T17:00:00Z"),
        reward: {
          experience: 200,
          badge: {
            id: "badge2",
            name: "10-Hour Champ",
            description: "You played 10 hours!",
            icon: "🔥",
            earnedAt: new Date("2024-06-10T17:00:00Z"),
            rarity: "rare",
          },
        },
      },
    ],
    currentStreak: 4,
    longestStreak: 7,

    // Usage stats
    totalHoursPlayed: 22,
    totalActivities: 18,
    totalReservations: 9,
    favoriteStation: "Ataköy 4.Kısım Basketbol Sahası",
    lastActiveDate: new Date(),

    // Preferences
    preferredLanguage: "tr",
    notifications: {
      reservationReminders: true,
      promotions: false,
      friendActivities: true,
      systemUpdates: true,
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
    },

    // Social
    friends: ["user2", "user3"],
    referralCode: "CBK123",
    referredBy: "user7",
  },
  {
    id: "user2",
    name: "Ayşe Kaya",
    email: "ayse.kaya@example.com",
    phone: "+905532223344",
    createdAt: new Date("2024-05-15T09:30:00Z"),
    updatedAt: new Date(),

    age: 26,
    profileImage: "https://randomuser.me/api/portraits/women/65.jpg",
    favoriteSports: ["running", "cycling"],
    interests: ["yoga", "travel", "music"],

    level: 3,
    experience: 600,
    badges: [],
    achievements: [],
    currentStreak: 2,
    longestStreak: 5,

    totalHoursPlayed: 12,
    totalActivities: 10,
    totalReservations: 4,
    favoriteStation: "Maçka Demokrasi Parkı",
    lastActiveDate: new Date("2025-06-15T19:45:00Z"),

    preferredLanguage: "en",
    notifications: {
      reservationReminders: true,
      promotions: true,
      friendActivities: false,
      systemUpdates: true,
      pushEnabled: false,
      emailEnabled: true,
      smsEnabled: true,
    },

    friends: ["user1"],
    referralCode: "AYS456",
    referredBy: undefined,
  },
];
