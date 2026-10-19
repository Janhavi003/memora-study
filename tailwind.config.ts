import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "hsl(var(--paper))",
        surface: "hsl(var(--surface))",
        ink: "hsl(var(--ink))",
        slate: "hsl(var(--slate))",
        muted: "hsl(var(--muted))",
        line: "hsl(var(--line))",
        forest: "hsl(var(--forest))",
        sage: "hsl(var(--sage))",
        clay: "hsl(var(--clay))",
        success: "hsl(var(--success))",
        reward: "hsl(var(--reward))",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        display: ["Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        paper: "0 14px 40px rgba(31, 41, 55, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
