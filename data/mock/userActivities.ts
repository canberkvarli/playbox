import { UserActivity } from "@/types";

export const mockUserActivities: UserActivity[] = [
  {
    id: "act1",
    userId: "user1",
    type: "free_play",
    sportType: "basketball",
    duration: 60,
    stationId: "1",
    caloriesBurned: 550,
    distance: undefined,
    reservationId: undefined,
    withFriends: ["user2"],
    isPublic: true,
    photos: ["https://example.com/activity1.jpg"],
    createdAt: new Date("2025-06-12T17:00:00Z"),
  },
  {
    id: "act2",
    userId: "user1",
    type: "reservation",
    sportType: "basketball",
    duration: 45,
    reservationId: "res1",
    stationId: "1",
    caloriesBurned: 420,
    distance: undefined,
    withFriends: [],
    isPublic: false,
    photos: [],
    createdAt: new Date("2025-06-15T14:00:00Z"),
  },
];
