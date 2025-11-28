import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db } from "@/lib/db"
import { users, activityLogs, devices } from "@/drizzle/schema"
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
                        const newUser = await db.insert(users).values({
                            email,
                            name,
                            image,
                            display_name: name,
                            avatar_url: image,
                        }).returning({ id: users.id })

                        // Log creation
                        await db.insert(activityLogs).values({
                            user_id: newUser[0].id,
                            type: 'security',
                            title: 'Account Created',
                            description: 'User registered via Google',
                        })

                        // Track Device (Initial)
                        await db.insert(devices).values({
                            user_id: newUser[0].id,
                            device_name: 'Web Browser',
                            type: 'desktop',
                            ip_address: '127.0.0.1',
                        })
                    } else {
                        // Update existing user
                        await db.update(users)
                            .set({
                                name,
                                image,
                                avatar_url: image,
                                updated_at: new Date(),
                            })
                            .where(eq(users.email, email))

                        // Log login
                        await db.insert(activityLogs).values({
                            user_id: existingUser.id,
                            type: 'security',
                            title: 'New Login',
                            description: 'User logged in via Google',
                        })

                        // Track Device
                        await db.insert(devices).values({
                            user_id: existingUser.id,
                            device_name: 'Web Browser',
                            type: 'desktop',
                            ip_address: '127.0.0.1',
                        })
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
