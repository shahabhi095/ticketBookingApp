const express = require("express");
const {connection} = require("./model")
const {ticketRouter} = require("./route")
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors({ origin: "*" }));
app.get("/", (req, res) => {
  res.send("Home");
});

app.use("/", ticketRouter)



app.listen(4040, async () => {
  console.log(`server is running on port ${4040}`);
  try {
    await connection;
    console.log("server is connected to DB");
  } catch (err) {
    console.log({ msg: "something went wrong", err: err.message });
  }

});
