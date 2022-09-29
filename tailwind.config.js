const colors = require("tailwindcss/colors");

module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary1: "#016DB2",
      primary2: "#005499",
      primary3: "#003F80",
      secondary1: "#1192E8",
      bg1: "#F2F4F6",
      bg2: "#F2F4F8",
      bg3: "#F6F6F6",
      bg4: "#FBFBFB",
      bg5: "#B6F1F0",
      green: "#4BB543",
      grey: "#C1C7CD",
      grey2: "#C4C4C4",
      orange: "#F5BB5C",
      lightGrey: "#DDE1E6",
      darkGrey: "#878D96",
      gray: colors.gray,
      text1: "#444444",
      white: colors.white,
      red: colors.red,
      teal: colors.teal,
      blue: colors.blue,
      black: colors.black,
      cyan: colors.cyan,
    },
    extend: {
      boxShadow: {
        primary: "0px 10px 20px rgba(0, 0, 0, 0.05)",
      },
    },
    fontFamily: {
      primary: ["Inter", "ui-serif", "Georgia"],
      secondary: ["Inter", "Roboto", "system-ui"],
    },
    plugins: [],
  },
};
