import { io } from "./main";
import { Socket } from "socket.io";
import { GameOptions } from "./game";

export const getSocketRooms = (socket: Socket): string[] => {
  const socketRooms = Array.from(socket.rooms).filter((r) => r !== socket.id);

  return socketRooms;
};

const socketsInRoom = async (roomID: string): Promise<number> => {
  const sockets = await io.in(roomID).fetchSockets();

  return sockets.length;
};

export default (socket: Socket) => {
  socket.on("join_room", async (roomID: string) => {
    const roomSize = await socketsInRoom(roomID);

    switch (roomSize) {
      case 0:
        await socket.join(roomID);
        socket.emit("current_player_joined");
        break;
      case 1:
        await socket.join(roomID);
        socket.emit("current_player_joined");
        socket.emit("players_joined");
        socket.to(roomID).emit("players_joined");
        break;
      default:
        socket.emit(
          "room_occupied",
          `"${roomID}" room is currently full. Try a different room. `
        );
    }
  });

  socket.on("set_game_options", (options: GameOptions) => {
    const gameRoom = getSocketRooms(socket) && getSocketRooms(socket)[0];

    socket.emit("game_started", { start: true, player: "x", ...options });
    socket
      .to(gameRoom)
      .emit("game_started", { start: false, player: "o", ...options });
  });
};
