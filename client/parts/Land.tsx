"use client";
import { useState } from "react";
import Block from "@/components/Block";
import { toast } from "sonner";

const Land = () => {
  const rows = 25;
  const cols = 45;
  const [active, setActive] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(false))
  );

  const toggleBlock = (row: number, col: number) => {
    setActive((prev) => {
      const newActive = prev.map((r) => r.slice());
      newActive[row][col] = !newActive[row][col];
      return newActive;
    });
  };

  const saveState = () => {
    const activeIds: number[] = [];
    active.forEach((rowArr, row) => {
      rowArr.forEach((isActive, col) => {
        if (isActive) {
          activeIds.push(row * cols + col);
        }
      });
    });
    localStorage.setItem("blockState", JSON.stringify(activeIds));
    console.log("Saved active IDs:", activeIds);
    toast("Saved");
  };

  const loadState = () => {
    const saved = localStorage.getItem("blockState");
    if (saved) {
      const activeIds: number[] = JSON.parse(saved);
      const newActive = Array.from({ length: rows }, () =>
        Array(cols).fill(false)
      );
      activeIds.forEach((id) => {
        const row = Math.floor(id / cols);
        const col = id % cols;
        if (row < rows && col < cols) {
          newActive[row][col] = true;
        }
      });
      setActive(newActive);

      toast("Loaded");
    } else {
      toast("No saved state found.");
    }
  };

  return (
    <div className="flex flex-col z-1 w-screen h-screen p-10">
      <div
        className="grid flex-1"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => (
            <Block
              key={`${row}-${col}`}
              isActive={active[row][col]}
              hasLeft={col > 0 && active[row][col - 1]}
              hasRight={col < cols - 1 && active[row][col + 1]}
              hasTop={row > 0 && active[row - 1][col]}
              hasBottom={row < rows - 1 && active[row + 1][col]}
              onToggle={() => toggleBlock(row, col)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Land;
