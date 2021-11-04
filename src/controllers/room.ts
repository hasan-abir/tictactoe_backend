import { io } from "./main";
import { Socket } from "socket.io";

const getSocketRooms = (socket: Socket): string[] => {
  const socketRooms = Array.from(socket.rooms).filter((r) => r !== socket.id);

  return socketRooms;
};

const roomOccupied = (roomID: string, socket: Socket): boolean => {
  const connectedSockets = io.sockets.adapter.rooms.get(roomID);

  const socketRooms = getSocketRooms(socket);

  return socketRooms.length > 0 || connectedSockets?.size === 2;
};

export default (socket: Socket) => {
  socket.on("join_room", async (roomID: string) => {
    if (roomOccupied(roomID, socket)) {
      socket.emit(
        "room_occupied",
        `"${roomID}" room is currently full. Try a different room. `
      );
    } else {
      await socket.join(roomID);

      socket.emit("current_player_joined");

      const room = io.sockets.adapter.rooms.get(roomID);

      if (room && room.size === 2) {
        socket.emit("players_joined", roomID);
        socket.to(roomID).emit("players_joined", roomID);
      }
    }
  });

  interface GameOptions {
    dimension: 3 | 5;
  }

  socket.on("set_game_options", (roomID: string, options: GameOptions) => {
    socket.emit("game_started", { start: true, player: "x", ...options });
    socket
      .to(roomID)
      .emit("game_started", { start: false, player: "o", ...options });
  });
};
