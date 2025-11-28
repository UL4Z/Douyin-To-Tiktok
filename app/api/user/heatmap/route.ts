import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { botStatistics } from '@/drizzle/schema'
import { sql, gte } from 'drizzle-orm'
import { auth } from '@/auth' // Assuming auth.ts exports auth helper or we use getServerSession
import { auth as getSession } from '@/auth'

export async function GET() {
    try {
        const session = await getSession()

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Calculate date 365 days ago
        const oneYearAgo = new Date()
        oneYearAgo.setDate(oneYearAgo.getDate() - 365)
        const dateString = oneYearAgo.toISOString().split('T')[0]

        // Fetch daily stats for the last year
        // Note: bot_statistics is global for the bot, but we might want to filter by user if the bot supports multi-tenancy in the future.
        // For now, assuming single-user bot or global stats are what we want for the "streak" context if it's a personal dashboard.
        // However, the schema has `bot_statistics` which seems global.
        // If we want per-user streaks, we should look at `activity_logs` or `bot_videos` linked to the user.
        // Looking at schema, `bot_videos` doesn't have a user_id directly, but `tiktok_tokens` does.
        // Wait, `bot_statistics` has `videosPosted`.
        // Let's use `bot_statistics` as planned, assuming it tracks the system's activity which correlates to the user's automation.

        const stats = await db.select({
            date: botStatistics.date,
            count: botStatistics.videosPosted
        })
            .from(botStatistics)
            .where(gte(botStatistics.date, dateString))

        // Format for the heatmap: { date: 'YYYY-MM-DD', count: number }
        const heatmapData = stats.map(stat => ({
            date: stat.date,
            count: stat.count || 0
        }))

        return NextResponse.json(heatmapData)
    } catch (error) {
        console.error('Heatmap fetch error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
