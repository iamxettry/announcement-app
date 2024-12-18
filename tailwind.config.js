/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary': '#F5F7FF',
        'secondary':'#059BFF',
        'dark-primary':'#000',
        'dark-secondary':'#0e0e11 ',
        'dark-tertiary':'#3f3f46',
      },
      boxShadow: {
        'custom-all': '0 5px 15px -5px rgba(0, 0, 0, 0.15), 0 -5px 15px -5px rgba(0, 0, 0, 0.15), 5px 0 15px -5px rgba(0, 0, 0, 0.15), -5px 0 15px -5px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
