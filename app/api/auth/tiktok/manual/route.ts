import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { code } = body

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 })
        }

        // Exchange code for token (Real implementation)
        // This requires TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET env vars
        const clientKey = process.env.TIKTOK_CLIENT_KEY
        const clientSecret = process.env.TIKTOK_CLIENT_SECRET
        const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`

        if (!clientKey || !clientSecret) {
            console.error('Missing TikTok credentials')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        // Call TikTok API to get access token
        const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            },
            body: new URLSearchParams({
                client_key: clientKey,
                client_secret: clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri
            })
        })

        const tokenData = await tokenRes.json()

        if (tokenData.error) {
            console.error('TikTok Token Error:', tokenData)
            return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 400 })
        }

        // Check if this TikTok account is already linked to another user
        const existingUser = await db.query.users.findFirst({
            where: eq(users.tiktok_open_id, tokenData.open_id)
        })

        if (existingUser && existingUser.email !== session.user.email) {
            console.log('TikTok account already linked to another user. Returning error.')
            return NextResponse.json({
                error: 'This TikTok account is already connected to another user.',
                code: 'TIKTOK_ACCOUNT_ALREADY_LINKED'
            }, { status: 409 })
        }

        // Fetch TikTok User Info
        const userInfoRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        })

        const userInfoData = await userInfoRes.json()
        let updates: any = {
            tiktok_access_token: tokenData.access_token,
            tiktok_refresh_token: tokenData.refresh_token,
            tiktok_expires_in: tokenData.expires_in,
            tiktok_open_id: tokenData.open_id,
            updated_at: new Date()
        }

        if (userInfoData.data && userInfoData.data.user) {
            const { display_name, avatar_url } = userInfoData.data.user
            updates.display_name = display_name
            updates.avatar_url = avatar_url
        } else {
            console.error('Failed to fetch TikTok user info:', userInfoData)
        }

        // Update current user
        await db.update(users)
            .set(updates)
            .where(eq(users.email, session.user.email))

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Manual auth error details:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
