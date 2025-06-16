import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Fonts, FontSizes, Shadows } from "../../utils/constants";
import { t } from "../../utils/i18n";

interface HeaderProps {
  onMenuPress: () => void;
  onLocationPress: () => void;
}

export default function Header({ onMenuPress, onLocationPress }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={onLocationPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={24}
              color={Colors.primary}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.logo}>PLAYBOX</Text>
          <View style={styles.logoUnderline} />
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="menu" size={28} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    zIndex: 1000,
    ...Shadows.medium,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationButton: {
    padding: 4,
  },
  menuButton: {
    padding: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray.light,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    fontSize: FontSizes.xxlarge,
    fontFamily: Fonts.logo,
    color: Colors.primary,
    letterSpacing: 2,
    textShadowColor: "rgba(255, 107, 53, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  logoUnderline: {
    width: 60,
    height: 3,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
    marginTop: -2,
  },
});
