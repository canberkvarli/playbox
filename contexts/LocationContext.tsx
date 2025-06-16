import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import * as Location from "expo-location";

interface LocationContextType {
  userLocation: Location.LocationObject | null;
  locationError: string | null;
  refreshLocation: () => Promise<void>;
}

export const LocationContext = createContext<LocationContextType>(
  {} as LocationContextType
);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Konum izni reddedildi");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    } catch (error) {
      setLocationError("Konum alınamadı");
    }
  };

  const refreshLocation = async () => {
    await requestLocationPermission();
  };

  return (
    <LocationContext.Provider
      value={{ userLocation, locationError, refreshLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
