// rooms now maps roomId to { clients: Set<ws>, players: Array<{name: string, ws: ws, currentChoice: string | null }> }

export const rooms = new Map();

const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
