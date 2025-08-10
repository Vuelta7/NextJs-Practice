import { PrismaClient } from "@/generated/prisma/index.js";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  // Basic validation (optional)
  if (!username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.create({
      data: { username, password },
    });

    return NextResponse.json({ message: "User registered", user });
  } catch (err) {
    return NextResponse.json(
      { error: `User creation failed:  ${err}` },
      { status: 500 }
    );
  }
}
