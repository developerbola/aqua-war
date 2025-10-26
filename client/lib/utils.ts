import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const layers = [
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