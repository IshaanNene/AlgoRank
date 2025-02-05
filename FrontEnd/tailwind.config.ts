import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["'Press Start 2P'", "system-ui"],
      },
      animation: {
        "pixel-bounce": "pixel-bounce 0.5s infinite",
        "pixel-float": "pixel-float 3s ease-in-out infinite",
        "pixel-glow": "pixel-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "pixel-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "pixel-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pixel-glow": {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.2)" },
        },
      },
      colors: {
        // Retro gaming inspired colors
        "pixel-green": "#39ff14",
        "pixel-blue": "#00ffff",
        "pixel-purple": "#ff00ff",
        "pixel-yellow": "#ffff00",
        "pixel-red": "#ff0000",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#1a1a2e",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#39ff14",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#00ffff",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#ff0000",
          foreground: "#000000",
        },
        muted: {
          DEFAULT: "#2a2a4a",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#ff00ff",
          foreground: "#000000",
        },
      },
    },
  },
} satisfies Config

