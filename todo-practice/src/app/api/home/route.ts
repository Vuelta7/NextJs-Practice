// src/app/api/home/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/index.js";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");

  try {
    const notes = await prisma.note.findMany({
      where: { userId: Number(userId) },
    });

    return NextResponse.json(notes);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch notes", e },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id");
  const { note, isDone } = await req.json();

  if (!note) {
    return NextResponse.json({ error: "note is required" }, { status: 400 });
  }

  try {
    const newNote = await prisma.note.create({
      data: {
        note,
        isDone,
        userId: Number(userId),
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create note", e },
      { status: 500 }
    );
  }
}
