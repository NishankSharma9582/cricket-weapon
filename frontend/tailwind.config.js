/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}","./public/index.html"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ED1C24",
          light: "#FF3B43",
          dark: "#B80504",
          deep: "#8B0302",
          ink: "#E30605",
        },
        ink: {
          50:"#fafafa",
          100:"#f1f1f1",
          200:"#E5E7EB",
          300:"#cacaca",
          400:"#8b8b8b",
          500:"#444444",
          600:"#292929",
          700:"#212121",
          800:"#141414",
          900:"#121212",
        },
        paper: "#f8f9fa",
      },
      fontFamily: {
        sans: ["Archivo", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(18,18,18,0.08)",
        glow: "0 10px 40px rgba(237,28,36,0.22)",
        soft: "0 20px 60px rgba(18,18,18,0.10)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};