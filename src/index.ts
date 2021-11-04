import server from "./server";
import mainController from "./controllers/main";

mainController();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
