import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { auth } from '@/lib/auth'; // Import auth to trigger initialization

export async function GET() {
    try {
        console.log('Test route hit. Testing better-sqlite3...');
        console.log('Auth instance loaded:', !!auth);
        const db = new Database(':memory:');
        db.exec('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY)');
        console.log('better-sqlite3 initialized successfully');
        return NextResponse.json({ status: 'ok', message: 'API is working', db: 'connected' });
    } catch (error: any) {
        console.error('better-sqlite3 failed:', error);
        return NextResponse.json({ status: 'error', message: 'DB failed', error: error.message }, { status: 500 });
    }
}

export async function POST() {
    return NextResponse.json({ status: 'ok', message: 'POST works' });
}
