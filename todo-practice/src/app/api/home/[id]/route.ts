import { PrismaClient } from "@/generated/prisma/index.js";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// DELETE note
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id);
    const userId = Number(_req.headers.get("x-user-id"));

    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    // Ensure note belongs to the logged-in user
    const existingNote = await prisma.note.findUnique({ where: { noteId } });
    if (!existingNote || existingNote.userId !== userId) {
      return NextResponse.json(
        { error: "Note not found or not yours" },
        { status: 404 }
      );
    }

    await prisma.note.delete({ where: { noteId } });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (e) {
    console.error("Delete error:", e);
    return NextResponse.json(
      { error: "Failed to delete note: " + e },
      { status: 500 }
    );
  }
}

// PATCH note (partial update)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id);
    const userId = Number(req.headers.get("x-user-id"));

    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    const body = await req.json();
    const updateData: { isDone?: boolean; note?: string } = {};

    if (typeof body.isDone === "boolean") updateData.isDone = body.isDone;
    if (typeof body.note === "string" && body.note.trim())
      updateData.note = body.note.trim();

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const existingNote = await prisma.note.findUnique({ where: { noteId } });
    if (!existingNote || existingNote.userId !== userId) {
      return NextResponse.json(
        { error: "Note not found or not yours" },
        { status: 404 }
      );
    }

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
    return NextResponse.json(
      { error: "Failed to update note: " + e },
      { status: 500 }
    );
  }
}

// PUT note (full update)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id);
    const userId = Number(req.headers.get("x-user-id"));
    const body = await req.json();

    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }
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

    // Enforce security: ignore userId in body, use token's userId
    const existingNote = await prisma.note.findUnique({ where: { noteId } });
    if (!existingNote || existingNote.userId !== userId) {
      return NextResponse.json(
        { error: "Note not found or not yours" },
        { status: 404 }
      );
    }

    const updatedNote = await prisma.note.update({
      where: { noteId },
      data: {
        note: body.note.trim(),
        isDone: body.isDone,
        userId, // force ownership
      },
    });

    return NextResponse.json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (e) {
    console.error("Full update error:", e);
    return NextResponse.json(
      { error: "Failed to update note: " + e },
      { status: 500 }
    );
  }
}
