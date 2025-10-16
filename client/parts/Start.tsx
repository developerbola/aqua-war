import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Start() {
  const h = 80 + 80;
  const w = 190 + 80;

  const layers = [
    {
      blur: 16,
      gradient: "transparent 0%, white 12.5%, white 25%, transparent 37.5%",
    },
    {
      blur: 8,
      gradient: "transparent 12.5%, white 25%, white 37.5%, transparent 50%",
    },
    {
      blur: 4,
      gradient: "transparent 25%, white 37.5%, white 50%, transparent 62.5%",
    },
    {
      blur: 2,
      gradient: "transparent 37.5%, white 50%, white 62.5%, transparent 75%",
    },
    {
      blur: 1,
      gradient: "transparent 50%, white 62.5%, white 75%, transparent 87.5%",
    },
    {
      blur: 0.5,
      gradient: "transparent 62.5%, white 75%, white 87.5%, transparent 100%",
    },
    {
      blur: 0.25,
      gradient: "transparent 75%, white 87.5%, white 100%",
    },
    {
      blur: 0.1,
      gradient: "transparent 87.5%, white 100%",
    },
    {
      blur: 0.05,
      gradient: "transparent 94%, white 100%",
    },
    {
      blur: 0.01,
      gradient: "transparent 98%, white 100%",
    },
  ];

  return (
    <div
      className={cn(
        "absolute",
        `top-[calc(100%-80px-100px)]`,
        `left-[calc(100%-190px-105px-10px)]`
      )}
    >
      <div
        className="relative grid place-items-center"
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            height: `${h}px`,
            width: `${w}px`,
          }}
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
          <Button className="h-[80px] w-[205px] text-4xl z-10 absolute inset-0 m-auto active:scale-98 hover:cursor-pointer hover:bg-primary">
            Play
          </Button>
        </div>
      </div>
    </div>
  );
}