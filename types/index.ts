export interface Station {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  equipment: EquipmentType[];
  distance?: number;
  operatingHours: {
    open: string;
    close: string;
  };
  pricing: {
    basketball: number;
    football: number;
  };
  imageUrl?: string;
  available: {
    basketball: number;
    football: number;
  };
}

export type EquipmentType = "basketball" | "football";

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  createdAt: Date;
}

export interface Reservation {
  id: string;
  userId: string;
  stationId: string;
  station?: Station;
  equipmentType: EquipmentType;
  startTime: Date;
  endTime: Date;
  status: "active" | "upcoming" | "completed" | "cancelled";
  price: number;
  unlockCode?: string;
}
