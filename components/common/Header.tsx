import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../utils/constants";
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
        <TouchableOpacity style={styles.button} onPress={onLocationPress}>
          <Ionicons name="location" size={24} color={Colors.gray.dark} />
        </TouchableOpacity>

        <Text style={styles.title}>{t.appName}</Text>

        <TouchableOpacity style={styles.button} onPress={onMenuPress}>
          <Ionicons name="menu" size={24} color={Colors.gray.dark} />
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    letterSpacing: 1,
  },
});
