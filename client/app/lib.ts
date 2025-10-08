export interface DragItem {
  ship: Ship;
  orientation: 'horizontal' | 'vertical';
  isNew: boolean;
  oldRow?: number;
  oldCol?: number;
  oldOrientation?: 'horizontal' | 'vertical';
}

/**
 * Defines the fleet composition: sizes of ships to place (standard Battleship setup).
 * Total: 1x4, 2x3, 3x2, 4x1 = 20 cells.
 */
export const ships = [
  { size: 4 },
  { size: 3 },
  { size: 3 },
  { size: 2 },
  { size: 2 },
  { size: 2 },
  { size: 1 },
  { size: 1 },
  { size: 1 },
  { size: 1 },
];

/**
 * Interface for a ship object: unique ID, display name, and length in cells.
 */
export interface Ship {
  id: string;
  name: string;
  length: number;
}

/**
 * Interface for a ship placement: tracks position and orientation for editing/sinking checks.
 */
export interface ShipPlacement {
  ship: Ship;
  row: number;
  col: number;
  orientation: "horizontal" | "vertical";
}

/**
 * Maps ship size to a human-readable name (e.g., 4 -> 'Battleship').
 * Used for labeling ships in the UI.
 */
export const getShipName = (size: number): string => {
  switch (size) {
    case 4:
      return "#";
    case 3:
      return "#";
    case 2:
      return "#";
    case 1:
      return "#";
    default:
      return `#`;
  }
};

/**
 * Pre-generates the full list of ships from 'ships' array.
 * Assigns unique IDs and names for tracking.
 */
export const SHIPS: Ship[] = ships.map((s, i) => ({
  id: `ship-${i}`,
  name: getShipName(s.size),
  length: s.size,
}));

/**
 * Calculates total number of ship cells across all ships (used for win condition).
 */
export const TOTAL_SHIP_CELLS = ships.reduce((sum, s) => sum + s.size, 0); // 20

/**
 * Interface for a grid cell: position, and flags for game state (ship, hit, miss).
 */
export interface Cell {
  id: number;
  row: number;
  col: number;
  ship?: boolean;
  hit?: boolean;
  miss?: boolean;
}

/**
 * Validates if a ship can be placed at the starting position without overlaps or adjacency.
 * - Checks bounds for the ship's full length.
 * - Ensures no existing ships on the cells.
 * - Enforces 1-cell buffer: no adjacent (including diagonal) to any existing ship.
 */
export const canPlaceShip = (
  cells: Cell[][],
  startRow: number,
  startCol: number,
  length: number,
  dir: "horizontal" | "vertical"
): boolean => {
  const GRID_SIZE = cells.length;

  // Directions for 8-neighbor adjacency check (Moore neighborhood)
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  // Check bounds and no overlap on ship positions
  for (let i = 0; i < length; i++) {
    const r = dir === "horizontal" ? startRow : startRow + i;
    const c = dir === "horizontal" ? startCol + i : startCol;
    if (r >= GRID_SIZE || c >= GRID_SIZE || cells[r][c].ship) return false;
  }

  // Check no adjacency to existing ships (1-cell buffer in all directions)
  for (let i = 0; i < length; i++) {
    const r = dir === "horizontal" ? startRow : startRow + i;
    const c = dir === "horizontal" ? startCol + i : startCol;
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < GRID_SIZE &&
        nc >= 0 &&
        nc < GRID_SIZE &&
        cells[nr][nc].ship
      ) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Places or removes a ship on the board cells starting from the given position.
 * Sets 'ship' flag to true/false for each cell in the ship's span.
 */
export const placeShipOnBoard = (
  cells: Cell[][],
  startRow: number,
  startCol: number,
  length: number,
  dir: "horizontal" | "vertical",
  isShip: boolean
) => {
  for (let i = 0; i < length; i++) {
    const r = dir === "horizontal" ? startRow : startRow + i;
    const c = dir === "horizontal" ? startCol + i : startCol;
    cells[r][c].ship = isShip;
  }
};
