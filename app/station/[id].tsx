import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStations } from "../../contexts/StationContext";
import { Colors } from "../../utils/constants";
import { t } from "../../utils/i18n";

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { stations, createReservation } = useStations();

  const station = stations.find((s) => s.id === id);

  if (!station) return null;

  const handleReserve = async (equipmentType: "basketball" | "football") => {
    try {
      await createReservation(station.id, equipmentType);
      router.push("/(tabs)");
    } catch (error) {
      console.error("Reservation error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.gray.dark} />
          </TouchableOpacity>
        </View>

        <Image
          source={{
            uri: station.imageUrl || "https://via.placeholder.com/400x200",
          }}
          style={styles.image}
        />

        <View style={styles.content}>
          <Text style={styles.name}>{station.name}</Text>
          <Text style={styles.address}>{station.address}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={20} color={Colors.gray.medium} />
              <Text style={styles.infoText}>
                {station.operatingHours.open} - {station.operatingHours.close}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={20} color={Colors.gray.medium} />
              <Text style={styles.infoText}>
                {station.distance?.toFixed(1)} {t.kmAway}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>{t.available} Ekipmanlar</Text>

          {station.equipment.includes("basketball") && (
            <View style={styles.equipmentCard}>
              <Ionicons
                name="basketball"
                size={32}
                color={Colors.sports.basketball}
              />
              <View style={styles.equipmentInfo}>
                <Text style={styles.equipmentName}>{t.basketball}</Text>
                <Text style={styles.equipmentPrice}>
                  ₺{station.pricing.basketball}
                  {t.perHour}
                </Text>
                <Text style={styles.equipmentAvailable}>
                  {station.available.basketball} {t.available}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.reserveButton}
                onPress={() => handleReserve("basketball")}
                disabled={station.available.basketball === 0}
              >
                <Text style={styles.reserveButtonText}>{t.reserveNow}</Text>
              </TouchableOpacity>
            </View>
          )}

          {station.equipment.includes("football") && (
            <View style={styles.equipmentCard}>
              <Ionicons
                name="football"
                size={32}
                color={Colors.sports.football}
              />
              <View style={styles.equipmentInfo}>
                <Text style={styles.equipmentName}>{t.football}</Text>
                <Text style={styles.equipmentPrice}>
                  ₺{station.pricing.football}
                  {t.perHour}
                </Text>
                <Text style={styles.equipmentAvailable}>
                  {station.available.football} {t.available}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.reserveButton}
                onPress={() => handleReserve("football")}
                disabled={station.available.football === 0}
              >
                <Text style={styles.reserveButtonText}>{t.reserveNow}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 250,
    backgroundColor: Colors.gray.light,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.gray.dark,
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: Colors.gray.medium,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.gray.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray.dark,
    marginBottom: 16,
  },
  equipmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  equipmentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.gray.dark,
  },
  equipmentPrice: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
  },
  equipmentAvailable: {
    fontSize: 12,
    color: Colors.gray.medium,
    marginTop: 2,
  },
  reserveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reserveButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
});
