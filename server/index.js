import { Hono } from "hono";
import { WebSocketServer } from "ws";
import http from "http";

const app = new Hono();
const server = http.createServer(app.fetch);
const wss = new WebSocketServer({ server, path: "/ws" });

const rooms = new Map(); // { roomId: { players: [ws1, ws2] } }

app.get("/status", (c) => c.json({ status: "ok" }));

function send(ws, data) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function createRoom(ws) {
  const roomId = Math.random().toString(36).slice(2, 8);
  rooms.set(roomId, { players: [ws] });

  ws.roomId = roomId;
  ws.playerId = 1;

  send(ws, {
    system: `Room ${roomId} created. Waiting for opponent...`,
    roomId,
  });

  console.log(`Room ${roomId} created`);
}

function joinRoom(roomId, ws) {
  const room = rooms.get(roomId);
  if (!room) {
    send(ws, { error: "Room not found" });
    return;
  }

  if (room.players.length >= 2) {
    send(ws, { error: "Room is full" });
    return;
  }

  room.players.push(ws);
  ws.roomId = roomId;
  ws.playerId = 2;

  const [p1, p2] = room.players;
  send(p1, { system: "Opponent joined! game start." });
  send(p2, { system: `joined room ${roomId}. game start.` });

  console.log(`Player joined room ${roomId}`);
}

function leaveRoom(ws) {
  const roomId = ws.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room) return;

  room.players = room.players.filter((p) => p !== ws);

  if (room.players.length === 0) {
    rooms.delete(roomId);
    console.log(`room ${roomId} deleted (empty)`);
  } else {
    const remaining = room.players[0];
    send(remaining, { system: "Opponent left the game." });
  }
}

function handleAttack(ws, coord) {
  const validCols = "ABCDEFHIJ";
  const validRows = Array.from({ length: 10 }, (_, i) => String(i + 1));

  const col = coord[0]?.toUpperCase();
  const row = coord.slice(1);

  if (!validCols.includes(col) || !validRows.includes(row)) {
    send(ws, { error: "Invalid coordinate! use a-j and 1-10" });
    return;
  }

  const room = rooms.get(ws.roomId);
  if (!room) {
    send(ws, { error: "room not found" });
    return;
  }

  const opponent = room.players.find((p) => p !== ws);
  if (!opponent) {
    send(ws, { system: "Waiting for opponent..." });
    return;
  }

  send(opponent, { attack: coord });
  send(ws, { system: `Attack sent to ${coord}` });
  console.log(`Player ${ws.playerId} attacked ${coord} in room ${ws.roomId}`);
}

wss.on("connection", (ws) => {
  console.log("new connection");

  send(ws, { system: "Connected ro battleship server" });

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      switch (msg.type) {
        case "create":
          if (ws.roomId) {
            leaveRoom(ws);
          }
          createRoom(ws);
          break;

        case "join":
          if (ws.roomId) {
            leaveRoom(ws);
          }
          joinRoom(msg.room, ws);
          break;

        case "attack":
          if (!ws.roomId) {
            send(ws, { error: "Join or create a room first" });
            return;
          }
          handleAttack(ws, msg.coord);
          break;

        case "leave":
          leaveRoom(ws);
          break;
          
        default:
          send(ws, { error: "unknown message type" });
      }
    } catch (err) {
      console.error("Invalid message:", err);
      send(ws, { error: "Invalid message format" });
    }
  });

  ws.on("close", () => leaveRoom(ws));
  ws.on("error", (err) => console.error("WebSocket error: ", err.message));
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
