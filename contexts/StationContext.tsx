// contexts/StationContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Station, Reservation, StationSlot } from '../types';
import firebaseService from '../services/firebase';
import { useAuth } from './AuthContext';
import { useLocation } from './LocationContext';
import { calculateDistance } from '../utils/location';

interface StationContextType {
  stations: Station[];
  reservations: Reservation[];
  loading: boolean;
  selectedStation: Station | null;
  selectedSlot: StationSlot | null;
  setSelectedStation: (station: Station | null) => void;
  setSelectedSlot: (slot: StationSlot | null) => void;
  createReservation: (stationId: string, slotId: string, duration: number) => Promise<string>;
  updateReservation: (reservationId: string, updates: Partial<Reservation>) => Promise<void>;
  cancelReservation: (reservationId: string) => Promise<void>;
  endReservation: (reservationId: string) => Promise<void>;
  refreshStations: () => Promise<void>;
  refreshReservations: () => Promise<void>;
  getNearestStation: () => Station | null;
}

export const StationContext = createContext<StationContextType>({} as StationContextType);

export function StationProvider({ children }: { children: ReactNode }) {
  const [stations, setStations] = useState<Station[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<StationSlot | null>(null);
  
  const { user } = useAuth();
  const { userLocation } = useLocation();

  // Load stations on mount
  useEffect(() => {
    loadStations();
  }, [userLocation]);

  // Load user reservations when user changes
  useEffect(() => {
    if (user) {
      loadUserReservations();
    } else {
      setReservations([]);
    }
  }, [user]);

  // Subscribe to selected station updates
  useEffect(() => {
    if (!selectedStation) return;

    const unsubscribe = firebaseService.subscribeToStation(
      selectedStation.id,
      (updatedStation) => {
        setSelectedStation(updatedStation as Station);
        
        // Update station in list
        setStations(prev => 
          prev.map(s => s.id === updatedStation.id ? updatedStation as Station : s)
        );
      }
    );

    return () => unsubscribe();
  }, [selectedStation?.id]);

  const loadStations = async () => {
    try {
      setLoading(true);
      const stationData = await firebaseService.getStations();
      
      // Calculate distances if user location available
      let processedStations = stationData as Station[];
      if (userLocation) {
        processedStations = stationData.map(station => ({
          ...station,
          distance: calculateDistance(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            station.location.latitude,
            station.location.longitude
          ),
        })) as Station[];
        
        // Sort by distance
        processedStations.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }
      
      setStations(processedStations);
      
      // Track event
      await FirebaseService.trackEvent('stations_loaded', {
        count: processedStations.length,
        hasLocation: !!userLocation,
      });
    } catch (error) {
      console.error('Load stations error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserReservations = async () => {
    if (!user) return;
    
    try {
      const userReservations = await FirebaseService.getUserReservations(user.id);
      
      // Fetch station and equipment details for each reservation
      const enrichedReservations = await Promise.all(
        userReservations.map(async (res) => {
          const station = await FirebaseService.getStation(res.stationId);
          return {
            ...res,
            station,
          } as Reservation;
        })
      );
      
      setReservations(enrichedReservations);
    } catch (error) {
      console.error('Load reservations error:', error);
    }
  };

  const createReservation = async (
    stationId: string, 
    slotId: string, 
    duration: number
  ): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    const station = stations.find(s => s.id === stationId);
    if (!station) throw new Error('Station not found');
    
    const slot = station.slots.find(s => s.id === slotId);
    if (!slot || !slot.equipment) throw new Error('Slot or equipment not found');
    
    try {
      const reservationData = {
        userId: user.id,
        stationId,
        slotId,
        equipmentId: slot.equipment.id,
        equipment: slot.equipment,
        station,
        slot,
        startTime: new Date(),
        endTime: new Date(Date.now() + duration * 60 * 1000),
        duration,
        status: 'confirmed',
        unlockCode: generateUnlockCode(),
        price: calculatePrice(station, slot.equipment.type, duration),
        currency: 'TRY',
        paymentStatus: 'pending',
      };
      
      const reservationId = await FirebaseService.createReservation(reservationData);
      
      // Refresh data
      await Promise.all([
        loadStations(),
        loadUserReservations(),
      ]);
      
      // Track event
      await FirebaseService.trackEvent('reservation_created', {
        stationId,
        slotId,
        equipmentType: slot.equipment.type,
        duration,
        price: reservationData.price,
      });
      
      return reservationId;
    } catch (error) {
      console.error('Create reservation error:', error);
      throw error;
    }
  };

  const updateReservation = async (
    reservationId: string, 
    updates: Partial<Reservation>
  ) => {
    try {
      await FirebaseService.updateReservation(reservationId, updates);
      await loadUserReservations();
      
      // Track event
      await FirebaseService.trackEvent('reservation_updated', {
        reservationId,
        updates: Object.keys(updates),
      });
    } catch (error) {
      console.error('Update reservation error:', error);
      throw error;
    }
  };

  const cancelReservation = async (reservationId: string) => {
    try {
      await FirebaseService.updateReservation(reservationId, {
        status: 'cancelled',
        actualEndTime: new Date(),
      });
      
      // Get reservation to update slot availability
      const reservation = reservations.find(r => r.id === reservationId);
      if (reservation) {
        await FirebaseService.updateSlotAvailability(
          reservation.stationId,
          reservation.slotId,
          true
        );
      }
      
      await loadUserReservations();
      
      // Track event
      await FirebaseService.trackEvent('reservation_cancelled', {
        reservationId,
      });
    } catch (error) {
      console.error('Cancel reservation error:', error);
      throw error;
    }
  };

  const endReservation = async (reservationId: string) => {
    try {
      const now = new Date();
      await FirebaseService.updateReservation(reservationId, {
        status: 'completed',
        actualEndTime: now,
      });
      
      // Get reservation to update slot availability
      const reservation = reservations.find(r => r.id === reservationId);
      if (reservation) {
        await FirebaseService.updateSlotAvailability(
          reservation.stationId,
          reservation.slotId,
          true
        );
        
        // Calculate actual duration
        const actualDuration = Math.round(
          (now.getTime() - reservation.startTime.getTime()) / (1000 * 60)
        );
        
        // Log activity
        await FirebaseService.logActivity({
          userId: reservation.userId,
          type: 'reservation',
          stationId: reservation.stationId,
          reservationId: reservation.id,
          sportType: reservation.equipment.type,
          duration: actualDuration,
        });
      }
      
      await loadUserReservations();
      
      // Track event
      await FirebaseService.trackEvent('reservation_completed', {
        reservationId,
      });
    } catch (error) {
      console.error('End reservation error:', error);
      throw error;
    }
  };

  const refreshStations = async () => {
    await loadStations();
  };

  const refreshReservations = async () => {
    await loadUserReservations();
  };

  const getNearestStation = (): Station | null => {
    if (stations.length === 0) return null;
    return stations[0]; // Already sorted by distance
  };

  return (
    <StationContext.Provider
      value={{
        stations,
        reservations,
        loading,
        selectedStation,
        selectedSlot,
        setSelectedStation,
        setSelectedSlot,
        createReservation,
        updateReservation,
        cancelReservation,
        endReservation,
        refreshStations,
        refreshReservations,
        getNearestStation,
      }}
    >
      {children}
    </StationContext.Provider>
  );
}

// Helper functions
function generateUnlockCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function calculatePrice(station: Station, equipmentType: string, duration: number): number {
  const hourlyRate = station.pricing[equipmentType]?.perHour || 0;
  const hours = duration / 60;
  return Math.ceil(hourlyRate * hours);
}

export const useStations = () => {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error('useStations must be used within StationProvider');
  }
  return context;
};