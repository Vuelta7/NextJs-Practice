import { PrismaClient } from "@/generated/prisma/index.js";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id);

    await prisma.note.delete({
      where: { noteId },
    });

    return NextResponse.json({ message: "Note deleted" });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to delete note " + e },
      { status: 500 }
    );
  }
}
