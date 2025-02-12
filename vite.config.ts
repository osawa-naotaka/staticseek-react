import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'lib/index.ts',
      name: 'staticseek-react',
      fileName: 'staticseek-react',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'staticseek'],
    },
    outDir: './dist',
    emptyOutDir: true,  
    copyPublicDir: false,
  },
  plugins: [react(), dts({ tsconfigPath: './tsconfig.app.json', rollupTypes: true })],
})
