import server from "../server";
import { Server } from "socket.io";
import joinController from "./room";

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export default () => {
  io.on("connection", (socket) => {
    console.log("New socket connected");

    joinController(socket);
  });
};
