// contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import {
  useUser,
  useAuth as useClerkAuth,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithPhone: (phone: string) => Promise<{ verificationId?: string }>;
  verifyPhoneCode: (code: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const loadUserProfile = async () => {
      if (clerkUser) {
        try {
          // Get existing user profile from AsyncStorage or create new one
          let userProfile = await getUserProfileFromStorage(clerkUser.id);

          if (!userProfile) {
            // Create new user profile
            const newUserData: User = {
              id: clerkUser.id,
              phone: clerkUser.primaryPhoneNumber?.phoneNumber || "",
              email: clerkUser.primaryEmailAddress?.emailAddress || undefined,
              name: clerkUser.fullName || clerkUser.firstName || "Yeni Sporcu",
              profileImage: clerkUser.imageUrl || undefined,
              createdAt: new Date(),
              updatedAt: new Date(),

              // Initialize gamification
              level: 1,
              experience: 0,
              badges: [],
              achievements: [],
              currentStreak: 0,
              longestStreak: 0,

              // Initialize stats
              totalHoursPlayed: 0,
              totalActivities: 0,
              totalReservations: 0,
              lastActiveDate: new Date(),

              // Initialize preferences
              favoriteSports: [],
              interests: [],
              preferredLanguage: "tr",
              notifications: {
                reservationReminders: true,
                promotions: true,
                friendActivities: true,
                systemUpdates: true,
                pushEnabled: true,
                emailEnabled: false,
                smsEnabled: true,
              },

              // Social
              friends: [],
              referralCode: generateReferralCode(clerkUser.id),
            };

            await saveUserProfileToStorage(clerkUser.id, newUserData);
            userProfile = newUserData;
          }

          setUser(userProfile);
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem("user");
      }

      setLoading(false);
    };

    loadUserProfile();
  }, [clerkUser, isLoaded]);

  const signInWithPhone = async (
    phoneNumber: string
  ): Promise<{ verificationId?: string }> => {
    try {
      setLoading(true);

      const { supportedFirstFactors } = await signIn!.create({
        identifier: phoneNumber,
      });

      const phoneNumberFactor = supportedFirstFactors?.find((factor: any) => {
        return factor.strategy === "phone_code";
      });

      if (phoneNumberFactor) {
        const { phoneNumberId }: any = phoneNumberFactor;
        await signIn!.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });

        return { verificationId: phoneNumberId };
      }

      throw new Error("Phone number authentication not supported");
    } catch (error) {
      console.error("Phone sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneCode = async (code: string) => {
    try {
      setLoading(true);

      const completeSignIn = await signIn!.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });

      if (completeSignIn.status === "complete") {
        await setActive!({ session: completeSignIn.createdSessionId });
      } else {
        throw new Error("Verification failed");
      }
    } catch (error: any) {
      console.error("Code verification error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // Google OAuth will be handled by Clerk's OAuth flow
      // Implementation depends on your OAuth setup in Clerk dashboard
      console.log("Google sign in - implement OAuth flow");
    } catch (error: any) {
      console.error("Google sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setLoading(true);
      // Apple OAuth will be handled by Clerk's OAuth flow
      // Implementation depends on your OAuth setup in Clerk dashboard
      console.log("Apple sign in - implement OAuth flow");
    } catch (error: any) {
      console.error("Apple sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user || !clerkUser) return;

    try {
      // Update Clerk user if needed
      if (updates.name && updates.name !== user.name) {
        await clerkUser.update({
          firstName: updates.name.split(" ")[0],
          lastName: updates.name.split(" ").slice(1).join(" ") || "",
        });
      }

      // Update local user profile
      const updatedUser = { ...user, ...updates, updatedAt: new Date() };
      setUser(updatedUser);
      await saveUserProfileToStorage(user.id, updatedUser);
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await clerkSignOut();
      setUser(null);
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithPhone,
        verifyPhoneCode,
        signInWithGoogle,
        signInWithApple,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Helper functions
async function getUserProfileFromStorage(userId: string): Promise<User | null> {
  try {
    const stored = await AsyncStorage.getItem(`user_${userId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      parsed.createdAt = new Date(parsed.createdAt);
      parsed.updatedAt = new Date(parsed.updatedAt);
      parsed.lastActiveDate = new Date(parsed.lastActiveDate);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Error loading user profile:", error);
    return null;
  }
}

async function saveUserProfileToStorage(
  userId: string,
  user: User
): Promise<void> {
  try {
    await AsyncStorage.setItem(`user_${userId}`, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user profile:", error);
  }
}

function generateReferralCode(userId: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const code =
    userId.substring(0, 3).toUpperCase() +
    Array.from(
      { length: 5 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  return code;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
