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
      },
      fontFamily: {
        sans: ["var(--font-poppins)"],
      },
      backgroundImage: (theme) => ({}),
    },
  },
  plugins: [],
};
