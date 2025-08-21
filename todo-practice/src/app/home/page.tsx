"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import circle from "@/assets/circle diff color.png";
import profile from "@/assets/profile.png";
import plus from "@/assets/plus.png";
import LogOutIcon from "../components/logOut";
import Time from "../components/time";
import DeleteIcon from "../components/delete";
import { useHome } from "./hooks/useHome";

export default function Home() {
  const router = useRouter();
  const {
    username,
    userNotes,
    isDialogOpen,
    newTask,
    isLoading,
    isAddingTask,
    deletingNotes,
    error,
    setIsDialogOpen,
    setNewTask,
    handleAddTask,
    handleDeleteTask,
    handleToggleTask,
    closeDialog,
  } = useHome();

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
                onClick={closeDialog}
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
