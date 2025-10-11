import { sendToRoom } from "../controllers/sendToRoom";
import { determineWinner } from "../handlers/determineWinner";
import { rooms } from "../lib";

export function handleGameMove(roomId, ws, choice) {
  const room = rooms.get(roomId);
  if (!room) return;

  // Find and update player's choice
  const player = room.players.find((p) => p.ws === ws);
  if (!player) return;

  player.currentChoice = choice;

  // Broadcast the move with player name
  sendToRoom(roomId, {
    type: "playerMove",
    from: player.name,
    choice: choice,
  });

  // Check if both players have chosen
  const p1Choice = room.players.find(
    (p) => p.name === "player1"
  )?.currentChoice;
  const p2Choice = room.players.find(
    (p) => p.name === "player2"
  )?.currentChoice;

  if (p1Choice && p2Choice) {
    const winner = determineWinner(p1Choice, p2Choice);
    sendToRoom(roomId, {
      type: "gameResult",
      winner: winner,
      choices: { player1: p1Choice, player2: p2Choice },
    });

    // Reset choices for next round
    room.players.forEach((p) => (p.currentChoice = null));
    sendToRoom(roomId, { type: "nextRound" });
  }
}
