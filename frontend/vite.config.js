import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "istanbul", // default provider, could be 'c8' for newer Node.js
      reporter: ["text", "json", "html"], // specify coverage reporters
      // include: ['src/**/*'], // specify files to include, optional
      // exclude: ['node_modules/**'], // specify files to exclude, optional
    },
  },
});
