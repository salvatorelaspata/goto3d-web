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
        palette4: "#FFDDD2",
        palette5: "#E29578",

        // 770a00 // dark:
        // c5838a // dark:
        // f9f0ed // dark:
        // d2f4ff // dark:
        // 78c5e2 // dark:
      },
      fontFamily: {
        body: ["Nunito"],
      },
      backgroundImage: (theme) => ({
        "hero-pattern": "url('/images/hero-pattern.svg')",
        "footer-texture": "url('/images/footer-texture.svg')",
      }),
    },
  },
  plugins: [],
};
