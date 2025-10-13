"use client";
import Block from "@/components/Block";

const Land = () => {
  // Define rows and columns count
  const rows = 25;
  const cols = 45;

  return (
    <div
      className="grid h-screen w-full place-items-center p-5"
      style={{
        gridTemplateColumns: `repeat(${cols}, auto)`,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, index) => (
        <Block key={index} />
      ))}
    </div>
  );
};

export default Land;
