import React, { forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useLocation } from "../../contexts/LocationContext";
import { useStations } from "../../contexts/StationContext";
import { Colors } from "../../utils/constants";

const MapComponent = forwardRef<MapView, {}>((props, ref) => {
  const { userLocation } = useLocation();
  const { stations, setSelectedStation } = useStations();

  const initialRegion = {
    latitude: userLocation?.coords.latitude || 41.0082,
    longitude: userLocation?.coords.longitude || 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <MapView
      ref={ref}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton={false}
    >
      {stations.map((station) => (
        <Marker
          key={station.id}
          coordinate={station.location}
          onPress={() => setSelectedStation(station)}
        >
          <View style={styles.markerContainer}>
            <View style={styles.marker}>
              <Ionicons name="basketball" size={20} color={Colors.white} />
            </View>
            <View style={styles.markerTail} />
          </View>
        </Marker>
      ))}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  markerTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: Colors.primary,
    marginTop: -3,
  },
});

export default MapComponent;
