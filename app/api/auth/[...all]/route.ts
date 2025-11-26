import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

const handlers = toNextJsHandler(auth);

export const GET = async (req: Request) => {
    console.log("DEBUG: GET /api/auth hit", req.url);
    try {
        return await handlers.GET(req);
    } catch (e: any) {
        console.error("Auth GET error:", e);
        return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
    }
};

export const POST = async (req: Request) => {
    console.log("DEBUG: POST /api/auth hit", req.url);
    try {
        return await handlers.POST(req);
    } catch (e: any) {
        console.error("Auth POST error:", e);
        return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
    }
};
