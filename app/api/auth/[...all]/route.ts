import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    try {
        return await auth.handler(req);
    } catch (error: any) {
        console.error("Auth GET Error:", error);
        return NextResponse.json({ error: "Internal Auth Error", details: error.message, stack: error.stack }, { status: 500 });
    }
};

export const POST = async (req: Request) => {
    try {
        return await auth.handler(req);
    } catch (error: any) {
        console.error("Auth POST Error:", error);
        return NextResponse.json({ error: "Internal Auth Error", details: error.message, stack: error.stack }, { status: 500 });
    }
};
