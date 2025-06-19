import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Colors } from "../../utils/constants";
import { t } from "../../utils/i18n";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

interface RightDrawerProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: any;
  iconType: "ionicons" | "material" | "fontawesome";
  label: string;
  onPress: () => void;
  color?: string;
}

export default function RightDrawer({ visible, onClose }: RightDrawerProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate drawer sliding in from right
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate drawer sliding out to right
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const menuItems: MenuItem[] = [
    {
      icon: "map-marked-alt",
      iconType: "fontawesome",
      label: t.map,
      onPress: () => {
        onClose();
      },
    },
    {
      icon: "account-circle",
      iconType: "material",
      label: t.profile,
      onPress: () => {
        onClose();
        router.push("/profile");
      },
    },
    {
      icon: "calendar-check",
      iconType: "fontawesome",
      label: t.reservations,
      onPress: () => {
        onClose();
        router.push("/reservations");
      },
    },
    {
      icon: "shield-check",
      iconType: "material",
      label: t.safety,
      onPress: () => {
        onClose();
        router.push("/safety");
      },
    },
    {
      icon: "instagram",
      iconType: "fontawesome",
      label: t.followUs,
      color: "#E4405F",
      onPress: () => {
        onClose();
        // Open Instagram
      },
    },
  ];

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  const renderIcon = (item: MenuItem) => {
    const props = {
      name: item.icon,
      size: 24,
      color: item.color || Colors.gray.dark,
    };

    switch (item.iconType) {
      case "material":
        return <MaterialCommunityIcons {...props} />;
      case "fontawesome":
        return <FontAwesome5 {...props} />;
      default:
        return <Ionicons {...props} />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: fadeAnim,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              paddingTop: insets.top,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={Colors.gray.dark} />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <FontAwesome5
                name="user-athlete"
                size={36}
                color={Colors.white}
              />
            </View>
            <Text style={styles.userName}>{user?.name || "Sporcu"}</Text>
            <Text style={styles.userPhone}>{user?.phone}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Saat</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>28</Text>
                <Text style={styles.statLabel}>Aktivite</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Rozet</Text>
              </View>
            </View>
          </View>

          <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  {renderIcon(item)}
                  <Text style={styles.menuText}>{item.label}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.gray.light}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.supportButton}
              onPress={() => console.log("Support tapped")}
            >
              <MaterialCommunityIcons
                name="headset"
                size={24}
                color={Colors.gray.dark}
              />
              <Text style={styles.menuText}>{t.support}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color={Colors.primary}
              />
              <Text style={[styles.menuText, { color: Colors.primary }]}>
                {t.logout}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    padding: 16,
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 8,
  },
  userInfo: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray.dark,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: Colors.gray.medium,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray.medium,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.gray.light,
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    color: Colors.gray.dark,
    fontWeight: "500",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
});
