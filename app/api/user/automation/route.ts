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
                automation_enabled: true,
                automation_schedule: true,
                automation_config: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            enabled: user.automation_enabled,
            schedule: user.automation_schedule ? JSON.parse(user.automation_schedule) : [],
            config: user.automation_config ? JSON.parse(user.automation_config) : {}
        })
    } catch (error) {
        console.error('Automation fetch error:', error)
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
        const { enabled, schedule, config } = body

        // Get user ID first
        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email),
            columns: { id: true }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Update user
        await db.update(users)
            .set({
                automation_enabled: enabled,
                automation_schedule: JSON.stringify(schedule),
                automation_config: JSON.stringify(config),
                updated_at: new Date()
            })
            .where(eq(users.email, session.user.email))

        // Log activity
        await db.insert(activityLogs).values({
            user_id: user.id,
            type: 'automation',
            title: 'Automation Settings Updated',
            description: `Automation ${enabled ? 'enabled' : 'disabled'}. Schedule updated.`,
            metadata: JSON.stringify({ enabled, schedule, config })
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Automation update error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
