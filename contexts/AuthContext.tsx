import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithPhone: (phone: string) => Promise<{ verificationId: string }>;
  verifyCode: (verificationId: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phone: string) => {
    // Mock implementation - will be replaced with Firebase
    console.log("Mock: Sending verification code to:", phone);

    // For testing, automatically sign in after a delay
    setTimeout(() => {
      const mockUser: User = {
        id: "mock-user-123",
        name: "Test Kullanıcı",
        phone: phone,
        createdAt: new Date(),
      };
      setUser(mockUser);
      AsyncStorage.setItem("user", JSON.stringify(mockUser));
    }, 1000);

    return { verificationId: "mock-verification-id" };
  };

  const verifyCode = async (verificationId: string, code: string) => {
    // Mock implementation
    console.log("Mock: Verifying code:", code);

    // For testing, accept any 6-digit code
    if (code.length === 6) {
      const mockUser: User = {
        id: "user-123",
        name: "Test Kullanıcı",
        phone: "+905551234567",
        createdAt: new Date(),
      };

      setUser(mockUser);
      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
    } else {
      throw new Error("Invalid code");
    }
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithPhone, verifyCode, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
