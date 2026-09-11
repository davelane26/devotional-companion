import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // Automatically match the GitHub repository name in Actions (e.g. 'devotional-companion-app' or 'devotional-companion')
  const repoName = process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/devotional-companion-app/';

  return {
    base: command === 'serve' ? '/' : (process.env.BASE_URL || repoName),
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      allowedHosts: true,
    },
  };
});
