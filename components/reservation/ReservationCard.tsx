import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Reservation } from "../../types";
import { Colors, Fonts, FontSizes } from "../../utils/constants";
import { t } from "../../utils/i18n";

interface ReservationCardProps {
  reservation: Reservation;
}

export default function ReservationCard({ reservation }: ReservationCardProps) {
  const isActive = reservation.status === "active";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.statusBadge, isActive && styles.activeBadge]}>
          <Text style={styles.statusText}>
            {isActive ? t.activeReservation : t.upcomingReservation}
          </Text>
        </View>
        <Text style={styles.time}>
          {new Date(reservation.startTime).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <Text style={styles.stationName}>{reservation.station?.name}</Text>

      <View style={styles.equipmentRow}>
        <MaterialCommunityIcons
          name={
            reservation.equipment.type === "basketball"
              ? "basketball"
              : "soccer"
          }
          size={24}
          color={
            Colors.sports[
              reservation.equipment.type as keyof typeof Colors.sports
            ] || Colors.gray.medium
          }
        />
        <Text style={styles.equipmentText}>
          {t[reservation.equipment.type as keyof typeof t] ||
            reservation.equipment.type}
        </Text>
      </View>

      {isActive && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.unlockButton}>
            <Ionicons name="lock-open" size={20} color={Colors.white} />
            <Text style={styles.unlockText}>{t.unlock}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endButton}>
            <Text style={styles.endText}>{t.endRental}</Text>
          </TouchableOpacity>
        </View>
      )}

      {reservation.unlockCode && (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Kilit Kodu:</Text>
          <Text style={styles.code}>{reservation.unlockCode}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.gray.light,
  },
  activeBadge: {
    backgroundColor: Colors.secondary,
  },
  statusText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  time: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
  },
  stationName: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.bold,
    color: Colors.gray.dark,
    marginBottom: 8,
  },
  equipmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  equipmentText: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.regular,
    color: Colors.gray.dark,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  unlockButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  unlockText: {
    color: Colors.white,
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
  },
  endButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  endText: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.gray.light,
    borderRadius: 8,
  },
  codeLabel: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
  },
  code: {
    fontSize: FontSizes.large,
    fontFamily: Fonts.bold,
    color: Colors.gray.dark,
    letterSpacing: 2,
  },
});
