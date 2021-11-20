import server from "../server";
import { Server } from "socket.io";
import roomController from "./room";
import gameController from "./game";

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export default () => {
  io.on("connection", (socket) => {
    roomController(socket);
    gameController(socket);
  });
};
