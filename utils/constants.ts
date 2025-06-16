export const Colors = {
  primary: "#FF6B35",
  secondary: "#4ECB71",
  background: "#F5F5F5",
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    light: "#F0F0F0",
    medium: "#666666",
    dark: "#333333",
  },
  sports: {
    basketball: "#FF6B35",
    football: "#4ECB71",
  },
  success: "#4ECB71",
  warning: "#FFB800",
  error: "#FF3B30",
};

export const Fonts = {
  // Use Bebas Neue for big, impactful headers (SPLASH! effect)
  splash: "Bebas-Neue",

  // Use Russo One for logo and sporty headers
  logo: "Russo-One",

  // Use Montserrat for clean, modern body text
  regular: "Montserrat-Regular",
  medium: "Montserrat-SemiBold",
  bold: "Montserrat-Bold",

  // System fonts as fallback
  system: "System",
};

export const FontSizes = {
  // Dynamic sizes for sporty feel
  giant: 48, // For big splash headers
  huge: 36, // For impact text
  xxlarge: 28, // For main headers
  xlarge: 24, // For section headers
  large: 20, // For sub-headers
  medium: 16, // For body text
  small: 14, // For secondary text
  xsmall: 12, // For captions
  tiny: 10, // For smallest text
};

export const Shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
};
