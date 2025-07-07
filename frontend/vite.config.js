import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';

// ✅ Pas besoin de path ni __dirname ici

export default defineConfig({
  plugins: [react(), cesium()],
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium'),
  },
});
