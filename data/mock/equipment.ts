import { Equipment } from "@/types";

export const mockEquipment: Equipment[] = [
  {
    id: "eq1",
    type: "basketball",
    brand: "Spalding",
    model: "NBA Official",
    condition: "excellent",
    size: "official",
    lastCleanedDate: new Date("2025-06-14T12:00:00Z"),
    totalUsageHours: 80,
    qrCode: "QR-EQ1-ABC123",
    nfcTag: "NFC-EQ1-001",
  },
  {
    id: "eq2",
    type: "football",
    condition: "good",
    lastCleanedDate: new Date("2025-06-10T09:00:00Z"),
    totalUsageHours: 40,
    qrCode: "QR-EQ2-DEF456",
  },
];
