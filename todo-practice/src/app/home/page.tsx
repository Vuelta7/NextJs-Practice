"use client";
import { useRouter } from "next/navigation";
import circle from "@/assets/circle diff color.png";
import profile from "@/assets/profile.png";
import plus from "@/assets/plus.png";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 relative flex flex-col overflow-hidden">
      {/* Background circle positioned at top-left */}
      <div className="absolute top-0 left-0">
        <Image
          className="w-50 md:w-40 md:h-40"
          src={circle}
          alt="circle illustration"
        />
      </div>

      {/* Cyan Container */}
      <div className="bg-[#50C2C9] h-[30vh] text-center flex flex-col justify-end">
        <Image src={profile} alt="profile" className="mx-auto"></Image>
        <p className="font-bold text-xl text-white p-5">
          Welcome Jeegar goyani
        </p>
      </div>

      {/* Clock */}
      <p className="text-right p-5 font-bold">Good Afternoon</p>
      <div className="rounded-[90px] shadow mx-auto w-48 bg-white h-[20vh]"></div>

      {/* White Shadowed Container */}
      <p className="text-left pt-5 px-5 font-bold">Task list</p>
      <div className="bg-white shadow-xl rounded-xl h-[30vh] m-5 p-10">
        {/* Top Element */}
        <div className="flex justify-between mb-10">
          <p>Daily Task</p>
          <Image src={plus} alt="Plus"></Image>
        </div>

        {/* Todo */}
        <div className="flex">
          <button>
            <div className="bg-[#50C2C9] border-2 h-4 w-4"></div>
          </button>
          <p>&nbsp;&nbsp;&nbsp;Learning Programming by 12PM</p>
        </div>
      </div>
      <button onClick={() => router.push("/")}>hi</button>
    </div>
  );
}
