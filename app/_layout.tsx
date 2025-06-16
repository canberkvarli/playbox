import { useEffect } from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { LocationProvider } from "../contexts/LocationContext";
import { StationProvider } from "../contexts/StationContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { View, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Colors } from "../utils/constants";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
          ...MaterialCommunityIcons.font,
          ...FontAwesome5.font,
          // Custom fonts for dynamic sports feel
          // Add these font files to assets/fonts/ directory
          "Bebas-Neue": require("../assets/fonts/BebasNeue-Regular.ttf"),
          "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
          "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
          "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
          "Russo-One": require("../assets/fonts/RussoOne-Regular.ttf"),
        });
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.primary,
        }}
      >
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <LocationProvider>
          <StationProvider>
            <StatusBar style="dark" />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="station/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="profile" options={{ headerShown: false }} />
              <Stack.Screen
                name="reservations"
                options={{ headerShown: false }}
              />
              {/* <Stack.Screen name="safety" options={{ headerShown: false }} /> */}
            </Stack>
          </StationProvider>
        </LocationProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
