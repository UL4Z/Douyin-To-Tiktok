import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, activityLogs } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

export async function DELETE() {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // In a real app, we might just soft delete or anonymize
        // For now, we'll actually delete the user record
        // But first, we need to delete related records (logs, etc.) if cascade isn't set up

        // Fetch user ID
        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email),
            columns: { id: true }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Delete activity logs first
        await db.delete(activityLogs).where(eq(activityLogs.user_id, user.id))

        // Delete user
        await db.delete(users).where(eq(users.id, user.id))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete account error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
