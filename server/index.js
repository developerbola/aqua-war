import { Hono } from "hono";
import { WebSocketServer } from "ws";
import http from "http";
import { createRoom, joinRoom, leaveRoom } from "./src/controllers/controllers";
import { handleGameMove } from "./src/handlers/handleGameMove";

const app = new Hono();

app.get("/status", (c) => c.json({ status: "ok" }));

const server = http.createServer(app.fetch);

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws) => {
  console.log(`New connection`);

  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ system: "Connected to server" }));
  }

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      if (msg.type === "create") {
        if (ws.roomId) {
          const errorMsg = JSON.stringify({
            error: "Already in a room! Leave first.",
          });
          if (ws.readyState === ws.OPEN) {
            ws.send(errorMsg);
          }
          return;
        }
        createRoom(ws);
        return;
      }

      if (msg.type === "join") {
        if (ws.roomId) {
          const errorMsg = JSON.stringify({
            error: "Already in a room! Leave first.",
          });
          if (ws.readyState === ws.OPEN) {
            ws.send(errorMsg);
          }
          return;
        }
        joinRoom(msg.room, ws);
        return;
      }

      // Handle game move only if in a room
      if (msg.type === "move" && ws.roomId) {
        const validChoices = ["rock", "paper", "scissors"];
        if (!validChoices.includes(msg.choice)) {
          const errorMsg = JSON.stringify({
            error: "Invalid choice! Must be rock, paper, or scissors.",
          });
          if (ws.readyState === ws.OPEN) {
            ws.send(errorMsg);
          }
          return;
        }
        handleGameMove(ws.roomId, ws, msg.choice);
      } else if (!ws.roomId) {
        const errorMsg = JSON.stringify({
          error: "Join or create a room first!",
        });
        if (ws.readyState === ws.OPEN) {
          ws.send(errorMsg);
        }
      }
    } catch (e) {
      console.error(`Message handling error: ${e.message}`);
      const errorMsg = JSON.stringify({ error: "Invalid message format!" });
      if (ws.readyState === ws.OPEN) {
        ws.send(errorMsg);
      }
    }
  });

  ws.on("close", (code, reason) => {
    console.log(
      `Connection closed for ${ws._socket?.remoteAddress}: code ${code}, reason: ${reason}`
    );
    leaveRoom(ws);
  });

  ws.on("error", (error) => {
    console.error(
      `WebSocket error for ${ws._socket?.remoteAddress}: ${error.message}`
    );
    // Optionally close the connection
    if (ws.readyState === ws.OPEN) {
      ws.close(1011, "Server error");
    }
  });

  // Handle unexpected pings/pongs or other events if needed
  ws.on("ping", () => console.log("Ping received"));
  ws.on("pong", () => console.log("Pong sent"));
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
