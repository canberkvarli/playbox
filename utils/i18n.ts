import * as Localization from "expo-localization";

export const translations = {
  tr: {
    // General
    appName: "PLAYBOX",
    search: "Konum ara",
    cancel: "İptal",
    confirm: "Onayla",

    // Map Screen
    findLocation: "Konumumu Bul",
    stations: "İstasyonlar",
    myReservations: "Rezervasyonlarım",
    noStationsFound: "İstasyon bulunamadı",
    tryDifferentLocation: "Farklı bir konum deneyin",
    kmAway: "km uzakta",
    perHour: "/saat",
    available: "Mevcut",

    // Drawer Menu
    map: "Harita",
    profile: "Profil",
    reservations: "Rezervasyonlar",
    safety: "Güvenlik",
    followUs: "Bizi Takip Edin",
    support: "Destek",
    logout: "Çıkış Yap",

    // Auth
    welcomeBack: "Tekrar Hoş Geldiniz",
    phoneNumber: "Telefon Numarası",
    continueText: "Devam Et",
    enterCode: "Kodu Girin",
    resendCode: "Kodu Tekrar Gönder",

    // Equipment
    basketball: "Basketbol",
    football: "Futbol",

    // Reservation
    activeReservation: "Aktif Rezervasyon",
    upcomingReservation: "Yaklaşan Rezervasyon",
    completedReservation: "Tamamlanan Rezervasyon",
    unlock: "Kilidi Aç",
    endRental: "Kiralama Bitir",
    reserveNow: "Şimdi Rezerve Et",
  },
  en: {
    // General
    appName: "PLAYBOX",
    search: "Search location",
    cancel: "Cancel",
    confirm: "Confirm",

    // Map Screen
    findLocation: "Find My Location",
    stations: "Stations",
    myReservations: "My Reservations",
    noStationsFound: "No stations found",
    tryDifferentLocation: "Try a different location",
    kmAway: "km away",
    perHour: "/hour",
    available: "Available",

    // Drawer Menu
    map: "Map",
    profile: "Profile",
    reservations: "Reservations",
    safety: "Safety",
    followUs: "Follow Us",
    support: "Support",
    logout: "Logout",

    // Auth
    welcomeBack: "Welcome Back",
    phoneNumber: "Phone Number",
    continueText: "Continue",
    enterCode: "Enter Code",
    resendCode: "Resend Code",

    // Equipment
    basketball: "Basketball",
    football: "Football",

    // Reservation
    activeReservation: "Active Reservation",
    upcomingReservation: "Upcoming Reservation",
    completedReservation: "Completed Reservation",
    unlock: "Unlock",
    endRental: "End Rental",
    reserveNow: "Reserve Now",
  },
};

const locale = Localization.locale.split("-")[0];
export const t = translations[locale === "tr" ? "tr" : "en"];
