import { auth } from "@/auth"
import { db } from "@/lib/db"
import { activityLogs, users } from "@/drizzle/schema"
import { eq, desc } from "drizzle-orm"
import { NextResponse } from "next/server"


export async function GET() {
    const session = await auth()
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email),
            columns: { id: true }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        const logs = await db.query.activityLogs.findMany({
            where: eq(activityLogs.user_id, user.id),
            orderBy: [desc(activityLogs.created_at)],
            limit: 10,
        })

        return NextResponse.json(logs)
    } catch (error) {
        console.error("Failed to fetch activity logs:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
