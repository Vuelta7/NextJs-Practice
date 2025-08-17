// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      username: string;
    };

    // Attach user data to request (so API routes can use it)
    // Next.js trick: put it into headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded.userId.toString());
    requestHeaders.set("x-username", decoded.username);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    return NextResponse.json({ error: "Auth error" }, { status: 401 });
  }
}

// Apply only to certain routes
export const config = {
  matcher: ["/api/home/:path*"], // all routes under /api/home
};
