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
        const { avatar, bio, bio_description, display_name, username } = await req.json()
        const updates: any = {}

        if (avatar !== undefined) updates.avatar_url = avatar
        if (bio !== undefined) updates.bio_description = bio
        if (bio_description !== undefined) updates.bio_description = bio_description
        if (display_name !== undefined) updates.display_name = display_name

        if (username) {
            // Check uniqueness if username is changing
            const existingUser = await db.query.users.findFirst({
                where: eq(users.username, username)
            })

            // If username exists and it's not the current user (we can't easily check current user id here without fetching, 
            // but we can check if the email matches. If email matches, it's the same user, so it's fine.)
            // Actually, findFirst will return the user record. We should check if that record's email is different from session email.

            if (existingUser && existingUser.email !== session.user.email) {
                return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
            }
            updates.username = username
        }

        await db.update(users)
            .set(updates)
            .where(eq(users.email, session.user.email))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
