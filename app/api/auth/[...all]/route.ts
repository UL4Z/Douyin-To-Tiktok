import { NextResponse } from "next/server";

export async function GET(req: Request) {
    console.log("DEBUG: GET /api/auth/[...all] hit");
    return NextResponse.json({ status: "ok", message: "Auth route is reachable manually" });
}

export async function POST(req: Request) {
    console.log("DEBUG: POST /api/auth/[...all] hit");
    return NextResponse.json({ status: "ok", message: "Auth route is reachable manually" });
}
