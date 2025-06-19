import { StationSlot } from "@/types";
import { mockEquipment } from "@/data/mock/equipment";

export const mockStationSlots: StationSlot[] = [
  {
    id: "slot1",
    slotNumber: 1,
    equipment: mockEquipment[0],
    isAvailable: true,
    isLocked: false,
    lastMaintenanceDate: new Date("2025-05-20"),
    condition: "excellent",
  },
  {
    id: "slot2",
    slotNumber: 2,
    equipment: mockEquipment[1],
    isAvailable: false,
    isLocked: true,
    condition: "good",
  },
];
