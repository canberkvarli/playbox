import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Station, Reservation } from "../types";
import { mockStations } from "@/data/mockData";

interface StationContextType {
  stations: Station[];
  reservations: Reservation[];
  loading: boolean;
  selectedStation: Station | null;
  setSelectedStation: (station: Station | null) => void;
  createReservation: (
    stationId: string,
    equipmentType: "basketball" | "football"
  ) => Promise<Reservation>;
  endReservation: (reservationId: string) => Promise<void>;
}

export const StationContext = createContext<StationContextType>(
  {} as StationContextType
);

export function StationProvider({ children }: { children: ReactNode }) {
  const [stations, setStations] = useState<Station[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    // Load mock data - replace with Firebase
    setStations(mockStations);
    setLoading(false);
  }, []);

  const createReservation = async (
    stationId: string,
    equipmentType: "basketball" | "football"
  ): Promise<Reservation> => {
    const station = stations.find((s) => s.id === stationId);
    if (!station) throw new Error("Station not found");

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      userId: "user-123",
      stationId,
      station,
      equipmentType,
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000), // 1 hour
      status: "active",
      price: station.pricing[equipmentType],
      unlockCode: Math.floor(1000 + Math.random() * 9000).toString(),
    };

    setReservations([...reservations, newReservation]);
    return newReservation;
  };

  const endReservation = async (reservationId: string) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.id === reservationId
          ? { ...res, status: "completed", endTime: new Date() }
          : res
      )
    );
  };

  return (
    <StationContext.Provider
      value={{
        stations,
        reservations,
        loading,
        selectedStation,
        setSelectedStation,
        createReservation,
        endReservation,
      }}
    >
      {children}
    </StationContext.Provider>
  );
}

export const useStations = () => useContext(StationContext);
