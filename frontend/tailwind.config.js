/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Google Translate inspired palette
        brand: {
          DEFAULT: "#1a73e8",
          hover: "#1765cc",
          light: "#d2e3fc",
          surface: "#e8f0fe",
        },
        ink: {
          DEFAULT: "#202124",
          muted: "#5f6368",
          faint: "#80868b",
        },
        line: "#dadce0",
        hover: "#f1f3f4",
        danger: "#d93025",
        success: "#1e8e3e",
        star: "#fbbc04",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(60,64,67,0.15), 0 4px 8px rgba(60,64,67,0.10)",
        pop: "0 2px 6px rgba(60,64,67,0.2), 0 8px 24px rgba(60,64,67,0.15)",
      },
      borderRadius: {
        xl2: "16px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.15s ease-out",
      },
    },
  },
  plugins: [],
};
