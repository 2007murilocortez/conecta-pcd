import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        danger: "var(--danger)",
        warning: "var(--warning)",
        bg: "var(--bg)",
        "neutral-900": "var(--neutral-900)",
        "neutral-600": "var(--neutral-600)",
        "neutral-100": "var(--neutral-100)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["2rem", { lineHeight: "1.5", fontWeight: "700" }],
        h2: ["1.5rem", { lineHeight: "1.5", fontWeight: "700" }],
        h3: ["1.25rem", { lineHeight: "1.5", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["0.875rem", { lineHeight: "1.5", fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};

export default config;
