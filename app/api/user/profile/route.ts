import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, tiktokProfiles } from '@/drizzle/schema'
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

        // Fetch user from DB with TikTok profile
        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email)
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Fetch TikTok profile separately if relation is not set up in schema query builder
        const tiktokProfile = await db.query.tiktokProfiles.findFirst({
            where: eq(tiktokProfiles.userId, user.id)
        })

        // Map DB fields to ProfileData interface
        return NextResponse.json({
            display_name: user.display_name || user.name || 'User',
            avatar: user.avatar_url || user.image,
            tiktok_avatar: tiktokProfile?.avatarUrl || null,
            follower_count: user.follower_count || 0,
            following_count: user.following_count || 0,
            likes_count: user.likes_count || 0,
            video_count: user.video_count || 0,
            bio_description: user.bio_description || '',
            is_verified: user.is_verified || false,
            discord_username: user.discord_username,
            is_tiktok_connected: !!user.tiktok_access_token,
            streak: user.streak || 0,
            username: user.username
        })
    } catch (error) {
        console.error('Profile fetch error details:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
export async function PATCH(req: Request) {
    const session = await getSession()
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { avatar, bio } = await req.json()
        const updates: any = {}

        if (avatar) updates.avatar_url = avatar
        if (bio) updates.bio_description = bio

        await db.update(users)
            .set(updates)
            .where(eq(users.email, session.user.email))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
