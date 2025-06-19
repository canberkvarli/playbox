import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useStations } from "../../contexts/StationContext";
import StationCard from "../station/StationCard";
import ReservationCard from "@/components/reservation/ReservationCard";
import { Colors } from "../../utils/constants";
import { t } from "../../utils/i18n";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function BottomDrawer() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { stations, reservations } = useStations();
  const [activeTab, setActiveTab] = useState<"stations" | "reservations">(
    "stations"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const snapPoints = useMemo(
    () => [120, SCREEN_HEIGHT * 0.5, SCREEN_HEIGHT * 0.9],
    []
  );

  const activeReservations = reservations.filter(
    (r) => r.status === "confirmed" || r.status === "pending"  );

  const handleTabChange = (tab: "stations" | "reservations") => {
    setActiveTab(tab);
    if (tab === "reservations") {
      bottomSheetRef.current?.expand();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.gray.medium} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.search}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "stations" && styles.activeTab]}
            onPress={() => handleTabChange("stations")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "stations" && styles.activeTabText,
              ]}
            >
              {t.stations}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "reservations" && styles.activeTab,
            ]}
            onPress={() => handleTabChange("reservations")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "reservations" && styles.activeTabText,
              ]}
            >
              {t.myReservations}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <BottomSheetScrollView style={styles.content}>
          {activeTab === "stations" ? (
            stations.length > 0 ? (
              stations.map((station) => (
                <StationCard key={station.id} station={station} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>{t.noStationsFound}</Text>
                <Text style={styles.emptySubtext}>
                  {t.tryDifferentLocation}
                </Text>
              </View>
            )
          ) : activeReservations.length > 0 ? (
            activeReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aktif rezervasyonunuz yok</Text>
            </View>
          )}
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: Colors.gray.light,
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray.light,
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.gray.medium,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: Colors.gray.dark,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.gray.medium,
  },
});
