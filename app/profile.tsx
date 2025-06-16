import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { Colors, Fonts, FontSizes, Shadows } from "../utils/constants";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const stats = [
    {
      icon: "clock-outline",
      label: "Toplam Süre",
      value: "48 saat",
      color: Colors.primary,
    },
    {
      icon: "basketball",
      label: "Aktivite",
      value: "127",
      color: Colors.sports.basketball,
    },
    { icon: "trophy", label: "Başarım", value: "15", color: Colors.warning },
    { icon: "fire", label: "Seri", value: "7 gün", color: Colors.error },
  ];

  const interests = ["Basketbol", "Futbol", "Voleybol", "Tenis"];

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
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity style={styles.editButton}>
          <MaterialCommunityIcons
            name="pencil"
            size={24}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <FontAwesome5 name="user-athlete" size={48} color={Colors.white} />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || "Sporcu"}</Text>
          <Text style={styles.userPhone}>{user?.phone}</Text>

          <View style={styles.levelContainer}>
            <MaterialCommunityIcons
              name="shield-star"
              size={24}
              color={Colors.warning}
            />
            <Text style={styles.levelText}>Seviye 5 - Amatör Sporcu</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <MaterialCommunityIcons
                name={stat.icon as any}
                size={28}
                color={stat.color}
              />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İlgi Alanları</Text>
          <View style={styles.interestsContainer}>
            {interests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Son Başarımlar</Text>
          <View style={styles.achievementsList}>
            <View style={styles.achievementItem}>
              <View
                style={[
                  styles.achievementIcon,
                  { backgroundColor: Colors.warning },
                ]}
              >
                <MaterialCommunityIcons
                  name="trophy"
                  size={24}
                  color={Colors.white}
                />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>
                  Hafta Sonu Savaşçısı
                </Text>
                <Text style={styles.achievementDesc}>
                  7 hafta sonu üst üste spor yaptın!
                </Text>
              </View>
            </View>

            <View style={styles.achievementItem}>
              <View
                style={[
                  styles.achievementIcon,
                  { backgroundColor: Colors.primary },
                ]}
              >
                <MaterialCommunityIcons
                  name="fire"
                  size={24}
                  color={Colors.white}
                />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Ateşli Sporcu</Text>
                <Text style={styles.achievementDesc}>
                  30 gün üst üste aktif kaldın!
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Activity Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktivite Özeti</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              Bu ay <Text style={styles.highlightText}>23 saat</Text> spor
              yaptın!
            </Text>
            <Text style={styles.summarySubtext}>
              Geçen aya göre %15 artış 🎉
            </Text>
          </View>
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
  editButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: FontSizes.large,
    fontFamily: Fonts.bold,
    color: Colors.gray.dark,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    ...Shadows.medium,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
  },
  userName: {
    fontSize: FontSizes.xlarge,
    fontFamily: Fonts.bold,
    color: Colors.gray.dark,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
    marginBottom: 16,
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.gray.light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.medium,
    color: Colors.gray.dark,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    ...Shadows.small,
  },
  statValue: {
    fontSize: FontSizes.large,
    fontFamily: Fonts.bold,
    color: Colors.gray.dark,
    marginTop: 8,
  },
  statLabel: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontFamily: Fonts.bold,
    color: Colors.gray.dark,
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestChip: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontFamily: Fonts.medium,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 12,
    ...Shadows.small,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.bold,
    color: Colors.gray.dark,
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    ...Shadows.small,
  },
  summaryText: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.regular,
    color: Colors.gray.dark,
    marginBottom: 8,
  },
  highlightText: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  summarySubtext: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
  },
});
