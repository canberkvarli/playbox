import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Fonts, FontSizes, Shadows } from "../utils/constants";
import { useStations } from "../contexts/StationContext";
import ReservationCard from "../components/reservation/ReservationCard";

export default function ReservationsScreen() {
  const router = useRouter();
  const { reservations, endReservation } = useStations();
  const [filter, setFilter] = useState<"all" | "active" | "past">("all");

  const filteredReservations = reservations.filter((reservation) => {
    if (filter === "all") return true;
    if (filter === "active")
      return (
        reservation.status === "active" || reservation.status === "upcoming"
      );
    if (filter === "past")
      return (
        reservation.status === "completed" || reservation.status === "cancelled"
      );
    return true;
  });

  const handleCancelReservation = (reservationId: string) => {
    Alert.alert(
      "Rezervasyonu İptal Et",
      "Bu rezervasyonu iptal etmek istediğinizden emin misiniz?",
      [
        { text: "Hayır", style: "cancel" },
        {
          text: "Evet, İptal Et",
          style: "destructive",
          onPress: () => {
            endReservation(reservationId);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.gray.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rezervasyonlarım</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.activeFilterTab]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.activeFilterText,
            ]}
          >
            Tümü ({reservations.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "active" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("active")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "active" && styles.activeFilterText,
            ]}
          >
            Aktif (
            {
              reservations.filter(
                (r) => r.status === "active" || r.status === "upcoming"
              ).length
            }
            )
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "past" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("past")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "past" && styles.activeFilterText,
            ]}
          >
            Geçmiş (
            {
              reservations.filter(
                (r) => r.status === "completed" || r.status === "cancelled"
              ).length
            }
            )
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <View key={reservation.id} style={styles.reservationWrapper}>
              <ReservationCard reservation={reservation} />
              {(reservation.status === "active" ||
                reservation.status === "upcoming") && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => console.log("Edit reservation")}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={20}
                      color={Colors.primary}
                    />
                    <Text style={styles.buttonText}>Düzenle</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelReservation(reservation.id)}
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={20}
                      color={Colors.error}
                    />
                    <Text style={[styles.buttonText, { color: Colors.error }]}>
                      İptal Et
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="calendar-blank"
              size={80}
              color={Colors.gray.light}
            />
            <Text style={styles.emptyTitle}>Rezervasyon bulunamadı</Text>
            <Text style={styles.emptySubtext}>
              {filter === "active"
                ? "Aktif rezervasyonunuz yok"
                : "Henüz rezervasyon yapmadınız"}
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.createButtonText}>İstasyon Bul</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    ...Shadows.small,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: FontSizes.large,
    fontFamily: Fonts.bold,
    color: Colors.gray.dark,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    marginBottom: 8,
    gap: 12,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.gray.light,
    alignItems: "center",
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.medium,
    color: Colors.gray.dark,
  },
  activeFilterText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  reservationWrapper: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: -8,
    paddingHorizontal: 16,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.error,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: FontSizes.large,
    fontFamily: Fonts.bold,
    color: Colors.gray.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    ...Shadows.small,
  },
  createButtonText: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
});
