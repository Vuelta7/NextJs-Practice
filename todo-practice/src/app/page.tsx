"use client";
import Image from "next/image";
import getStarted from "@/assets/get started pic.png";
import Circle from "./components/bgCircle";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 relative flex flex-col">
      <Circle></Circle>

      {/* Main content container */}
      <div className="flex-1 flex flex-col px-8 pt-30">
        {/* Main illustration */}
        <div className="flex flex-col items-center">
          <div className="mb-12">
            <Image
              src={getStarted}
              alt="Get started illustration"
              className="w-64 h-auto max-w-full"
            />
          </div>

          {/* Text content */}
          <div className="text-center max-w-[200px] mb-auto">
            <h1 className="font-bold text-[18px] text-gray-800 mb-4">
              Gets things with TODs
            </h1>
            <p className="text-[14px] text-gray-600 leading-5">
              Lorem ipsum dolor sit amet consectetur. Eget sit nec et euismod.
              Consequat urna quam felis interdum quisque. Malesuada adipiscing
              tristique ut eget sed.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-8 pb-20 mx-auto">
        <button
          onClick={() => router.push("/auth/login")}
          className="w-[350px] bg-[#50C2C9] text-white rounded-lg py-4 text-[18px] font-bold shadow-sm mb-6"
        >
          Get Started
        </button>
        {/* Empty div to match height of login/register pages */}
        <div className="h-[24px]"></div>
      </div>
    </div>
  );
}
