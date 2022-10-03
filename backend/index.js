const express = require("express");
const cors = require("cors");
require("dotenv").config();
var bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

//other stuff
const api = require("./routes/apiRoutes.js");
const auth = require("./routes/userRoutes.js");

const app = express();
app.use(bodyParser.json());
app.use("/api", api);
app.use("/auth", auth);

app.use(cors());
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
