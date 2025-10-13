import { cn } from "@/lib/utils";
import { useState } from "react";

const Block = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      className={cn(
        "w-full h-full grid place-items-center hover:bg-neutral-100",
        isActive && "bg-neutral-800 hover:bg-neutral-800"
      )}
      onClick={() => setIsActive(!isActive)}
    >
      <div className="size-[5px] bg-neutral-400 rounded-full"></div>
    </div>
  );
};

export default Block;
