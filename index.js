const router = require("./src/routes");

const express = require("express");
const app = express();
const debug = require("debug")("app:main");
const cors = require("cors");
const { connectdb } = require("./config/dbconfig");

connectdb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api", router);
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => debug(`Server running on port ${PORT}`));
