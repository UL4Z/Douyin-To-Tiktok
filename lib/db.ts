import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'path';

// Check if we are in a production environment (Vercel)
const isProduction = process.env.NODE_ENV === 'production';

// Use in-memory DB for production (Vercel) to avoid read-only FS errors
// Use local file for development
const sqlite = new Database(isProduction ? ':memory:' : 'sqlite.db');

export const db = drizzle(sqlite);

// Run migrations on startup to ensure tables exist
try {
    const migrationsFolder = path.join(process.cwd(), 'drizzle');
    migrate(db, { migrationsFolder });
    console.log('✅ Database migrations completed successfully');
} catch (error) {
    console.error('❌ Database migration failed:', error);
}
