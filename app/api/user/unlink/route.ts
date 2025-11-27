import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, activityLogs } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

export async function POST() {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email),
            columns: { id: true }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Clear TikTok data
        await db.update(users)
            .set({
                tiktok_access_token: null,
                tiktok_refresh_token: null,
                tiktok_expires_in: null,
                tiktok_open_id: null,
                is_verified: false,
                updated_at: new Date()
            })
            .where(eq(users.email, session.user.email))

        // Log activity
        await db.insert(activityLogs).values({
            user_id: user.id,
            type: 'security',
            title: 'TikTok Account Unlinked',
            description: 'User manually unlinked their TikTok account.',
            metadata: JSON.stringify({ action: 'unlink' })
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Unlink error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
