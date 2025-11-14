// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        noto: ["Noto Sans", "sans-serif"],
        sans: ["Poppins", "system-ui", "sans-serif"], // Set as default sans font
      },
      colors: {
        primary: "#000000",
        secondary: "#333333",
        accent: "#666666",
        // Background colors
        background: "#FFFFFF",
        cardBackground: "#F5F5F5",
        inputBackground: "#F0F0F0",

        // Text colors
        text: "#000000",
        lightText: "#666666",
        placeholderText: "#999999",

        // Status colors
        success: "#4CAF50",
        warning: "#FFC107",
        error: "#F44336",
        info: "#2196F3",

        // Common colors
        white: "#FFFFFF",
        black: "#000000",
        // gray: "#CCCCCC",
        lightGray: "#EEEEEE",
        darkGray: "#333333",

        // Transparent colors
        transparent: "transparent",
        semiTransparent: "rgba(0, 0, 0, 0.5)",

        // Border colors
        border: "#E0E0E0",

        // Role-specific colors
        owner: "#333333",
        manager: "#666666",
      },
    },
  },
  plugins: [require('tailwindcss-motion'),require('tailwind-scrollbar-hide')], 
};
