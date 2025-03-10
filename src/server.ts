import express from "express";
import http from "http";

const app = express();

app.get("/", (req, res) => {
  res.send("Tictactoe Backend");
});

export default http.createServer(app);
