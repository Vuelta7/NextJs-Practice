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

  // Debug user data
  console.log("Current user data:", { username, userId });

  const { notes, setNotes, getNotesByUserId, addNote, toggleNoteDone } =
    useNoteStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/home");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Assuming the API returns an array of notes or an object with notes property
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
  }, [setNotes]);

  // Get current user's notes
  const userNotes = userId ? getNotesByUserId(userId) : [];

  // Handle adding new task
  const handleAddTask = async () => {
    console.log("handleAddTask called");
    console.log("newTask:", newTask);
    console.log("userId:", userId);

    if (!newTask.trim()) {
      console.log("No task text entered");
      return;
    }

    if (!userId) {
      console.log("No userId found");
      setError("User not logged in");
      return;
    }

    try {
      setIsAddingTask(true);
      setError(null);
      console.log("Starting API request...");

      const requestBody = {
        note: newTask.trim(),
        isDone: false,
        userId: userId,
      };

      console.log("Request body:", requestBody);

      const response = await fetch("/api/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const createdNote = await response.json();
      console.log("Created note:", createdNote);

      // Add the new note to Zustand store
      addNote(createdNote);
      console.log("Note added to store");

      setNewTask("");
      setIsDialogOpen(false);
      console.log("Modal closed");
    } catch (err) {
      console.error("Failed to add task:", err);
      setError(err instanceof Error ? err.message : "Failed to add task");
    } finally {
      setIsAddingTask(false);
      console.log("Request completed");
    }
  };

  // Handle toggling task completion
  const handleToggleTask = (noteId: number) => {
    toggleNoteDone(noteId);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative flex flex-col overflow-hidden">
      {/* Background circle */}
      <div className="absolute top-0 left-0">
        <Image className="w-50 md:w-40 md:h-40" src={circle} alt="circle" />
      </div>
      {/* Background circle */}
      <button
        onClick={() => {
          router.push("/");
        }}
        className="absolute top-0 right-0"
      >
        <LogOutIcon />
      </button>

      {/* Cyan Header */}
      <div className="bg-[#50C2C9] h-[30vh] flex flex-col justify-end text-center">
        <Image src={profile} alt="profile" className="mx-auto" />
        <p className="font-bold text-xl text-white p-5">Welcome {username}</p>
      </div>

      {/* Modal */}
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
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddTask();
                }
              }}
            />
            <div className="flex gap-5">
              <button
                onClick={() => {
                  console.log("Add task button clicked");
                  handleAddTask();
                }}
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
      <div className="bg-white shadow-xl rounded-xl h-[30vh] m-5 p-10 overflow-y-auto">
        <div className="flex justify-between mb-10">
          <p>Daily Task</p>
          <button
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <Image src={plus} alt="Plus" />
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="text-red-500 text-center py-4">
            Error loading tasks: {error}
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
                  className={`ml-3 ${
                    note.isDone ? "line-through text-gray-500" : "text-black"
                  }`}
                >
                  {note.note}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
