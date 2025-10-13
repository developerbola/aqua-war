"use client";
import Block from "@/components/Block";

const Land = () => {
  const rows = 25;
  const cols = 45;

  return (
    <div
      className="grid h-screen w-full p-10"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: "1px",
      }}
    >
      {Array.from({ length: rows * cols }).map((_, index) => (
        <Block key={index} />
      ))}
    </div>
  );
};

export default Land;
