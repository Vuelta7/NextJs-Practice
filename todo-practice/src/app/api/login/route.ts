import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  return NextResponse.json({ token });
}
