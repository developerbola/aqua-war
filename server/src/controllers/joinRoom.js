import { rooms } from "../lib";
import { sendToRoom } from "./sendToRoom";

export function joinRoom(roomId, ws) {
  try {
    if (!rooms.has(roomId)) {
      const errorMsg = JSON.stringify({ error: "Room does not exist!" });
      if (ws.readyState === ws.OPEN) {
        ws.send(errorMsg);
      }
      return;
    }
    
    const room = rooms.get(roomId);
    if (room.players.length >= 2) {
      const errorMsg = JSON.stringify({ error: "Room is full! Only 2 players allowed." });
      if (ws.readyState === ws.OPEN) {
        ws.send(errorMsg);
      }
      return;
    }
    
    // Add player based on current size with ws reference
    const playerName = room.players.length === 0 ? "player1" : "player2";
    const player = { name: playerName, ws: ws, currentChoice: null };
    room.players.push(player);
    room.clients.add(ws);
    
    ws.roomId = roomId;
    console.log(`Player ${playerName} joined room ${roomId}`);
    
    // Notify the client
    const joinMsg = JSON.stringify({ 
      type: "joinedRoom", 
      roomId: roomId,
      player: { name: playerName } 
    });
    if (ws.readyState === ws.OPEN) {
      ws.send(joinMsg);
    }
    
    // Optional: Broadcast to room that a new player joined
    sendToRoom(roomId, {
      type: "playerJoined",
      player: playerName,
      room: roomId
    });

    // If second player joins, notify game start
    if (room.players.length === 2) {
      sendToRoom(roomId, { type: "gameStart" });
    }
  } catch (error) {
    console.error(`Error in joinRoom for room ${roomId}: ${error.message}`);
    const errorMsg = JSON.stringify({ error: "Internal server error during join!" });
    if (ws.readyState === ws.OPEN) {
      ws.send(errorMsg);
    }
  }
}