import { PrismaClient } from "@/generated/prisma/index.js";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all notes
export async function GET() {
  try {
    const notes = await prisma.note.findMany();
    return NextResponse.json(notes);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch notes: " + e },
      { status: 500 }
    );
  }
}

// POST create note
export async function POST(req: Request) {
  try {
    const { note, isDone, userId } = await req.json();

    if (!note || !userId) {
      return NextResponse.json(
        { error: "note and userId are required" },
        { status: 400 }
      );
    }

    const newNote = await prisma.note.create({
      data: {
        note,
        isDone: isDone ?? true,
        userId,
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create note " + e },
      { status: 500 }
    );
  }
}
