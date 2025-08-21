import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/useUserStore";
import { useNoteStore } from "@/lib/useNoteStore";
import { useCallback } from "react";

export function useHome() {
  const token = useUserStore((state) => state.token);
  const userId = useUserStore((state) => state.userId);
  const username = useUserStore((state) => state.username);

  const { setNotes, getNotesByUserId, addNote, toggleNoteDone, deleteNote } =
    useNoteStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [deletingNotes, setDeletingNotes] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Get current user's notes
  const userNotes = userId ? getNotesByUserId(userId) : [];

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);

    try {
      setError(null);

      const response = await fetch("/api/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const notesData = Array.isArray(data) ? data : data.notes;

      if (notesData) {
        setNotes(notesData);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch notes");
    } finally {
      setIsLoading(false);
    }
  }, [token, setNotes]);

  const handleDeleteTask = async (noteId: number) => {
    try {
      // Add to deleting set to show loading state
      setDeletingNotes((prev) => new Set([...prev, noteId]));
      setError(null);

      const response = await fetch(`/api/home/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete note`);
      }

      if (deleteNote) {
        deleteNote(noteId);
      }

      console.log(`Note ${noteId} deleted successfully`);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError(err instanceof Error ? err.message : "Failed to delete task");

      // Show error for 5 seconds then clear it
      setTimeout(() => setError(null), 5000);
    } finally {
      // Remove from deleting set
      setDeletingNotes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(noteId);
        return newSet;
      });
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !userId) {
      setError("Please enter a task and ensure you're logged in");
      return;
    }

    try {
      setIsAddingTask(true);
      setError(null);

      const response = await fetch("/api/home", {
        method: "POST",
        body: JSON.stringify({
          note: newTask.trim(),
          isDone: false,
          userId: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add task");
      }

      const createdNote = await response.json();
      addNote(createdNote);
      setNewTask("");
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to add task:", err);
      setError(err instanceof Error ? err.message : "Failed to add task");
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleToggleTask = async (noteId: number) => {
    try {
      // Optimistically update the UI
      toggleNoteDone(noteId);

      // Sync with the backend
      const note = userNotes.find((n) => n.noteId === noteId);
      if (note) {
        await fetch(`/api/home/${noteId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isDone: !note.isDone }),
        });
      }
    } catch (err) {
      // Rollback on error
      toggleNoteDone(noteId);
      console.error("Failed to toggle task:", err);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewTask("");
    setError(null);
  };

  // Fetch notes on component mount and after deletions
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      setDeletingNotes(new Set());
      setError(null);
    };
  }, []);

  return {
    // State
    username,
    userNotes,
    isDialogOpen,
    newTask,
    isLoading,
    isAddingTask,
    deletingNotes,
    error,

    // Actions
    setIsDialogOpen,
    setNewTask,
    setError,
    handleAddTask,
    handleDeleteTask,
    handleToggleTask,
    closeDialog,
    fetchNotes,
  };
}
