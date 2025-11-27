import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
    let pool;
    try {
        pool = new Pool({
            connectionString: process.env.POSTGRES_URL,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000,
        });

        const client = await pool.connect();

        try {
            // Check columns
            const result = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'users'
            `);

            // 3. Try to reproduce the update error
            let updateError = null;
            try {
                await client.query('BEGIN');
                await client.query(`
                    UPDATE "users" 
                    SET "tiktok_access_token" = $1, 
                        "tiktok_refresh_token" = $2, 
                        "tiktok_expires_in" = $3, 
                        "tiktok_open_id" = $4, 
                        "updated_at" = $5 
                    WHERE "email" = $6
                `, [
                    'act.AmBs3OwWbi0jgOZmUNbHAzHg8l1PEoxOabWkra0sHbZHqA9CaYW2N3JHWQuk!4973.e1',
                    'rft.pXOtpYu2lyk3Ti0w0ptNv8IEmN1udkICItavAqByflVWpVioOV6V8pRxmSDG!4946.e1',
                    86400,
                    '-000Rki9Mm7iYwgWYWwJVxjnz8RlPMSsT8Jw',
                    new Date().toISOString(),
                    'accraiders@gmail.com'
                ]);
                await client.query('ROLLBACK'); // Don't actually save
            } catch (e) {
                await client.query('ROLLBACK');
                updateError = e instanceof Error ? e.message : String(e);
            }

            return NextResponse.json({
                status: 'success',
                message: 'Debug complete',
                columns: result.rows.map(r => `${r.column_name} (${r.data_type})`),
                update_error: updateError || 'No error during manual update',
                env_check: process.env.POSTGRES_URL ? 'Defined' : 'Undefined',
                api_url: process.env.NEXT_PUBLIC_API_URL
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Debug Schema Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to check schema',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    } finally {
        if (pool) await pool.end();
    }
}
