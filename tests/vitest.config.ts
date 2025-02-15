import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,           // Enable global test functions like `test`, `expect`
    environment: 'jsdom',    // Simulate the browser environment
    setupFiles: './setup.ts', // Register setup.ts globally
    coverage: {
      reporter: ['text', 'json', 'html'], // Generate coverage reports
    },
  },
});
