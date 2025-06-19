import { Reservation } from "@/types";
import { mockEquipment } from "@/data/mock/equipment";
import { mockStationSlots } from "@/data/mock/stationSlots";
import { mockStations } from "@/data/mock/stations";

export const mockReservations: Reservation[] = [
  {
    id: "res1",
    userId: "user1",
    stationId: mockStations[0].id,
    slotId: mockStationSlots[0].id,
    equipmentId: mockEquipment[0].id,
    equipment: mockEquipment[0],
    station: mockStations[0],
    slot: mockStationSlots[0],
    startTime: new Date("2025-06-15T14:00:00Z"),
    endTime: new Date("2025-06-15T15:00:00Z"),
    actualStartTime: new Date("2025-06-15T14:05:00Z"),
    actualEndTime: new Date("2025-06-15T15:00:00Z"),
    duration: 60,
    status: "completed",
    unlockCode: "UNLOCK123",
    bluetoothToken: "BLUETOOTH-TOKEN-XYZ",
    price: 50,
    currency: "TRY",
    paymentStatus: "completed",
    paymentMethod: "credit_card",
    rating: 5,
    feedback: "Great court and smooth experience!",
    createdAt: new Date("2025-06-14T18:00:00Z"),
    updatedAt: new Date("2025-06-15T15:30:00Z"),
  },
];
