"use client";

import { wsAtom } from "@/atoms/atom";
import { freezeAtom } from "@/atoms/atom";
import { Button } from "@/components/ui/button";
import { cn, layers } from "@/lib/utils";
import { useAtomValue, useAtom } from "jotai";
import { useRouter } from "next/navigation";

export default function Start() {
  const [freeze, setFreeze] = useAtom(freezeAtom);
  const ws = useAtomValue(wsAtom);
  const router = useRouter();

  const h = 160;
  const w = 270;

  const handleClick = () => {
    if (freeze) return; // prevent multiple clicks

    if (!ws) return console.log("ws is null");
    setFreeze(true);

    ws.send(JSON.stringify({ type: "create" }));

    ws.onmessage = (e) => {
      const { roomId } = JSON.parse(e.data);
      router.push(`/room/${roomId}`);
    };

    // Unfreeze after 5s (optional)
    setTimeout(() => setFreeze(false), 5000);
  };

  return (
    <div
      className={cn(
        "absolute",
        `top-[calc(100%-80px-100px)]`,
        `left-[calc(100%-190px-105px-10px)]`
      )}
    >
      <div className="relative grid place-items-center">
        <div
          style={{ position: "relative", height: `${h}px`, width: `${w}px` }}
        >
          {layers.map((layer, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                inset: "0",
                zIndex: index + 1,
                backdropFilter: `blur(${layer.blur}px)`,
                WebkitBackdropFilter: `blur(${layer.blur}px)`,
                maskImage: `radial-gradient(ellipse at center, ${layer.gradient})`,
                WebkitMaskImage: `radial-gradient(ellipse at center, ${layer.gradient})`,
                pointerEvents: "none",
              }}
            />
          ))}

          <Button
            className="h-[80px] w-[205px] text-4xl z-10 absolute inset-0 m-auto active:scale-98 hover:cursor-pointer hover:bg-primary disabled:opacity-100 disabled:cursor-not-allowed transition-all duration-300"
            onClick={handleClick}
            disabled={freeze}
          >
            Play
          </Button>
        </div>
      </div>
    </div>
  );
}
