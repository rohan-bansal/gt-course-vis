/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        lemondays: ["Lemon Days"],
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        mono: ["Space Mono"],
      },
      colors: {
        gt: "#EAAA00",
        gtsecondary: "#F9F6E5",
        gtdark: "#54585A",
        gtbg: "#161716",
        gtblue: "#64CCC9",
        gthorizon: "#E04F39",
        gtlime: "#A4D233",
      },
    },
  },
  plugins: [],
};
