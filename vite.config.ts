import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  base: '/youtube-video-summar/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  build: {
    // Optimize chunk splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // React and core dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI libraries
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-tabs', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot', 'framer-motion'],
          // API and state management
          'api-vendor': ['axios', '@tanstack/react-query'],
          // Utilities
          'utils-vendor': ['clsx', 'date-fns', 'zustand'],
          // Icons and assets
          'icons-vendor': ['lucide-react'],
        }
      }
    }
  }
});
