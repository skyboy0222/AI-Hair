import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Prioritize VITE_API_KEY (Vercel standard) -> API_KEY -> Process Env fallback
  const apiKey = env.VITE_API_KEY || env.API_KEY || process.env.VITE_API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Safely define process.env.API_KEY global for the browser
      // JSON.stringify is crucial here to turn the value into a string literal
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});