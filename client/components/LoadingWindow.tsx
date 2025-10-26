"use client";
import { isConnectedAtom } from "@/atoms/atom";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";

const LoadingWindow = () => {
  const isLoading = useAtomValue(isConnectedAtom);

  return (
    <div
      className={cn(
        "absolute top-0 left-0 z-50 h-screen w-screen grid place-items-center backdrop-blur-xl bg-[#fff]/20 transition-all",
        isLoading ? "invisible opacity-0" : "visible opacity-100"
      )}
    >
      <div>
        <div className="h-[15px] w-[200px] border-3 rounded-full p-[1.8px] border-black">
          <span className="block bg-black w-1/2 h-full rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LoadingWindow;
