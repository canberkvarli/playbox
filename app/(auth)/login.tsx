// app/(auth)/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOAuth } from "@clerk/clerk-expo";
import { useAuth } from "../../contexts/AuthContext";
import { Colors } from "../../utils/constants";
import { t } from "../../utils/i18n";
import { validatePhoneNumber, formatPhoneNumber } from "../../utils/validation";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

// Warm up web browser for OAuth
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithPhone } = useAuth();
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({
    strategy: "oauth_apple",
  });

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhoneSignIn = async () => {
    if (!validatePhoneNumber(phone)) {
      Alert.alert("Hata", "Geçerli bir telefon numarası girin");
      return;
    }

    setLoading(true);
    try {
      const { verificationId } = await signInWithPhone(phone);
      router.push({
        pathname: "/(auth)/verify",
        params: { verificationId, phone: formatPhoneNumber(phone) },
      });
    } catch (error) {
      console.error("Phone login error:", error);
      Alert.alert("Hata", "Bir hata oluştu, tekrar deneyin");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startGoogleOAuth({
        redirectUrl: Linking.createURL("/(tabs)", { scheme: "playbox" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      Alert.alert("Hata", "Google ile giriş yapılamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startAppleOAuth({
        redirectUrl: Linking.createURL("/(tabs)", { scheme: "playbox" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error("Apple login error:", error);
      Alert.alert("Hata", "Apple ile giriş yapılamadı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>PlayBox</Text>
          <Text style={styles.subtitle}>Spor Ekipmanını Kirala</Text>
        </View>

        {/* SSO Options */}
        <View style={styles.ssoContainer}>
          <TouchableOpacity
            style={[styles.ssoButton, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={20} color={Colors.white} />
            <Text style={styles.ssoButtonText}>Google ile Devam Et</Text>
          </TouchableOpacity>

          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={[styles.ssoButton, styles.appleButton]}
              onPress={handleAppleSignIn}
              disabled={loading}
            >
              <Ionicons name="logo-apple" size={20} color={Colors.white} />
              <Text style={styles.ssoButtonText}>Apple ile Devam Et</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>veya</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Phone Auth */}
        <View style={styles.form}>
          <Text style={styles.label}>Telefon Numarası</Text>
          <TextInput
            style={styles.input}
            placeholder="+90 5XX XXX XX XX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoFocus={false}
          />

          <TouchableOpacity
            style={[
              styles.button,
              (!validatePhoneNumber(phone) || loading) && styles.buttonDisabled,
            ]}
            onPress={handlePhoneSignIn}
            disabled={!validatePhoneNumber(phone) || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Gönderiliyor..." : "Devam Et"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Devam ederek <Text style={styles.linkText}>Kullanım Şartları</Text>{" "}
            ve <Text style={styles.linkText}>Gizlilik Politikası</Text>'nı kabul
            etmiş olursunuz.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.gray.medium,
  },
  ssoContainer: {
    marginBottom: 20,
    gap: 12,
  },
  ssoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  googleButton: {
    backgroundColor: "#4285F4",
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  ssoButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray.light,
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.gray.medium,
    fontSize: 14,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: Colors.gray.dark,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: Colors.gray.medium,
    textAlign: "center",
    lineHeight: 18,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
