import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { Colors } from "../../utils/constants";
import { t } from "../../utils/i18n";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface RightDrawerProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: string;
  label: string;
  onPress: () => void;
}

export default function RightDrawer({ visible, onClose }: RightDrawerProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const menuItems: MenuItem[] = [
    {
      icon: "map",
      label: t.map,
      onPress: () => {
        onClose();
      },
    },
    {
      icon: "person",
      label: t.profile,
      onPress: () => {
        onClose();
        router.push("/profile");
      },
    },
    {
      icon: "calendar",
      label: t.reservations,
      onPress: () => {
        onClose();
        router.push("/reservations");
      },
    },
    {
      icon: "shield-checkmark",
      label: t.safety,
      onPress: () => {
        onClose();
        router.push("/safety");
      },
    },
    {
      icon: "logo-instagram",
      label: t.followUs,
      onPress: () => {
        onClose();
        // Open social media
      },
    },
  ];

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.drawer, { paddingTop: insets.top }]}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={Colors.gray.dark} />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color={Colors.white} />
              </View>
              <Text style={styles.userName}>{user?.name || "Kullanıcı"}</Text>
              <Text style={styles.userPhone}>{user?.phone}</Text>
            </View>

            <ScrollView style={styles.menu}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={item.onPress}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={Colors.gray.dark}
                  />
                  <Text style={styles.menuText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.supportButton}>
                <Ionicons
                  name="help-circle"
                  size={24}
                  color={Colors.gray.dark}
                />
                <Text style={styles.menuText}>{t.support}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out" size={24} color={Colors.primary} />
                <Text style={[styles.menuText, { color: Colors.primary }]}>
                  {t.logout}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.8,
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray.dark,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: Colors.gray.medium,
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    color: Colors.gray.dark,
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
