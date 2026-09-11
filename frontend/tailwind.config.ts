import type { Config } from "tailwindcss";

/**
 * Oppia design tokens (frontend-design/*.json) exposed as Tailwind theme values.
 * Dark-first only — no light theme.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          canvas: "#080A0D",
          surface: "#101318",
          elevated: "#171C23",
          soft: "#202631",
        },
        border: {
          DEFAULT: "#2B323D",
          default: "#2B323D",
          subtle: "#202631",
        },
        text: {
          primary: "#F5F7FA",
          secondary: "#A2ACB9",
          muted: "#697483",
        },
        brand: {
          blue: "#2F80FF",
          cyan: "#58D9FF",
        },
        semantic: {
          success: "#35D39A",
          warning: "#F4C95D",
          danger: "#FF647C",
          info: "#70A7FF",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        display: ["48px", { lineHeight: "1.05", fontWeight: "700" }],
        h1: ["32px", { lineHeight: "1.15", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "1.2", fontWeight: "650" }],
        h3: ["18px", { lineHeight: "1.25", fontWeight: "650" }],
        body: ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.45", fontWeight: "400" }],
        label: ["12px", { lineHeight: "1.2", fontWeight: "600" }],
        data: ["28px", { lineHeight: "1.1", fontWeight: "650" }],
        mono: ["13px", { lineHeight: "1.35", fontWeight: "500" }],
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "24": "96px",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      maxWidth: {
        layout: "1440px",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "220ms",
      },
      transitionTimingFunction: {
        out: "ease-out",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #2368F2 0%, #58D9FF 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
