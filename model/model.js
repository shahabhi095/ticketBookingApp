const mongoose = require("mongoose");
require("dotenv").config();
const connection = mongoose.connect(process.env.MONGO_URL);

const ticketSchema = mongoose.Schema({
  number_of_seats: Number,
});

const coachSchema = mongoose.Schema({
  coach: Object,
});

const ticketModel = mongoose.model("ticket", ticketSchema);
const coachModel = mongoose.model("coach", coachSchema);
module.exports = {
  connection,
  ticketModel,
  coachModel,
};
