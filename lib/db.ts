import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { migrate } from 'drizzle-orm/libsql/migrator';
import path from 'path';

// Check if we are in a production environment (Vercel)
const isProduction = process.env.NODE_ENV === 'production';

// Use in-memory DB for production (Vercel) to avoid read-only FS errors
// Use local file for development
const client = createClient({
    url: isProduction ? "file::memory:" : "file:sqlite.db"
});

export const db = drizzle(client);

// Run migrations on startup to ensure tables exist
try {
    const migrationsFolder = path.join(process.cwd(), 'drizzle');
    migrate(db, { migrationsFolder });
    console.log('✅ Database migrations completed successfully');
} catch (error) {
    console.error('❌ Database migration failed:', error);
}
