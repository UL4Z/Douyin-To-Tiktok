import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const GET = async (req: Request) => {
    console.log('GET /api/auth hit');
    const res = await auth.handler(req);
    return res;
};

export const POST = async (req: Request) => {
    console.log('POST /api/auth hit');
    const res = await auth.handler(req);
    return res;
};
