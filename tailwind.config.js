/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette1: "var(--palette1)",
        palette2: "var(--palette2)",
        palette3: "var(--palette3)",
        palette4: "var(--palette4)",
        palette5: "var(--palette5)",
        g3d: {
          teal: "var(--g3d-teal)",
          "teal-dark": "var(--g3d-teal-dark)",
          "teal-mid": "var(--g3d-teal-mid)",
          "teal-light": "var(--g3d-teal-light)",
          "teal-lighter": "var(--g3d-teal-lighter)",
          coral: "var(--g3d-coral)",
          "coral-hover": "var(--g3d-coral-hover)",
          "coral-light": "var(--g3d-coral-light)",
          bg: "var(--g3d-bg)",
          card: "var(--g3d-card)",
          fg: "var(--g3d-fg)",
          muted: "var(--g3d-muted)",
          border: "var(--g3d-border)",
          neutral: "var(--g3d-neutral)",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)"],
      },
      backgroundImage: (theme) => ({}),
    },
  },
  plugins: [],
};
