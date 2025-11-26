import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user } from '@/auth-schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        console.log('Test route hit.');

        // Test 1: Drizzle Write
        console.log('Testing Drizzle write...');
        const testId = 'test-' + Date.now();
        await db.insert(user).values({
            id: testId,
            name: 'Test User',
            email: `test-${Date.now()}@example.com`,
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('Drizzle write successful');

        // Test 2: Drizzle Read
        const fetchedUser = await db.select().from(user).where(eq(user.id, testId)).get();
        console.log('Drizzle read successful:', !!fetchedUser);

        // Test 3: Auth Initialization check
        console.log('Auth instance:', !!auth);

        return NextResponse.json({
            status: 'ok',
            message: 'All systems go',
            drizzle: 'working',
            auth_init: 'working'
        });
    } catch (error: any) {
        console.error('Test failed:', error);
        return NextResponse.json({
            status: 'error',
            message: 'System check failed',
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}

export async function POST() {
    return NextResponse.json({ status: 'ok', message: 'POST works' });
}
