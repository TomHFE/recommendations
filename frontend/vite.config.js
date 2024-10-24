import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      all: true, // Ensure that all files are included in coverage, even if not tested
      provider: "istanbul", // default provider, could be 'c8' for newer Node.js
      reporter: ["text", "json", "html"], // specify coverage reporters
      include: ["src/**/*.{js,jsx,ts,tsx}"], // Include all files in src directory
      exclude: ["src/pictures/**", "src/services/getFriends.js", "src/navbar/assets/**", "src/navbar/components/**", "src/components/Friend.jsx", "src/components/Post.jsx", "src/components/goBackButton.jsx", "src/main.jsx", "src/navbar/cleanData.js", "src/pages/Home/**"],        
    },
  },
});
