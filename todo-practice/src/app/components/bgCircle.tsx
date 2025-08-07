import Image from "next/image";
import circle from "@/assets/circle.png";

export default function bgCircle() {
  return (
    <div className="absolute top-0 left-0">
      {/* Background circle positioned at top-left */}
      <Image
        className="w-50 md:w-40 md:h-40"
        src={circle}
        alt="circle illustration"
      />
    </div>
  );
}
