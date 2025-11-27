import { NextResponse } from 'next/server'

export async function GET() {
    const clientKey = process.env.TIKTOK_CLIENT_KEY
    const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`
    const scope = 'user.info.basic,video.list,video.upload'
    const state = Math.random().toString(36).substring(7) // Simple state for now

    const url = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`

    return NextResponse.redirect(url)
}
