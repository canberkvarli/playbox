import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { Colors } from "../../utils/constants";
import { t } from "../../utils/i18n";

export default function VerifyScreen() {
  const router = useRouter();
  const { verificationId, phone } = useLocalSearchParams();
  const { verifyCode } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) return;

    setLoading(true);
    try {
      await verifyCode(verificationId as string, code);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.enterCode}</Text>
          <Text style={styles.subtitle}>
            {phone} numarasına gönderilen kodu girin
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="000000"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.button, code.length !== 6 && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={code.length !== 6 || loading}
          >
            <Text style={styles.buttonText}>{t.confirm}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendText}>{t.resendCode}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.gray.dark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray.medium,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 10,
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
  resendButton: {
    marginTop: 20,
    alignItems: "center",
  },
  resendText: {
    color: Colors.primary,
    fontSize: 16,
  },
});
