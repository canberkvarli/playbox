import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { Colors, Fonts, FontSizes, Shadows } from "../../utils/constants";
import { t } from "../../utils/i18n";

export default function VerifyScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const { verifyPhoneCode } = useAuth();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    // Focus first input
    inputRefs.current[0]?.focus();

    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === 5 && newCode.every((digit) => digit)) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      // Focus previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (fullCode?: string) => {
    const verificationCode = fullCode || code.join("");
    if (verificationCode.length !== 6) {
      Alert.alert("Hata", "Lütfen 6 haneli kodu girin");
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      await verifyPhoneCode(verificationCode);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Hata", error.message || "Kod doğrulanamadı");
      // Clear code on error
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timer > 0) return;

    // Reset timer
    setTimer(60);

    try {
      // Re-initiate phone auth
      // await signInWithPhone(phone as string);
      Alert.alert("Başarılı", "Yeni kod gönderildi");
    } catch (error: any) {
      Alert.alert("Hata", "Kod gönderilemedi");
    }
  };

  const formatPhone = (phoneNumber: string) => {
    // Format as +90 5XX XXX XX XX
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.startsWith("90")) {
      return `+90 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(
        8,
        10
      )} ${cleaned.slice(10, 12)}`;
    }
    return phoneNumber;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.gray.dark} />
        </TouchableOpacity>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="phone-portrait" size={60} color={Colors.primary} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Doğrulama Kodu</Text>
        <Text style={styles.subtitle}>
          {formatPhone(phone as string)} numarasına{"\n"}gönderilen 6 haneli
          kodu girin
        </Text>

        {/* Code Input */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref!)}
              style={[
                styles.codeInput,
                digit ? styles.codeInputFilled : {},
                loading && styles.codeInputDisabled,
              ]}
              value={digit}
              onChangeText={(value) => handleCodeChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              editable={!loading}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            code.join("").length !== 6 && styles.buttonDisabled,
          ]}
          onPress={() => handleVerify()}
          disabled={code.join("").length !== 6 || loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.verifyButtonText}>Doğrula</Text>
          )}
        </TouchableOpacity>

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Yeni kod gönder ({timer}s)</Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendText}>Kodu Tekrar Gönder</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Help Text */}
        <Text style={styles.helpText}>
          Kod gelmedi mi? SMS'lerinizi kontrol edin veya{" "}
          <Text style={styles.helpLink}>destek alın</Text>
        </Text>
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
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 8,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray.light,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 24,
    ...Shadows.medium,
  },
  title: {
    fontSize: FontSizes.xxlarge,
    fontFamily: Fonts.bold,
    color: Colors.gray.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  codeContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 32,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: Colors.gray.light,
    borderRadius: 12,
    fontSize: FontSizes.xlarge,
    fontFamily: Fonts.bold,
    textAlign: "center",
    color: Colors.gray.dark,
  },
  codeInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  codeInputDisabled: {
    opacity: 0.5,
  },
  verifyButton: {
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
    ...Shadows.small,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    color: Colors.white,
    fontSize: FontSizes.medium,
    fontFamily: Fonts.bold,
  },
  resendContainer: {
    marginBottom: 24,
  },
  timerText: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
  },
  resendText: {
    fontSize: FontSizes.medium,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  helpText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.regular,
    color: Colors.gray.medium,
    textAlign: "center",
  },
  helpLink: {
    color: Colors.primary,
    fontFamily: Fonts.medium,
    textDecorationLine: "underline",
  },
});
