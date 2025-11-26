import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET, // Reuse existing secret
    session: {
        strategy: "jwt", // Stateless session, perfect for Vercel
    },
    pages: {
        signIn: "/login",
    },
    debug: process.env.NODE_ENV === "development",
})
