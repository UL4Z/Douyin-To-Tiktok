import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth' // Assuming auth.ts exports auth helper or we use getServerSession

// If auth.ts uses next-auth v5
import { auth as getSession } from '@/auth'

export async function GET() {
    try {
        const session = await getSession()

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch user from DB
        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email)
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Map DB fields to ProfileData interface
        return NextResponse.json({
            display_name: user.display_name || user.name || 'User',
            avatar: user.avatar_url || user.image,
            follower_count: user.follower_count || 0,
            following_count: user.following_count || 0,
            likes_count: user.likes_count || 0,
            video_count: user.video_count || 0,
            bio_description: user.bio_description || '',
            is_verified: user.is_verified || false,
            discord_username: user.discord_username,
            is_tiktok_connected: !!user.tiktok_access_token,
            streak: 1 // Mock streak for now, will implement DB tracking later
        })
    } catch (error) {
        console.error('Profile fetch error details:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
