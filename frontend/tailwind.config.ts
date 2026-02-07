import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary-dark': '#121B2D',
        'primary-accent': '#68D4B9',
        // Dynamic accent colors
        'accent': {
          DEFAULT: 'rgb(var(--color-accent-primary))',
          secondary: 'rgb(var(--color-accent-secondary))',
          light: 'rgba(var(--color-accent-primary), 0.1)',
          hover: 'rgba(var(--color-accent-primary), 0.8)',
          border: 'rgba(var(--color-accent-primary), 0.3)',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
