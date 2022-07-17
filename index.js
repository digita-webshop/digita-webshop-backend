const express = require("express");
const app = express();

const mongoose = require("mongoose");
const debug = require("debug")("app:main");
const config = require("config");
const cors = require('cors');

const router = require("./src/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api", router);
app.use(cors())

const PORT = process.env.PORT || 5000;

mongoose
  .connect(config.get("db.address"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT, () => debug(`Server running on port ${PORT}`)))
  .catch((error) => debug("Error: ", error.message));

