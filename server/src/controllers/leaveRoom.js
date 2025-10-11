import { rooms } from "../lib";
import { sendToRoom } from "./sendToRoom";

export function leaveRoom(ws) {
  try {
    const roomId = ws.roomId;
    if (!roomId || !rooms.has(roomId)) {
      console.log(`Attempt to leave non-existent room ${roomId || 'undefined'}`);
      return;
    }
    
    const room = rooms.get(roomId);
    room.clients.delete(ws);
    
    // Remove player by ws reference (accurate tracking)
    const previousPlayerCount = room.players.length;
    room.players = room.players.filter(p => p.ws !== ws);
    
    console.log(`User left from ${roomId} (players left: ${room.players.length}/${previousPlayerCount})`);
    
    if (room.clients.size === 0) {
      rooms.delete(roomId);
      console.log(`Room ${roomId} deleted (empty)`);
    } else {
      // Optional: Broadcast that a player left
      sendToRoom(roomId, {
        type: "playerLeft",
        room: roomId
      });
    }
  } catch (error) {
    console.error(`Error in leaveRoom: ${error.message}`);
  }
}