import { io } from "./main";
import { Socket } from "socket.io";
import { getSocketRooms } from "./room";

export interface GameOptions {
  dimension: 3 | 5;
}

type SquareVal = "x" | "o" | null;

function gameEnded(socket: Socket) {
  const gameRoom = getSocketRooms(socket) && getSocketRooms(socket)[0];

  socket.emit("game_ended");
  socket.to(gameRoom).emit("game_ended");

  io.socketsLeave(gameRoom);
}

export default (socket: Socket) => {
  socket.on("update_game", (squares: SquareVal[]) => {
    const gameRoom = getSocketRooms(socket) && getSocketRooms(socket)[0];

    socket.to(gameRoom).emit("game_updated", squares);
  });

  socket.on("end_game", () => {
    gameEnded(socket);
  });

  socket.on("disconnecting", () => {
    gameEnded(socket);
  });
};
