require('dotenv').config({ path: '.env.local' });
const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool);

async function main() {
    console.log('Running migration 0003...');
    const sql = fs.readFileSync(path.join(__dirname, 'drizzle/migrations/0003_add_devices_and_username.sql'), 'utf-8');
    await db.execute(sql);
    console.log('Migration 0003 complete!');
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
