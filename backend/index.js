const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const app = express();

const api = require("./routes/apiRoutes.js");
const auth = require("./routes/userRoutes.js");

app.use("/api", api);
app.use("/auth", auth);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
