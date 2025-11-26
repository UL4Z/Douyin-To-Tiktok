import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const dynamic = "force-dynamic";

const handlers = toNextJsHandler(auth);

export const GET = async (req: Request) => {
    console.log("DEBUG: GET /api/auth hit", req.url);
    return handlers.GET(req);
};

export const POST = async (req: Request) => {
    console.log("DEBUG: POST /api/auth hit", req.url);
    return handlers.POST(req);
};
