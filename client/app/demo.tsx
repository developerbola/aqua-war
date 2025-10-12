"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const Demo = () => {
  const [msgs, setMsgs] = useState<string[]>([]);
  const [coord, setCoord] = useState("");

  const ws = new WebSocket("ws://localhost:8080/ws");

  useEffect(() => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "create" }));
    };

    ws.onmessage = (e) => setMsgs((prev) => [...prev, e.data]);
  }, []);

  const sendMsg = () => {
    ws.send(JSON.stringify({ type: "attack", coord }));
  };

  return (
    <div>
      <div>
        {msgs.map((e, i) => {
          return <span key={i}>{e}</span>;
        })}
      </div>
      <Input value={coord} onChange={(e) => setCoord(e.target.value)} />
      <Button variant={"outline"} onClick={sendMsg}>
        send
      </Button>
    </div>
  );
};

export default Demo;
