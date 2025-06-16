import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Station } from "../../types";
import { Colors } from "../../utils/constants";
import { t } from "../../utils/i18n";

interface StationCardProps {
  station: Station;
}

export default function StationCard({ station }: StationCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/station/${station.id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image
        source={{
          uri: station.imageUrl || "https://via.placeholder.com/80x80",
        }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {station.name}
        </Text>

        <View style={styles.equipment}>
          {station.equipment.includes("basketball") && (
            <View style={styles.equipmentItem}>
              <Ionicons
                name="basketball"
                size={20}
                color={Colors.sports.basketball}
              />
              <Text style={styles.equipmentCount}>
                {station.available.basketball}
              </Text>
            </View>
          )}
          {station.equipment.includes("football") && (
            <View style={styles.equipmentItem}>
              <Ionicons
                name="football"
                size={20}
                color={Colors.sports.football}
              />
              <Text style={styles.equipmentCount}>
                {station.available.football}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.distance}>
          {station.distance?.toFixed(1)} {t.kmAway}
        </Text>

        <Text style={styles.hours}>
          {station.operatingHours.open} - {station.operatingHours.close}
        </Text>

        <View style={styles.pricing}>
          {station.pricing.basketball > 0 && (
            <Text style={styles.price}>
              <Ionicons
                name="basketball"
                size={14}
                color={Colors.sports.basketball}
              />{" "}
              ₺{station.pricing.basketball}
              {t.perHour}
            </Text>
          )}
          {station.pricing.football > 0 && (
            <Text style={[styles.price, { marginLeft: 12 }]}>
              <Ionicons
                name="football"
                size={14}
                color={Colors.sports.football}
              />{" "}
              ₺{station.pricing.football}
              {t.perHour}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: Colors.gray.light,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.gray.dark,
    marginBottom: 4,
  },
  equipment: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  equipmentCount: {
    fontSize: 12,
    color: Colors.gray.medium,
  },
  distance: {
    fontSize: 14,
    color: Colors.gray.medium,
    marginBottom: 2,
  },
  hours: {
    fontSize: 14,
    color: Colors.gray.medium,
    marginBottom: 4,
  },
  pricing: {
    flexDirection: "row",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray.dark,
  },
});
