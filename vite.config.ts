/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Production optimizations
  build: {
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for third-party libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI chunk for reusable components
          ui: [
            './src/components/DashboardCard',
            './src/components/VoiceCard',
            './src/components/ProjectCard',
            './src/components/PageHeader',
          ],
        },
      },
    },

    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },

    // Source maps for debugging
    sourcemap: false, // Disable in production for smaller bundle

    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },

  // Development server configuration
  server: {
    port: 5174,
    open: true, // Auto-open browser
    cors: true,
  },

  // Preview server configuration
  preview: {
    port: 4173,
    open: true,
  },

  // Path resolution
  resolve: {
    alias: {
      '@': '/src', // Allow @/ imports
    },
  },

  // CSS configuration
  css: {
    devSourcemap: true, // CSS source maps in development
  },

  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.config.*', 'dist/'],
    },
  },
});
