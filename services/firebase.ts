// services/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
  PhoneAuthProvider,
  ConfirmationResult,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";

// Complete the web browser redirect for Google Sign In
WebBrowser.maybeCompleteAuthSession();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "your-project.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "your-project.appspot.com",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "your-app-id",
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only on web/supported platforms)
let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Firebase collections
export const COLLECTIONS = {
  USERS: "users",
  STATIONS: "stations",
  RESERVATIONS: "reservations",
  ACTIVITIES: "activities",
  EQUIPMENT: "equipment",
  PAYMENTS: "payments",
  RATINGS: "ratings",
} as const;

// Helper functions
export { serverTimestamp, increment, arrayUnion, arrayRemove, Timestamp };

// Firebase service class
class FirebaseService {
  private phoneConfirmationResult: ConfirmationResult | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // Google Sign In configuration
  private googleRequest = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  // Initialize reCAPTCHA for phone auth
  initializeRecaptcha(containerId: string = "recaptcha-container") {
    if (typeof window !== "undefined" && !this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA resolved");
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
            this.recaptchaVerifier = null;
          },
        });
      } catch (error) {
        console.error("reCAPTCHA initialization error:", error);
      }
    }
  }

  // Auth methods
  async signInWithPhone(phoneNumber: string): Promise<string> {
    try {
      // Format phone number for Turkey if needed
      let formattedPhone = phoneNumber;
      if (!formattedPhone.startsWith("+")) {
        if (formattedPhone.startsWith("0")) {
          formattedPhone = "+9" + formattedPhone;
        } else {
          formattedPhone = "+90" + formattedPhone;
        }
      }

      // For web platform
      if (typeof window !== "undefined") {
        if (!this.recaptchaVerifier) {
          this.initializeRecaptcha();
        }

        this.phoneConfirmationResult = await signInWithPhoneNumber(
          auth,
          formattedPhone,
          this.recaptchaVerifier!
        );

        return "web-confirmation";
      } else {
        // For native platforms, we'll need to implement a different approach
        // This could involve sending OTP through your backend
        throw new Error("Phone auth not supported on this platform yet");
      }
    } catch (error) {
      console.error("Phone auth error:", error);
      throw error;
    }
  }

  async verifyPhoneOTP(code: string) {
    try {
      if (!this.phoneConfirmationResult) {
        throw new Error("No phone verification in progress");
      }

      const result = await this.phoneConfirmationResult.confirm(code);
      this.phoneConfirmationResult = null;
      return result;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  }

  // Google Sign In
  async signInWithGoogleProvider() {
    const [request, response, promptAsync] = this.googleRequest;

    try {
      if (response?.type === "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const result = await signInWithCredential(auth, credential);
        return result;
      }

      // Prompt for Google sign in
      const authResponse = await promptAsync();

      if (authResponse?.type === "success") {
        const { id_token } = authResponse.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const result = await signInWithCredential(auth, credential);
        return result;
      }

      throw new Error("Google sign in was cancelled");
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  }

  // Apple Sign In
  async signInWithApple() {
    try {
      const nonce = Math.random().toString(36).substring(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      );

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      const oAuthProvider = new OAuthProvider("apple.com");
      const oAuthCredential = oAuthProvider.credential({
        idToken: credential.identityToken!,
        rawNonce: nonce,
      });

      const result = await signInWithCredential(auth, oAuthCredential);

      // Save additional user info if available
      if (credential.fullName && result.user) {
        const displayName = [
          credential.fullName.givenName,
          credential.fullName.familyName,
        ]
          .filter(Boolean)
          .join(" ");

        if (displayName) {
          await this.updateUserProfile(result.user.uid, { name: displayName });
        }
      }

      return result;
    } catch (error: any) {
      if (error.code === "ERR_REQUEST_CANCELED") {
        throw new Error("Apple sign in was cancelled");
      }
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  // Auth state observer
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // User methods
  async createUserProfile(userId: string, userData: any) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Create user profile error:", error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: any) {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Update user profile error:", error);
      throw error;
    }
  }

  async getUserProfile(userId: string) {
    try {
      const docSnap = await getDoc(doc(db, COLLECTIONS.USERS, userId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          // Convert Firestore timestamps to Date objects
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          lastActiveDate: data.lastActiveDate?.toDate(),
        };
      }
      return null;
    } catch (error) {
      console.error("Get user profile error:", error);
      throw error;
    }
  }

  // Station methods
  async getStations() {
    try {
      const q = query(
        collection(db, COLLECTIONS.STATIONS),
        where("isActive", "==", true)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      });
    } catch (error) {
      console.error("Get stations error:", error);
      throw error;
    }
  }

  async getStation(stationId: string) {
    try {
      const docSnap = await getDoc(doc(db, COLLECTIONS.STATIONS, stationId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      }
      return null;
    } catch (error) {
      console.error("Get station error:", error);
      throw error;
    }
  }

  // Real-time station updates
  subscribeToStation(stationId: string, callback: (station: any) => void) {
    return onSnapshot(doc(db, COLLECTIONS.STATIONS, stationId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        callback({
          id: snapshot.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      }
    });
  }

  // Reservation methods
  async createReservation(reservationData: any) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.RESERVATIONS), {
        ...reservationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update station slot availability
      await this.updateSlotAvailability(
        reservationData.stationId,
        reservationData.slotId,
        false
      );

      // Log activity
      await this.logActivity({
        userId: reservationData.userId,
        type: "reservation",
        stationId: reservationData.stationId,
        reservationId: docRef.id,
        sportType: reservationData.equipment.type,
        duration: reservationData.duration,
      });

      return docRef.id;
    } catch (error) {
      console.error("Create reservation error:", error);
      throw error;
    }
  }

  async updateReservation(reservationId: string, updates: any) {
    try {
      await updateDoc(doc(db, COLLECTIONS.RESERVATIONS, reservationId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Update reservation error:", error);
      throw error;
    }
  }

  async getUserReservations(userId: string) {
    try {
      const q = query(
        collection(db, COLLECTIONS.RESERVATIONS),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate(),
          endTime: data.endTime?.toDate(),
          actualStartTime: data.actualStartTime?.toDate(),
          actualEndTime: data.actualEndTime?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      });
    } catch (error) {
      console.error("Get user reservations error:", error);
      throw error;
    }
  }

  // Activity tracking
  async logActivity(activityData: any) {
    try {
      await addDoc(collection(db, COLLECTIONS.ACTIVITIES), {
        ...activityData,
        createdAt: serverTimestamp(),
      });

      // Update user stats
      await this.updateUserStats(activityData.userId, activityData);
    } catch (error) {
      console.error("Log activity error:", error);
      throw error;
    }
  }

  async updateUserStats(userId: string, activity: any) {
    try {
      const updates: any = {
        totalActivities: increment(1),
        totalHoursPlayed: increment(activity.duration / 60),
        lastActiveDate: serverTimestamp(),
      };

      // Update streak logic would go here
      // For now, just update the basic stats

      await this.updateUserProfile(userId, updates);
    } catch (error) {
      console.error("Update user stats error:", error);
      throw error;
    }
  }

  // Slot management
  async updateSlotAvailability(
    stationId: string,
    slotId: string,
    isAvailable: boolean
  ) {
    try {
      const stationRef = doc(db, COLLECTIONS.STATIONS, stationId);
      const station = await getDoc(stationRef);

      if (station.exists()) {
        const slots = station.data()?.slots || [];
        const updatedSlots = slots.map((slot: any) =>
          slot.id === slotId ? { ...slot, isAvailable } : slot
        );

        const availableSlots = updatedSlots.filter(
          (s: any) => s.isAvailable
        ).length;

        await updateDoc(stationRef, {
          slots: updatedSlots,
          availableSlots,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Update slot availability error:", error);
      throw error;
    }
  }

  // Analytics
  async trackEvent(eventName: string, params?: any) {
    try {
      if (analytics) {
        await logEvent(analytics, eventName, params);
      }
    } catch (error) {
      console.error("Track event error:", error);
    }
  }

  // Storage
  async uploadImage(path: string, uri: string) {
    try {
      // Convert URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error("Upload image error:", error);
      throw error;
    }
  }
}

const firebaseService = new FirebaseService();
export default firebaseService;
