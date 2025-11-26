import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';

// Check if we are in a production environment (Vercel)
const isProduction = process.env.NODE_ENV === 'production';

// Use in-memory DB for production (Vercel) to avoid read-only FS errors
// Use local file for development
const sqlite = new Database(isProduction ? ':memory:' : 'sqlite.db');

export const db = drizzle(sqlite);

// Manual migration for in-memory DB on Vercel
// This ensures tables exist even if migration files are missing in the bundle
const runMigrations = () => {
    try {
        console.log('Running manual DB migrations...');

        // User table
        sqlite.exec(`
            CREATE TABLE IF NOT EXISTS "user" (
                "id" text PRIMARY KEY NOT NULL,
                "name" text NOT NULL,
                "email" text NOT NULL UNIQUE,
                "email_verified" integer DEFAULT 0 NOT NULL,
                "image" text,
                "created_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
                "updated_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
            );
        `);

        // Session table
        sqlite.exec(`
            CREATE TABLE IF NOT EXISTS "session" (
                "id" text PRIMARY KEY NOT NULL,
                "expires_at" integer NOT NULL,
                "token" text NOT NULL UNIQUE,
                "created_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
                "updated_at" integer NOT NULL,
                "ip_address" text,
                "user_agent" text,
                "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
            );
        `);
        sqlite.exec(`CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("user_id");`);

        // Account table
        sqlite.exec(`
            CREATE TABLE IF NOT EXISTS "account" (
                "id" text PRIMARY KEY NOT NULL,
                "account_id" text NOT NULL,
                "provider_id" text NOT NULL,
                "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
                "access_token" text,
                "refresh_token" text,
                "id_token" text,
                "access_token_expires_at" integer,
                "refresh_token_expires_at" integer,
                "scope" text,
                "password" text,
                "created_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
                "updated_at" integer NOT NULL
            );
        `);
        sqlite.exec(`CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" ("user_id");`);

        // Verification table
        sqlite.exec(`
            CREATE TABLE IF NOT EXISTS "verification" (
                "id" text PRIMARY KEY NOT NULL,
                "identifier" text NOT NULL,
                "value" text NOT NULL,
                "expires_at" integer NOT NULL,
                "created_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
                "updated_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
            );
        `);
        sqlite.exec(`CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier");`);

        console.log('✅ Manual DB migrations completed successfully');
    } catch (error) {
        console.error('❌ Manual DB migration failed:', error);
    }
};

runMigrations();
