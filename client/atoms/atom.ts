import { atom } from "jotai";

export const wsAtom = atom<WebSocket | null>(null);
export const isConnectedAtom = atom<boolean | undefined>(undefined);
export const freezeAtom = atom<boolean>(false);
