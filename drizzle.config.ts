import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './spartan-analog/src/server/db/schema.ts',
  out: './spartan-analog/src/server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['DATABASE_URL']!,
  },
});
