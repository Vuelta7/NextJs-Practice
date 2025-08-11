import { create } from "zustand";
import { persist } from "zustand/middleware";

type Note = {
  noteId: number;
  note: string;
  isDone: boolean;
  userId: number;
};

type NoteStore = {
  notes: Note[];

  // Actions
  addNote: (note: Omit<Note, "noteId">) => void;
  updateNote: (
    noteId: number,
    updates: Partial<Pick<Note, "note" | "isDone">>
  ) => void;
  deleteNote: (noteId: number) => void;
  toggleNoteDone: (noteId: number) => void;

  // Filter/Get functions
  getNoteById: (noteId: number) => Note | undefined;
  getNotesByUserId: (userId: number) => Note[];
  getCompletedNotes: (userId?: number) => Note[];
  getPendingNotes: (userId?: number) => Note[];

  // Bulk operations
  clearAllNotes: () => void;
  clearUserNotes: (userId: number) => void;
  setNotes: (notes: Note[]) => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (newNote) =>
        set((state) => {
          const noteId = Math.max(...state.notes.map((n) => n.noteId), 0) + 1;
          return {
            notes: [...state.notes, { ...newNote, noteId }],
          };
        }),

      updateNote: (noteId, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.noteId === noteId ? { ...note, ...updates } : note
          ),
        })),

      deleteNote: (noteId) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.noteId !== noteId),
        })),

      toggleNoteDone: (noteId) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.noteId === noteId ? { ...note, isDone: !note.isDone } : note
          ),
        })),

      getNoteById: (noteId) => {
        return get().notes.find((note) => note.noteId === noteId);
      },

      getNotesByUserId: (userId) => {
        return get().notes.filter((note) => note.userId === userId);
      },

      getCompletedNotes: (userId) => {
        const notes = get().notes;
        return userId
          ? notes.filter((note) => note.userId === userId && note.isDone)
          : notes.filter((note) => note.isDone);
      },

      getPendingNotes: (userId) => {
        const notes = get().notes;
        return userId
          ? notes.filter((note) => note.userId === userId && !note.isDone)
          : notes.filter((note) => !note.isDone);
      },

      clearAllNotes: () => set({ notes: [] }),

      clearUserNotes: (userId) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.userId !== userId),
        })),

      setNotes: (notes) => set({ notes }),
    }),
    {
      name: "note-storage", // localStorage key
    }
  )
);
