"use client";
import { isConnectedAtom, wsAtom } from "@/atoms/atom";
import { useAtom } from "jotai";
import { useEffect } from "react";

const WSProvider = () => {
  const [, setWs] = useAtom(wsAtom);
  const [, setIsConnected] = useAtom(isConnectedAtom);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");

    socket.onopen = () => {
      setIsConnected(true);
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    setWs(socket);

    return () => socket.close();
  }, []);

  return null;
};

export default WSProvider;
