const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const app = express();
const router = express.Router();
var expressWs = require("express-ws")(app);
const api = require("./routes/apiRoutes.js");
const auth = require("./routes/userRoutes.js");

app.use("/echo", router);
app.use("/api", api);
app.use("/auth", auth);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
