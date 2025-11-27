import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  try {
    console.log('Checking POSTGRES_URL...');
    if (!process.env.POSTGRES_URL) {
      console.error('POSTGRES_URL is missing');
      return NextResponse.json({ error: 'POSTGRES_URL is missing from environment variables' }, { status: 500 });
    }

    // Use standard pg Client instead of Vercel SDK to avoid "magic" issues
    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false }, // Vercel Postgres requires SSL
    });

    await client.connect();

    try {
      // 1. Create table if it doesn't exist (basic structure)
      await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

      // 2. Add missing columns (Schema Migration)
      const columns = [
        "ADD COLUMN IF NOT EXISTS email TEXT UNIQUE",
        "ADD COLUMN IF NOT EXISTS name TEXT",
        "ADD COLUMN IF NOT EXISTS image TEXT",
        "ADD COLUMN IF NOT EXISTS tiktok_access_token TEXT",
        "ADD COLUMN IF NOT EXISTS tiktok_refresh_token TEXT",
        "ADD COLUMN IF NOT EXISTS tiktok_expires_in INTEGER",
        "ADD COLUMN IF NOT EXISTS tiktok_open_id TEXT",
        "ADD COLUMN IF NOT EXISTS display_name TEXT",
        "ADD COLUMN IF NOT EXISTS avatar_url TEXT",
        "ADD COLUMN IF NOT EXISTS follower_count INTEGER DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS video_count INTEGER DEFAULT 0",
        "ADD COLUMN IF NOT EXISTS bio_description TEXT",
        "ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE",
        "ADD COLUMN IF NOT EXISTS discord_username TEXT"
      ];

      for (const column of columns) {
        try {
          await client.query(`ALTER TABLE users ${column}`);
        } catch (e) {
          console.log(`Column might already exist or error: ${column}`, e);
        }
      }

      // 3. Verify columns again
      const result = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `);

      return NextResponse.json({
        status: 'success',
        message: 'Database schema migrated successfully',
        columns: result.rows.map(r => r.column_name),
        env_check: process.env.POSTGRES_URL ? 'Defined' : 'Undefined'
      });
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error('Database setup failed:', error);
    // Better error serialization
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : String(error);

    return NextResponse.json({
      error: 'Database setup failed',
      details: errorDetails,
      env_check: process.env.POSTGRES_URL ? 'Defined' : 'Undefined'
    }, { status: 500 });
  }
}
