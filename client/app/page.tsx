"use client";

/**
 * Main Sea Battle game component.
 * Handles phases: placing (drag ships to board), attacking (click opponent cells).
 * Supports edit mode post-placement for repositioning ships.
 */
import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import {
  SHIPS,
  TOTAL_SHIP_CELLS,
  canPlaceShip,
  placeShipOnBoard,
  Ship,
  Cell,
  ShipPlacement,
} from "@/app/lib";
import { toast } from "sonner";

interface Board {
  cells: Cell[][];
  totalShipCells: number;
}

const GRID_SIZE = 10;

export default function SeaBattle() {
  // Game phase: 'placing' for initial setup, 'attacking' for gameplay.
  const [phase, setPhase] = useState<"placing" | "attacking">("placing");
  // Edit mode: allows repositioning ships after placement.
  const [editMode, setEditMode] = useState(false);
  // Player's board state: cells and total ship cells placed.
  const [playerBoard, setPlayerBoard] = useState<Board>({
    cells: [],
    totalShipCells: 0,
  });
  // Opponent's board: hidden ships, revealed on hits/misses.
  const [opponentBoard, setOpponentBoard] = useState<Board>({
    cells: [],
    totalShipCells: 0,
  });
  // Ships not yet placed (from SHIPS).
  const [unplacedShips, setUnplacedShips] = useState<Ship[]>(SHIPS);
  // Tracks placed ships' positions and orientations for editing.
  const [placedShips, setPlacedShips] = useState<ShipPlacement[]>([]);
  // Tracks opponent's placed ships for per-ship sinking detection.
  const [opponentPlacedShips, setOpponentPlacedShips] = useState<
    ShipPlacement[]
  >([]);
  // Current placement direction: toggled by button during placing.
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  /**
   * Auto-advance to attacking phase when all ships placed.
   */
  useEffect(() => {
    if (phase === "placing" && unplacedShips.length === 0) {
      setPhase("attacking");
    }
  }, [phase, unplacedShips.length]);

  /**
   * Initializes boards on mount: empty player, random opponent fleet (and track placements).
   */
  useEffect(() => {
    const initBoard = (): Board => ({
      cells: Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) => ({
          id: row * GRID_SIZE + col,
          row,
          col,
        }))
      ),
      totalShipCells: 0,
    });

    setPlayerBoard(initBoard());
    const oppCells = initBoard().cells;
    const oppPlacements: ShipPlacement[] = [];
    // Modified: Track placements during random fleet setup
    SHIPS.forEach((ship) => {
      let attempts = 0;
      while (attempts < 100) {
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        const dir = Math.random() > 0.5 ? "horizontal" : "vertical";
        if (canPlaceShip(oppCells, row, col, ship.length, dir)) {
          placeShipOnBoard(oppCells, row, col, ship.length, dir, true);
          oppPlacements.push({ ship, row, col, orientation: dir });
          break;
        }
        attempts++;
      }
    });
    setOpponentPlacedShips(oppPlacements);
    setOpponentBoard({ cells: oppCells, totalShipCells: TOTAL_SHIP_CELLS });
  }, []);

  /**
   * Helper: Check if a specific opponent ship is fully sunk (all cells hit).
   */
  const isShipSunk = (placement: ShipPlacement, cells: Cell[][]): boolean => {
    const { ship, row, col, orientation } = placement;
    const length = ship.length;
    let hitCount = 0;
    for (let i = 0; i < length; i++) {
      const r = orientation === "horizontal" ? row : row + i;
      const c = orientation === "horizontal" ? col + i : col;
      if (cells[r][c].hit) hitCount++;
    }
    return hitCount === length;
  };

  /**
   * Helper: Mark surrounding cells (8 directions) as miss if empty/unmarked.
   * Called when a ship is sunk.
   */
  const markSurroundingMisses = (
    placement: ShipPlacement,
    cells: Cell[][]
  ): Cell[][] => {
    const { row, col, orientation } = placement;
    const length = placement.ship.length;
    const newCells = cells.map((r) => [...r]);
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

    // For each cell in the sunk ship, check its neighbors
    for (let i = 0; i < length; i++) {
      const sr = orientation === "horizontal" ? row : row + i;
      const sc = orientation === "horizontal" ? col + i : col;
      for (const [dr, dc] of directions) {
        const nr = sr + dr;
        const nc = sc + dc;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
          const targetCell = newCells[nr][nc];
          // Mark as miss if empty (no ship) and not already marked
          if (!targetCell.ship && !targetCell.hit && !targetCell.miss) {
            targetCell.miss = true;
          }
        }
      }
    }
    return newCells;
  };

  /**
   * Generates random placement for player's fleet: clears board, places ships randomly, populates placedShips.
   * Only during placing phase; advances if all placed.
   */
  const generateRandomPlacement = () => {
    if (phase !== "placing") return;
    const initBoard = (): Board => ({
      cells: Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) => ({
          id: row * GRID_SIZE + col,
          row,
          col,
        }))
      ),
      totalShipCells: 0,
    });
    const newPlayerCells = initBoard().cells;
    const newPlacements: ShipPlacement[] = [];
    SHIPS.forEach((ship) => {
      let attempts = 0;
      while (attempts < 100) {
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        const dir = Math.random() > 0.5 ? "horizontal" : "vertical";
        if (canPlaceShip(newPlayerCells, row, col, ship.length, dir)) {
          placeShipOnBoard(newPlayerCells, row, col, ship.length, dir, true);
          newPlacements.push({ ship, row, col, orientation: dir });
          break;
        }
        attempts++;
      }
    });
    setPlayerBoard({ cells: newPlayerCells, totalShipCells: TOTAL_SHIP_CELLS });
    setPlacedShips(newPlacements);
    setUnplacedShips([]); // All "placed" via random
    // Auto-advance to attacking if successful
    if (newPlacements.length === SHIPS.length) {
      setPhase("attacking");
    }
  };

  /**
   * Handles drop of ship (new or edit): validates, updates board/cells, manages lists.
   * For edits: removes old positions first.
   */
  const handleShipDrop = (
    item: {
      ship: Ship;
      orientation: "horizontal" | "vertical";
      isNew: boolean;
      oldRow?: number;
      oldCol?: number;
      oldOrientation?: "horizontal" | "vertical";
    },
    startRow: number,
    startCol: number
  ) => {
    const {
      ship,
      orientation: dropOrientation,
      isNew,
      oldRow,
      oldCol,
      oldOrientation,
    } = item;
    const length = ship.length;
    if (
      !canPlaceShip(
        playerBoard.cells,
        startRow,
        startCol,
        length,
        dropOrientation
      )
    )
      return false;

    const newCells = playerBoard.cells.map((r) => [...r]);
    let newTotal = playerBoard.totalShipCells;
    if (!isNew) {
      // Remove old positions for edit
      for (let i = 0; i < length; i++) {
        const r = oldOrientation === "horizontal" ? oldRow! : oldRow! + i;
        const c = oldOrientation === "horizontal" ? oldCol! + i : oldCol!;
        newCells[r][c].ship = false;
      }
      // Update placed ship position (note: orientation can change on drop!)
      setPlacedShips((prev) =>
        prev.map((p) =>
          p.ship.id === ship.id
            ? {
                ...p,
                row: startRow,
                col: startCol,
                orientation: dropOrientation,
              }
            : p
        )
      );
    } else {
      // Place new ship
      placeShipOnBoard(
        newCells,
        startRow,
        startCol,
        length,
        dropOrientation,
        true
      );
      setPlacedShips((prev) => [
        ...prev,
        { ship, row: startRow, col: startCol, orientation: dropOrientation },
      ]);
      setUnplacedShips((prev) => prev.filter((s) => s.id !== ship.id));
      newTotal += length;
    }
    setPlayerBoard({ cells: newCells, totalShipCells: newTotal });

    // If editing a ship and it was the last unplaced (edge case), stay in mode
    if (isNew && unplacedShips.length === 1) {
      setPhase("attacking");
    }
    return true;
  };

  /**
   * Handles player attack: marks hit/miss, checks win (all opponent cells hit).
   * New: If a ship is sunk, auto-mark surrounding empty cells as misses.
   */
  const attack = (row: number, col: number) => {
    if (
      phase !== "attacking" ||
      opponentBoard.cells[row][col].hit ||
      opponentBoard.cells[row][col].miss
    )
      return;

    const newCells = opponentBoard.cells.map((r) => [...r]);
    const wasShip = newCells[row][col].ship;
    if (wasShip) {
      newCells[row][col].hit = true;
      // Check for sunk ships after this hit
      let sunkAny = false;
      for (const placement of opponentPlacedShips) {
        if (isShipSunk(placement, newCells)) {
          // Mark surroundings as misses for this sunk ship
          const updatedForSunk = markSurroundingMisses(placement, newCells);
          newCells.forEach((rowArr, r) => {
            rowArr.forEach((cell, c) => {
              newCells[r][c] = { ...updatedForSunk[r][c] };
            });
          });
          sunkAny = true;
        }
      }
      if (sunkAny) {
        // Optional: Alert per-ship sink
        // alert('A ship is sunk! Surrounding areas revealed.');
      }
    } else {
      newCells[row][col].miss = true;
    }
    setOpponentBoard({
      cells: newCells,
      totalShipCells: opponentBoard.totalShipCells,
    });

    const allSunk =
      newCells.flat().filter((c) => c.ship && c.hit).length ===
      opponentBoard.totalShipCells;
    if (allSunk) {
      toast.success("You win! All opponent ships sunk.");
      resetGame();
    }
  };

  /**
   * Resets game to initial state: clears boards, resets ships/lists.
   */
  const resetGame = () => {
    setPhase("placing");
    setEditMode(false);
    setUnplacedShips(SHIPS);
    setPlacedShips([]);
    setOpponentPlacedShips([]); // Reset opponent tracking
    setOrientation("horizontal");
    const initBoard = (): Board => ({
      cells: Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) => ({
          id: row * GRID_SIZE + col,
          row,
          col,
        }))
      ),
      totalShipCells: 0,
    });
    setPlayerBoard(initBoard());
    const oppCells = initBoard().cells;
    const oppPlacements: ShipPlacement[] = [];
    SHIPS.forEach((ship) => {
      let attempts = 0;
      while (attempts < 100) {
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        const dir = Math.random() > 0.5 ? "horizontal" : "vertical";
        if (canPlaceShip(oppCells, row, col, ship.length, dir)) {
          placeShipOnBoard(oppCells, row, col, ship.length, dir, true);
          oppPlacements.push({ ship, row, col, orientation: dir });
          break;
        }
        attempts++;
      }
    });
    setOpponentPlacedShips(oppPlacements);
    setOpponentBoard({ cells: oppCells, totalShipCells: TOTAL_SHIP_CELLS });
  };

  /**
   * Generates Tailwind class for a cell based on state (hit, miss, ship, etc.).
   * Applies opacity/hover for opponent board.
   */
  const getCellClass = (cell: Cell, isPlayer: boolean) => {
    let cls =
      "border border-gray-200 w-8 h-8 flex items-center justify-center text-xs cursor-pointer hover:bg-gray-50 transition-colors";
    if (cell.hit) cls += " bg-red-100 text-red-600 border-red-300";
    if (cell.miss) cls += " bg-blue-100 text-blue-600 border-blue-300";
    if (cell.ship && isPlayer)
      cls += " bg-gray-800 hover:bg-gray-800 text-white";
    if (!isPlayer && !cell.hit && !cell.miss) cls += " bg-gray-50";
    return cls;
  };

  /**
   * Draggable component for unplaced ships in sidebar.
   * Drags ship data for new placement.
   */
  const DraggableShip = ({ ship }: { ship: Ship }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "ship",
      item: { ship, orientation, isNew: true },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return drag(
      <div
        className={`bg-gray-800 text-white px-2 py-1 text-xs font-medium rounded flex items-center justify-center mb-1 cursor-move ${
          isDragging ? "opacity-50" : ""
        }`}
        style={{ width: `${ship.length * 32}px` }}
      >
        {ship.name}
      </div>
    );
  };

  /**
   * Draggable component for placed ships in edit sidebar.
   * Drags ship data for repositioning (includes old position).
   */
  const DraggableShipForMove = ({
    placement,
  }: {
    placement: ShipPlacement;
  }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "ship",
      item: {
        ship: placement.ship,
        orientation: placement.orientation,
        isNew: false,
        oldRow: placement.row,
        oldCol: placement.col,
        oldOrientation: placement.orientation,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const dirSymbol = placement.orientation === "horizontal" ? "↔" : "↕";
    return drag(
      <div
        className={`bg-gray-700 text-white px-2 py-1 text-xs font-medium rounded flex items-center justify-center mb-1 cursor-move ${
          isDragging ? "opacity-50" : ""
        }`}
        style={{ width: `${placement.ship.length * 32}px` }}
      >
        {placement.ship.name} {dirSymbol}
      </div>
    );
  };

  /**
   * Droppable cell: accepts ship drops, handles attacks via click.
   * Highlights on hover during placement/edit.
   */
  const DroppableCell = ({
    cell,
    isPlayer,
    onClick,
    children,
  }: {
    cell: Cell;
    isPlayer: boolean;
    onClick: (row: number, col: number) => void;
    children?: React.ReactNode;
  }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "ship",
      drop: (item: any) => {
        if (
          (phase === "placing" || (phase === "attacking" && editMode)) &&
          isPlayer
        ) {
          handleShipDrop(item, cell.row, cell.col);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));

    const handleClick = () => {
      if (phase === "attacking" && !isPlayer) {
        onClick(cell.row, cell.col);
      }
    };

    let cls = getCellClass(cell, isPlayer);
    if (
      isOver &&
      (phase === "placing" || (phase === "attacking" && editMode)) &&
      isPlayer
    )
      cls += " bg-green-100 border-green-300";

    return drop(
      <div className={cls} onClick={handleClick}>
        {children}
      </div>
    );
  };

  /**
   * Renders a full board: labels (A-J cols, 1-10 rows), cells with drop/click handlers.
   * Player shows ships; opponent hides until hit.
   */
  const renderBoard = (
    board: Board,
    isPlayer: boolean,
    onClick: (row: number, col: number) => void
  ) => (
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-gray-600">
        {isPlayer ? "Your Fleet" : "Enemy Seas"}
      </h3>
      {/* Column labels */}
      <div className="grid grid-cols-11 gap-0">
        <div className="w-8 h-0"></div>
        {Array.from({ length: GRID_SIZE }, (_, col) => (
          <div
            key={col}
            className="border border-gray-200 w-8 h-8 flex items-center justify-center font-bold text-gray-500 text-xs bg-white"
          >
            {String.fromCharCode(65 + col)}
          </div>
        ))}
      </div>
      {/* Board grid */}
      <div className="grid grid-cols-11 gap-0 bg-white rounded shadow-sm border border-gray-200">
        {board.cells.map((row, r) => (
          <React.Fragment key={r}>
            <div className="border border-gray-200 w-8 h-8 flex items-center justify-center font-bold text-gray-500 text-xs bg-white">
              {r + 1}
            </div>
            {row.map((cell) => (
              <DroppableCell
                key={cell.id}
                cell={cell}
                isPlayer={isPlayer}
                onClick={onClick}
              >
                {cell.hit
                  ? "🔴"
                  : cell.miss
                  ? "○"
                  : cell.ship && isPlayer
                  ? "■"
                  : ""}
              </DroppableCell>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // Show sidebar only during placing or edit mode.
  const showSidebar =
    phase === "placing" || (phase === "attacking" && editMode);

  // Helper: Check if edit is possible (any ships placed)
  const canEdit = placedShips.length > 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Sea Battle
        </h1>
        <div className="flex gap-6 mb-4">
          {showSidebar && (
            <div className="w-32 space-y-2">
              <h3 className="text-sm font-medium text-gray-600">
                {phase === "placing" ? "Fleet" : "Edit Fleet"}
              </h3>
              {phase === "placing"
                ? unplacedShips.map((ship) => (
                    <DraggableShip key={ship.id} ship={ship} />
                  ))
                : placedShips.map((placement) => (
                    <DraggableShipForMove
                      key={placement.ship.id}
                      placement={placement}
                    />
                  ))}
              {phase === "placing" && (
                <>
                  <button
                    onClick={generateRandomPlacement}
                    className="w-full px-2 py-1 text-xs bg-blue-200 hover:bg-blue-300 rounded text-blue-700 transition-colors"
                  >
                    Random
                  </button>
                  <button
                    onClick={() =>
                      setOrientation(
                        orientation === "horizontal" ? "vertical" : "horizontal"
                      )
                    }
                    className="w-full px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded text-gray-600 transition-colors"
                  >
                    {orientation === "horizontal"
                      ? "↕ Vertical"
                      : "↔ Horizontal"}
                  </button>
                </>
              )}
            </div>
          )}
          <div className="flex gap-6">
            {renderBoard(playerBoard, true, () => {})}
            {renderBoard(opponentBoard, false, attack)}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            {phase === "placing"
              ? `Place ${unplacedShips.length} ships`
              : editMode
              ? "Edit fleet"
              : "Hunt the fleet"}
          </span>
          {canEdit && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded text-gray-600 transition-colors"
            >
              Edit Fleet
            </button>
          )}
          {editMode && (
            <button
              onClick={() => setEditMode(false)}
              className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded text-gray-600 transition-colors"
            >
              Done
            </button>
          )}
          <button
            onClick={resetGame}
            className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded text-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </DndProvider>
  );
}
