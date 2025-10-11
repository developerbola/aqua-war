import { rooms } from "../lib";

export function sendToRoom(roomId, data) {
  try {
    const room = rooms.get(roomId);
    if (!room) {
      console.warn(`Broadcast to non-existent room ${roomId}`);
      return;
    }

    const msg = JSON.stringify(data);
    let sentCount = 0;
    for (const client of room.clients) {
      if (client.readyState === client.OPEN) {
        client.send(msg);
        sentCount++;
      } else {
        console.warn(`Skipping broadcast to closed client in room ${roomId}`);
      }
    }
    if (sentCount === 0) {
      console.warn(`No active clients to broadcast to in room ${roomId}`);
    }
  } catch (error) {
    console.error(`Error in sendToRoom for ${roomId}: ${error.message}`);
  }
}
