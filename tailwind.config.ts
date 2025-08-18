import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "rvr-navy": "#0a1a2f",
        "rvr-navy-dark": "#0f223d",
        "rvr-maroon": "#b22234",
        "rvr-maroon-dark": "#8c1a27",
      },
    },
  },
  plugins: [],
};
export default config;
