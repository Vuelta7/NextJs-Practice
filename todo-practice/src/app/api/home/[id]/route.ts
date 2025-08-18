import { PrismaClient } from "@/generated/prisma/index.js";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id);

    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    await prisma.note.delete({
      where: { noteId },
    });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (e) {
    console.error("Delete error:", e);
    return NextResponse.json(
      { error: "Failed to delete note: " + e },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id);

    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    const body = await req.json();

    // Validate the request body
    const updateData: { isDone?: boolean; note?: string } = {};

    // Only allow updating specific fields
    if (typeof body.isDone === "boolean") {
      updateData.isDone = body.isDone;
    }

    if (typeof body.note === "string" && body.note.trim()) {
      updateData.note = body.note.trim();
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Check if note exists first
    const existingNote = await prisma.note.findUnique({
      where: { noteId },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Update the note
    const updatedNote = await prisma.note.update({
      where: { noteId },
      data: updateData,
    });

    return NextResponse.json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (e) {
    console.error("Update error:", e);

    // Handle specific Prisma errors
    if (e instanceof Error) {
      if (e.message.includes("Record to update not found")) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: "Failed to update note: " + e },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id);

    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    const body = await req.json();

    // Validate required fields for PUT (full update)
    if (typeof body.note !== "string" || !body.note.trim()) {
      return NextResponse.json(
        { error: "Note text is required" },
        { status: 400 }
      );
    }

    if (typeof body.isDone !== "boolean") {
      return NextResponse.json(
        { error: "isDone must be a boolean" },
        { status: 400 }
      );
    }

    if (typeof body.userId !== "number") {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Check if note exists first
    const existingNote = await prisma.note.findUnique({
      where: { noteId },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Full update of the note
    const updatedNote = await prisma.note.update({
      where: { noteId },
      data: {
        note: body.note.trim(),
        isDone: body.isDone,
        userId: body.userId,
      },
    });

    return NextResponse.json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (e) {
    console.error("Full update error:", e);

    if (e instanceof Error) {
      if (e.message.includes("Record to update not found")) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: "Failed to update note: " + e },
      { status: 500 }
    );
  }
}
