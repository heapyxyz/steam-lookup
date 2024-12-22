const { nextui } = require("@nextui-org/theme")
/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        default: "rgba(255, 255, 255, 0.5)",
      },
      dropShadow: {
        background: [
          "0 0px 4px rgba(0, 0, 0, 1)",
          "0 0px 20px rgba(0, 0, 0, 1)",
        ],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
