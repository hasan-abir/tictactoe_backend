import express from "express";
import http from "http";

const app = express();

export default http.createServer(app);
