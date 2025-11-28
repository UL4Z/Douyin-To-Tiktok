import { auth } from "@/auth"
import { db } from "@/lib/db"
import { devices, users } from "@/drizzle/schema"
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

        const userDevices = await db.query.devices.findMany({
            where: eq(devices.user_id, user.id),
            orderBy: [desc(devices.last_active)],
        })

        return NextResponse.json(userDevices)
    } catch (error) {
        console.error("Failed to fetch devices:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { id } = await req.json()
        if (!id) return new NextResponse("Missing device ID", { status: 400 })

        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email),
            columns: { id: true }
        })

        if (!user) return new NextResponse("User not found", { status: 404 })

        // Verify device belongs to user
        const device = await db.query.devices.findFirst({
            where: eq(devices.id, id),
        })

        if (!device || device.user_id !== user.id) {
            return new NextResponse("Device not found or unauthorized", { status: 404 })
        }

        await db.delete(devices).where(eq(devices.id, id))

        return new NextResponse("Device removed", { status: 200 })
    } catch (error) {
        console.error("Failed to remove device:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
