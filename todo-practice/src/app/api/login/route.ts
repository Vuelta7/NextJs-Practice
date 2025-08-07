import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/index.js";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 }
    );
  }

  if (user.password !== password) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 }
    );
  }

  return NextResponse.json({ id: user.userId, username: user.username });
}
