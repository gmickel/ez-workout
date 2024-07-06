import { env } from '@/app/env';
import * as schema from '@/models/schema';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleVercel } from 'drizzle-orm/vercel-postgres';
import { Pool } from 'pg';

type DbType = ReturnType<typeof drizzle> | ReturnType<typeof drizzleVercel>;

let db: DbType;
let pool: Pool | undefined;

if (env.NODE_ENV === 'production') {
  db = drizzleVercel(sql, { schema });
} else {
  const connectionString = env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error('POSTGRES_URL; is not set');
  }
  pool = new Pool({ connectionString });
  db = drizzle(pool, { schema });
}

export { db, pool };
export type { DbType };
