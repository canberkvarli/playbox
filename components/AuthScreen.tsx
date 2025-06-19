// components/AuthScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import firebaseService from "../services/firebase";

const AuthScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);

  useEffect(() => {
    checkAppleAvailability();
  }, []);

  const checkAppleAvailability = async () => {
    const available = await AppleAuthentication.isAvailableAsync();
    setIsAppleAvailable(available);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await firebaseService.signInWithGoogleProvider();
      console.log("Google Sign-In Success:", result.user);

      // Navigate to app or show success message
      Alert.alert("Success", "Signed in successfully!");
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Error", error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await firebaseService.signInWithApple();
      console.log("Apple Sign-In Success:", result.user);

      // Navigate to app or show success message
      Alert.alert("Success", "Signed in successfully!");
    } catch (error: any) {
      console.error("Apple Sign-In Error:", error);
      if (error.code !== "ERR_REQUEST_CANCELED") {
        Alert.alert("Error", error.message || "Failed to sign in with Apple");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Playbox</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {/* Google Sign In Button */}
      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Text style={styles.googleButtonText}>
          {isLoading ? "Signing in..." : "Continue with Google"}
        </Text>
      </TouchableOpacity>

      {/* Apple Sign In Button - Only show on iOS */}
      {isAppleAvailable && Platform.OS === "ios" && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={styles.appleButton}
          onPress={handleAppleSignIn}
        />
      )}

      <Text style={styles.terms}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  button: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  googleButton: {
    backgroundColor: "#4285F4",
  },
  googleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  appleButton: {
    width: "100%",
    height: 50,
    marginBottom: 16,
  },
  terms: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default AuthScreen;
