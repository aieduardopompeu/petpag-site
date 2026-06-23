import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // Pet-Pag design tokens
        bg: "#FAF9F6",
        fg: "#0A2E3D",
        muted: "#EFF3F4",
        accent: "#FF5733",
        amber: "#F5A623",
        teal: "#0A7B7B",
        border: "#0A2E3D",
      },
      fontSize: {
        display: ["clamp(3.5rem,7vw,7rem)", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
      },
      backgroundImage: {
        "swiss-grid":
          "linear-gradient(rgba(10,46,61,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(10,46,61,0.04) 1px,transparent 1px)",
        "swiss-dots":
          "radial-gradient(rgba(10,46,61,0.06) 1.5px,transparent 1.5px)",
        "swiss-diagonal":
          "repeating-linear-gradient(45deg,rgba(10,46,61,0.025) 0,rgba(10,46,61,0.025) 1px,transparent 0,transparent 50%)",
      },
      backgroundSize: {
        "swiss-grid": "24px 24px",
        "swiss-dots": "16px 16px",
        "swiss-diagonal": "10px 10px",
      },
    },
  },
  plugins: [],
};

export default config;
