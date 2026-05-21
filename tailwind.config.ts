import tailwindcssAnimate from "tailwindcss-animate";
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Space Mono", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#7c6af7",
          foreground: "#ffffff",
          glow: "rgba(124,106,247,0.25)",
        },
        secondary: {
          DEFAULT: "#222222",
          foreground: "#ffffff",
        },
        // Custom accent tokens — prefixed to avoid clashing with Tailwind built-ins (amber-400 etc.)
        "accent-teal": {
          DEFAULT: "#3ecfb3",
          foreground: "#080c14",
        },
        "accent-amber": {
          DEFAULT: "#e8a44a",
          foreground: "#080c14",
        },
        "accent-rose": {
          DEFAULT: "#f06b8b",
          foreground: "#080c14",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#1a1f2e",
          foreground: "#687081",
        },
        accent: {
          DEFAULT: "#111827",
          foreground: "#ffffff",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        typing: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
        },
        "marquee-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "orb-drift": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(20px, -15px) scale(1.04)" },
        },
        "scan-line": {
          "0%": { top: "-10%" },
          "100%": { top: "110%" },
        },
        "grid-shift": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "48px 48px" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-in-left": "slide-in-left 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        typing: "typing 3.5s steps(40, end), blink .75s step-end infinite",
        "marquee-left": "marquee-left 32s linear infinite",
        "marquee-right": "marquee-right 28s linear infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        float: "float 6s ease-in-out infinite",
        "orb-drift": "orb-drift 10s ease-in-out infinite alternate",
        "scan-line": "scan-line 3s linear infinite",
        "grid-shift": "grid-shift 20s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
