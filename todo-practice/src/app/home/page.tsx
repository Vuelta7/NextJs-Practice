"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import circle from "@/assets/circle diff color.png";
import profile from "@/assets/profile.png";
import plus from "@/assets/plus.png";
import LogOutIcon from "../components/logOut";

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState("");

  // Wait until client is mounted before rendering UI
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    // Render nothing (or a loading placeholder) during SSR to avoid mismatch
    return <div className="min-h-screen bg-gray-100"></div>;
  }

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = ((hours % 12) / 12) * 360 + minutes * 0.5;

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
        <p className="font-bold text-xl text-white p-5">
          Welcome Jeegar goyani
        </p>
      </div>

      {/* Greeting */}
      <p className="text-right p-5 font-bold">Good Afternoon</p>

      {/* Clock */}
      <div className="flex flex-col items-center">
        <div className="rounded-full relative shadow mx-auto w-48 h-48 bg-[#F0FDFD]">
          <p className="absolute top-1 left-1/2 -translate-x-1/2 text-[#50C2C9]">
            12
          </p>
          <p className="absolute right-1 top-1/2 -translate-y-1/2 text-[#50C2C9]">
            3
          </p>
          <p className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[#50C2C9]">
            6
          </p>
          <p className="absolute left-1 top-1/2 -translate-y-1/2 text-[#50C2C9]">
            9
          </p>

          {/* Hands */}
          <div
            className="absolute w-[2px] h-16 bg-[#50C2C9] top-8 left-1/2 origin-bottom z-20"
            style={{ transform: `rotate(${hourDeg}deg)` }}
          />
          <div
            className="absolute w-[2px] h-20 bg-[#50C2C9] top-5 left-1/2 origin-bottom z-20"
            style={{ transform: `rotate(${minuteDeg}deg)` }}
          />
          <div
            className="absolute w-[1px] h-20 bg-gray-400 top-5 left-1/2 origin-bottom z-20"
            style={{ transform: `rotate(${secondDeg}deg)` }}
          />

          {/* Center Dot */}
          <div
            className="rounded-full absolute shadow w-5 h-5 bg-white 
                          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          />
        </div>
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
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              type="text"
              placeholder="Enter a Task"
              className="w-full px-6 py-4 rounded-4xl bg-white border-3 border-[#50C2C9] outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black mb-5"
            />
            <div className="flex gap-5">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 w-full bg-green-500 rounded-lg hover:bg-gray-600"
              >
                Add task
              </button>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 w-full bg-red-500 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <p className="text-left pt-5 px-5 font-bold">Task list</p>
      <div className="bg-white shadow-xl rounded-xl h-[30vh] m-5 p-10">
        <div className="flex justify-between mb-10">
          <p>Daily Task</p>
          <button
            onClick={() => {
              console.log("hi");
              setIsDialogOpen(true);
            }}
          >
            <Image src={plus} alt="Plus" />
          </button>
        </div>
        <div className="flex">
          <button>
            <div className="bg-[#50C2C9] border-2 h-4 w-4"></div>
          </button>
          <p>&nbsp;&nbsp;&nbsp;Learning Programming by 12PM</p>
        </div>
      </div>
    </div>
  );
}
