import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { username } = await req.json()

        // Basic validation
        if (!username || username.length < 3 || username.length > 20) {
            return NextResponse.json({ error: "Username must be between 3 and 20 characters" }, { status: 400 })
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return NextResponse.json({ error: "Username can only contain letters, numbers, and underscores" }, { status: 400 })
        }

        // Check uniqueness
        const existing = await db.query.users.findFirst({
            where: eq(users.username, username)
        })

        if (existing) {
            return NextResponse.json({ error: "Username already taken" }, { status: 409 })
        }

        await db.update(users)
            .set({ username })
            .where(eq(users.email, session.user.email))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to update username:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
