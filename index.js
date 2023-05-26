const express = require("express");
const { connection } = require("./model/model");
const { ticketRouter } = require("./controller/route");
const app = express();
app.use(express.json());
require("dotenv").config();
const cors = require("cors");
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Home");
});

app.use("/", ticketRouter);

app.listen(process.env.port, async () => {
  console.log(`server is running on port ${process.env.port}`);
  try {
    await connection;
    console.log("server is connected to DB");
  } catch (err) {
    console.log({ msg: "something went wrong", err: err.message });
  }
});
