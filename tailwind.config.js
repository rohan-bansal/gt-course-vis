/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        lemondays: ["Lemon Days"],
      },
      colors: {
        gt: "#EAAA00",
        gtsecondary: "#F9F6E5",
        gtdark: "#54585A",
      },
    },
  },
  plugins: [],
};
