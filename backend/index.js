const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const app = express();
const router = express.Router();
const api = require("./routes/apiRoutes.js");
const auth = require("./routes/userRoutes.js");

const WebSocketServer = require("ws");

const wss = new WebSocketServer.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("Server received: %s", message);
    //echo message for all clients
    wss.clients.forEach(function (client) {
      client.send(`${message}`);
      //client.send(message);
    });
  });

  ws.send("Server sais: hi");
});

app.use("/", router);
app.use("/api", api);
app.use("/auth", auth);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
