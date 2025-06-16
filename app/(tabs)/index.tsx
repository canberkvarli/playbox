import React, { useState, useRef, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import MapView from "../../components/map/MapView";
import Header from "../../components/common/Header";
import BottomDrawer from "../../components/map/BottomDrawer";
import RightDrawer from "../../components/drawer/RightDrawer";
import { useLocation } from "../../contexts/LocationContext";

export default function MapScreen() {
  const [rightDrawerVisible, setRightDrawerVisible] = useState(false);
  const mapRef = useRef<any>(null);
  const { userLocation, refreshLocation } = useLocation();

  const handleFindLocation = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      refreshLocation();
    }
  }, [userLocation, refreshLocation]);

  return (
    <View style={styles.container}>
      <Header
        onMenuPress={() => setRightDrawerVisible(true)}
        onLocationPress={handleFindLocation}
      />
      <MapView ref={mapRef} />
      <BottomDrawer />
      <RightDrawer
        visible={rightDrawerVisible}
        onClose={() => setRightDrawerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
