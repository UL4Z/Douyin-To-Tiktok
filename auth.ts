import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db } from "@/lib/db"
import { users } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    const { email, name, image } = user
                    if (!email) return false

                    // Check if user exists
                    const existingUser = await db.query.users.findFirst({
                        where: eq(users.email, email),
                    })

                    if (!existingUser) {
                        // Create new user
                        await db.insert(users).values({
                            email,
                            name,
                            image,
                            display_name: name,
                            avatar_url: image,
                        })
                    } else {
                        // Update existing user (optional, keeps info fresh)
                        await db.update(users)
                            .set({
                                name,
                                image,
                                avatar_url: image, // Keep avatar synced with Google
                                updated_at: new Date(),
                            })
                            .where(eq(users.email, email))
                    }
                    return true
                } catch (error) {
                    console.error("Error syncing user to DB:", error)
                    return false
                }
            }
            return true
        },
    },
    pages: {
        signIn: "/login",
    },
    debug: process.env.NODE_ENV === "development",
})
