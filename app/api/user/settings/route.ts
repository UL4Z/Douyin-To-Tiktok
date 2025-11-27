import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, activityLogs } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email),
            columns: {
                notification_settings: true,
                // Add other settings columns here as needed
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            notifications: user.notification_settings ? JSON.parse(user.notification_settings) : {}
        })
    } catch (error) {
        console.error('Settings fetch error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { notifications } = body

        await db.update(users)
            .set({
                notification_settings: JSON.stringify(notifications),
                updated_at: new Date()
            })
            .where(eq(users.email, session.user.email))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Settings update error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
