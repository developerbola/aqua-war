import { randomUUID } from "crypto";
import { rooms } from "../lib";

export function createRoom(ws) {
  try {
    let fullUuid;
    let roomId;
    let attempts = 0;
    do {
      fullUuid = randomUUID();
      roomId = fullUuid.slice(0, 8);
      attempts++;
    } while (rooms.has(roomId) && attempts < 5); // Retry if collision, max 5 tries
    
    if (attempts >= 5) {
      const errorMsg = JSON.stringify({ error: "Failed to create unique room ID!" });
      if (ws.readyState === ws.OPEN) {
        ws.send(errorMsg);
      }
      console.error(`Failed to create room after ${attempts} attempts for WS: ${ws._socket?.remoteAddress}`);
      return; // Bail out (rare)
    }
    
    const roomData = { clients: new Set(), players: [] };
    roomData.players = [
      { name: "player1", ws: ws, currentChoice: null }
    ];
    rooms.set(roomId, roomData);
    roomData.clients.add(ws);
    
    ws.roomId = roomId;
    console.log(`New room created: ${roomId} with player1`);
    
    // Send back the short room ID to the client
    const successMsg = JSON.stringify({ 
      type: "roomCreated", 
      roomId: roomId,
      player: { name: "player1" }  // Only send serializable fields
    });
    if (ws.readyState === ws.OPEN) {
      ws.send(successMsg);
    }
  } catch (error) {
    console.error(`Error in createRoom: ${error.message}`);
    const errorMsg = JSON.stringify({ error: "Internal server error during room creation!" });
    if (ws.readyState === ws.OPEN) {
      ws.send(errorMsg);
    }
  }
}