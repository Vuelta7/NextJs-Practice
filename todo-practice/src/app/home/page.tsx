"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import circle from "@/assets/circle diff color.png";
import profile from "@/assets/profile.png";
import plus from "@/assets/plus.png";
import LogOutIcon from "../components/logOut";
import Time from "../components/time";
import { useUserStore } from "@/lib/useUserStore";
import { useNoteStore } from "@/lib/useNoteStore";
import DeleteIcon from "../components/delete";

type Note = {
  noteId: number;
  note: string;
  isDone: boolean;
  userId: number;
};

export default function Dashboard() {
  const router = useRouter();

  const username = useUserStore((state) => state.username);
  const userId = useUserStore((state) => state.userId);
  const { setUserId, setUsername } = useUserStore();

  const {
    notes,
    setNotes,
    getNotesByUserId,
    addNote,
    toggleNoteDone,
    deleteNote,
  } = useNoteStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [deletingNotes, setDeletingNotes] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch notes on component mount and after deletions
  useEffect(() => {
    const fetchNotes = async () => {
      // Don't show loading spinner on refresh after delete
      if (refreshTrigger === 0) {
        setIsLoading(true);
      }

      try {
        setError(null);

        const response = await fetch("/api/home");

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
    };

    fetchNotes();
  }, [setNotes, refreshTrigger]); // Re-fetch when refreshTrigger changes

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      setDeletingNotes(new Set());
      setError(null);
    };
  }, []);

  // Get current user's notes
  const userNotes = userId ? getNotesByUserId(userId) : [];

  // Fixed delete handler with proper error handling and state management
  const handleDeleteTask = async (noteId: number) => {
    try {
      // Add to deleting set to show loading state
      setDeletingNotes((prev) => new Set([...prev, noteId]));
      setError(null);

      const response = await fetch(`/api/home/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete note`);
      }

      if (deleteNote) {
        deleteNote(noteId); // Assuming you have this method in your store
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

  // Alternative: Custom hook for delete functionality
  const useDeleteNote = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const deleteNote = async (noteId: number, onSuccess?: () => void) => {
      setIsDeleting(true);
      setDeleteError(null);

      try {
        const response = await fetch(`/api/home/${noteId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to delete note");
        }

        onSuccess?.();
      } catch (err) {
        setDeleteError(err instanceof Error ? err.message : "Delete failed");
      } finally {
        setIsDeleting(false);
      }
    };

    return { deleteNote, isDeleting, deleteError };
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
        headers: { "Content-Type": "application/json" },
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

      // You might want to also sync with the backend
      const note = userNotes.find((n) => n.noteId === noteId);
      if (note) {
        await fetch(`/api/home/${noteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isDone: !note.isDone }),
        });
      }
    } catch (err) {
      // Rollback on error
      toggleNoteDone(noteId);
      console.error("Failed to toggle task:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative flex flex-col overflow-hidden">
      {/* Background circle */}
      <div className="absolute top-0 left-0">
        <Image className="w-50 md:w-40 md:h-40" src={circle} alt="circle" />
      </div>

      <button
        onClick={() => router.push("/")}
        className="absolute top-0 right-0"
      >
        <LogOutIcon />
      </button>

      {/* Cyan Header */}
      <div className="bg-[#50C2C9] h-[30vh] flex flex-col justify-end text-center">
        <Image src={profile} alt="profile" className="mx-auto" />
        <p className="font-bold text-xl text-white p-5">Welcome {username}</p>
      </div>

      {/* Modal for adding tasks */}
      {isDialogOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Add Task</h2>
            {error && (
              <div className="text-red-500 text-sm mb-3 p-2 bg-red-50 rounded">
                {error}
              </div>
            )}
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              type="text"
              placeholder="Enter a Task"
              className="w-full px-6 py-4 rounded-4xl bg-white border-3 border-[#50C2C9] outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black mb-5"
              onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            />
            <div className="flex gap-5">
              <button
                onClick={handleAddTask}
                disabled={!newTask.trim() || isAddingTask}
                className="px-4 py-2 w-full bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isAddingTask ? "Adding..." : "Add task"}
              </button>
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setNewTask("");
                  setError(null);
                }}
                disabled={isAddingTask}
                className="px-4 py-2 w-full bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Time />

      {/* Task List */}
      <p className="text-left pt-5 px-5 font-bold">Task list</p>
      <div className="bg-white shadow-xl rounded-xl m-5 p-10 overflow-y-auto">
        <div className="flex justify-between mb-10">
          <p>Daily Task</p>
          <button onClick={() => setIsDialogOpen(true)}>
            <Image src={plus} alt="Plus" />
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="text-red-500 text-center py-4 bg-red-50 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="text-gray-500 text-center py-4">Loading tasks...</div>
        )}

        {/* No tasks state */}
        {!isLoading && !error && userNotes.length === 0 && (
          <div className="text-gray-500 text-center py-4">
            No tasks yet. Add your first task!
          </div>
        )}

        {/* Task list */}
        {!isLoading && !error && userNotes.length > 0 && (
          <div className="space-y-3">
            {userNotes.map((note) => (
              <div key={note.noteId} className="flex items-center">
                <button
                  onClick={() => handleToggleTask(note.noteId)}
                  className="flex-shrink-0"
                >
                  <div
                    className={`border-2 h-4 w-4 ${
                      note.isDone
                        ? "bg-[#50C2C9] border-[#50C2C9]"
                        : "bg-white border-gray-400"
                    }`}
                  />
                </button>
                <p
                  className={`ml-3 flex-1 ${
                    note.isDone ? "line-through text-gray-500" : "text-black"
                  }`}
                >
                  {note.note}
                </p>
                {note.isDone && (
                  <button
                    onClick={() => handleDeleteTask(note.noteId)}
                    disabled={deletingNotes.has(note.noteId)}
                    className="ml-2 p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingNotes.has(note.noteId) ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <DeleteIcon />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
