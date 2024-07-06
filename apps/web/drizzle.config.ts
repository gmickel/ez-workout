import { env } from '@/app/env';
import type { Config } from 'drizzle-kit';

if (!env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set');
}

export default {
  dialect: 'postgresql',
  schema: './src/models/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
} satisfies Config;
