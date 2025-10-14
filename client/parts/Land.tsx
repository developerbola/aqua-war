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

  // Save active block IDs as a flat array to localStorage
  const saveState = () => {
    const activeIds: number[] = [];
    active.forEach((rowArr, row) => {
      rowArr.forEach((isActive, col) => {
        if (isActive) {
          activeIds.push(row * cols + col); // Flat ID: 0 to (rows*cols-1)
        }
      });
    });
    localStorage.setItem("blockState", JSON.stringify(activeIds));
    console.log("Saved active IDs:", activeIds); // For debugging or export
    toast("Saved"); // Or use a toast/notification
  };

  // Load from localStorage and restore state
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
    <div className="flex flex-col h-screen w-full">
      <div className="absolute top-10 left-[40%] flex justify-center gap-4 p-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={saveState}
        >
          Save State
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={loadState}
        >
          Load State
        </button>
      </div>
      <div
        className="grid flex-1 p-10"
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
