import { useEffect, useState } from "react";

export default function Time() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-100"></div>;
  }

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = ((hours % 12) / 12) * 360 + minutes * 0.5;

  return (
    <div>
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
    </div>
  );
}
