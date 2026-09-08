import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimize React refresh untuk development
      fastRefresh: true,
      // Babel options untuk optimasi
      babel: {
        plugins: [
          // Remove console logs di production
          ...(process.env.NODE_ENV === 'production' ? [['transform-remove-console', { exclude: ['error', 'warn'] }]] : [])
        ]
      }
    })
  ],
  base: process.env.VITE_BASE_PATH || '/',
  
  // Optimasi build
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Code splitting untuk vendor dependencies
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@tiptap')) {
              return 'tiptap';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
          }
        }
      }
    },
    // Enable minification
    minify: true,
    // Source maps untuk debugging
    sourcemap: false,
  },
  
  // Optimasi server dev
  server: {
    // Warm up frequently used files
    warmup: {
      clientFiles: [
        './src/main.jsx',
        './src/App.jsx',
        './src/pages/**/*.jsx',
        './src/components/**/*.jsx',
      ]
    }
  },
  
  // Optimasi dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tiptap/react',
      '@tiptap/core',
      '@tiptap/starter-kit',
      'lucide-react',
      'axios',
    ],
    // Exclude problematic deps
    exclude: []
  }
})
