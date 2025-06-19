import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useStations } from "../../contexts/StationContext";
import { Colors, Fonts, FontSizes, Shadows } from "../../utils/constants";
import { t } from "../../utils/i18n";
import { StationSlot } from "../../types";

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { stations, selectedSlot, setSelectedSlot, createReservation } =
    useStations();
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [isReserving, setIsReserving] = useState(false);

  const station = stations.find((s) => s.id === id);

  if (!station) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const handleSlotSelect = (slot: StationSlot) => {
    if (slot.isAvailable && slot.equipment) {
      setSelectedSlot(slot);
    }
  };

  const handleReserve = async () => {
    if (!selectedSlot) return;

    setIsReserving(true);
    try {
      await createReservation(station.id, selectedSlot.id, selectedDuration);
      router.push("/(tabs)");
    } catch (error) {
      console.error("Reservation error:", error);
    } finally {
      setIsReserving(false);
    }
  };

  const durations = [
    { label: "30 dk", value: 30 },
    { label: "1 saat", value: 60 },
    { label: "2 saat", value: 120 },
    { label: "3 saat", value: 180 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Image
            source={{
              uri: station.coverImage || "https://via.placeholder.com/400x250",
            }}
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
            <Text style={styles.name}>{station.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{station.rating.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({station.totalRatings})</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.address}>{station.address}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color={Colors.gray.medium}
              />
              <Text style={styles.infoText}>
                {station.operatingHours.open} - {station.operatingHours.close}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color={Colors.gray.medium}
              />
              <Text style={styles.infoText}>
                {(station as any).distance?.toFixed(1)} km
              </Text>
            </View>
          </View>

          {/* Slot Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ekipman Seç</Text>
            <View style={styles.slotsContainer}>
              {station.slots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.slotCard,
                    !slot.isAvailable && styles.slotUnavailable,
                    selectedSlot?.id === slot.id && styles.slotSelected,
                  ]}
                  onPress={() => handleSlotSelect(slot)}
                  disabled={!slot.isAvailable || !slot.equipment}
                >
                  <View style={styles.slotNumber}>
                    <Text style={styles.slotNumberText}>{slot.slotNumber}</Text>
                  </View>

                  {slot.equipment ? (
                    <>
                      <MaterialCommunityIcons
                        name={
                          slot.equipment.type === "basketball"
                            ? "basketball"
                            : "soccer"
                        }
                        size={40}
                        color={
                          slot.isAvailable ? Colors.primary : Colors.gray.light
                        }
                      />
                      <Text style={styles.slotEquipmentName}>
                        {t[slot.equipment.type as keyof typeof t] ||
                          slot.equipment.type}
                      </Text>
                      <Text style={styles.slotStatus}>
                        {slot.isAvailable ? "Müsait" : "Dolu"}
                      </Text>
                      {slot.isAvailable && (
                        <Text style={styles.slotPrice}>
                          ₺
                          {
                            station.pricing[
                              slot.equipment
                                .type as keyof typeof station.pricing
                            ]?.perHour
                          }
                          /saat
                        </Text>
                      )}
                    </>
                  ) : (
                    <View style={styles.emptySlot}>
                      <MaterialCommunityIcons
                        name="lock"
                        size={32}
                        color={Colors.gray.light}
                      />
                      <Text style={styles.emptySlotText}>Boş</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration Selection */}
          {selectedSlot && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Süre Seç</Text>
              <View style={styles.durationsContainer}>
                {durations.map((duration) => (
                  <TouchableOpacity
                    key={duration.value}
                    style={[
                      styles.durationButton,
                      selectedDuration === duration.value &&
                        styles.durationButtonActive,
                    ]}
                    onPress={() => setSelectedDuration(duration.value)}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        selectedDuration === duration.value &&
                          styles.durationTextActive,
                      ]}
                    >
                      {duration.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.priceInfo}>
                <Text style={styles.priceLabel}>Toplam Tutar:</Text>
                <Text style={styles.priceValue}>
                  ₺
                  {(
                    ((station.pricing[
                      selectedSlot.equipment!
                        .type as keyof typeof station.pricing
                    ]?.perHour || 0) *
                      selectedDuration) /
                    60
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Özellikler</Text>
            <View style={styles.featuresGrid}>
              {station.features.map((feature) => (
                <View key={feature} style={styles.featureItem}>
                  <MaterialCommunityIcons
                    name={getFeatureIcon(feature)}
                    size={20}
                    color={Colors.primary}
                  />
                  <Text style={styles.featureText}>
                    {getFeatureName(feature)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Reserve Button */}
      {selectedSlot && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.reserveButton, isReserving && styles.buttonDisabled]}
            onPress={handleReserve}
            disabled={isReserving}
          >
            {isReserving ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="lock-open"
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.reserveButtonText}>Rezerve Et</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
function getFeatureIcon(feature: string): any {
  const icons: { [key: string]: string } = {
    covered: "weather-sunny-off",
    lighting: "lightbulb",
    water_fountain: "water",
    parking: "car",
    changing_room: "hanger",
    security: "shield-check",
  };
  return icons[feature] || "check";
}

function getFeatureName(feature: string): string {
  const names: { [key: string]: string } = {
    covered: "Kapalı Alan",
    lighting: "Aydınlatma",
    water_fountain: "Su",
    parking: "Otopark",
    changing_room: "Soyunma Odası",
    security: "Güvenlik",
  };
  return names[feature] || feature;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 250,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 20,
  },
  headerContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  name: {
    fontSize: FontSizes.xxlarge,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  ratingCount: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    padding: 16,
  },
  address: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.regular,
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
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontFamily: Fonts.bold,
    color: Colors.gray.dark,
    marginBottom: 16,
  },
  slotsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  slotCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.gray.light,
    ...Shadows.small,
  },
  slotUnavailable: {
    opacity: 0.6,
    backgroundColor: Colors.gray.light,
  },
  slotSelected: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  slotNumber: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gray.light,
    alignItems: "center",
    justifyContent: "center",
  },
  slotNumberText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.bold,
    color: Colors.gray.dark,
  },
  slotEquipmentName: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.medium,
    color: Colors.gray.dark,
    marginTop: 8,
  },
  slotStatus: {
    fontSize: FontSizes.xsmall,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
    marginTop: 4,
  },
  slotPrice: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginTop: 4,
  },
  emptySlot: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptySlotText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
    marginTop: 8,
  },
  durationsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.gray.light,
    alignItems: "center",
  },
  durationButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  durationText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.medium,
    color: Colors.gray.dark,
  },
  durationTextActive: {
    color: Colors.white,
  },
  priceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  priceLabel: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.regular,
    color: Colors.gray.dark,
  },
  priceValue: {
    fontSize: FontSizes.xlarge,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "45%",
  },
  featureText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.gray.dark,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: 16,
    ...Shadows.large,
  },
  reserveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    ...Shadows.medium,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  reserveButtonText: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
});
