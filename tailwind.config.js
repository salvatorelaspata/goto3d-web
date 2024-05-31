/** @type {import('tailwindcss').Config} */
module.exports = {
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
        palette1: "#006D77",
        palette2: "#83C5BE",
        palette3: "#EDF6F9",
        // palette4: "#FFDDD2",
        palette5: "#E29578",

        // darkpalette1: "#770A00",
        // darkpalette2: "#C5838A",
        // darkpalette3: "#F9F0ED",
        // darkpalette4: "#D2F4FF",
        // darkpalette5: "#78C5E2",
      },
      fontFamily: {
        sans: ["var(--font-poppins)"],
      },
      backgroundImage: (theme) => ({}),
    },
  },
  plugins: [],
};
