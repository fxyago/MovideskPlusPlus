import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: './dev/ui/',
  plugins: [tailwindcss(), tsconfigPaths(), react()],
  publicDir: resolve(__dirname, 'public'),
});
