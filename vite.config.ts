import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Define `process.env` as an object containing the API_KEY.
      // This ensures code accessing `process.env.API_KEY` works correctly in the browser.
      'process.env': {
        API_KEY: JSON.stringify(process.env.API_KEY || env.API_KEY)
      },
    },
  };
});