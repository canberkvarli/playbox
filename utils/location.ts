import { LocationObject } from "expo-location";

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const sortStationsByDistance = (
  stations: any[],
  userLocation: LocationObject | null
): any[] => {
  if (!userLocation) return stations;

  return stations
    .map((station) => ({
      ...station,
      distance: calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        station.location.latitude,
        station.location.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
};
