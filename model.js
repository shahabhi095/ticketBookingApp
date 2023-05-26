
const mongoose = require("mongoose");

const connection = mongoose.connect(
  "mongodb+srv://shshabhi095:shshabhi095@cluster0.xamb2ub.mongodb.net/ticket?retryWrites=true&w=majority"
);

const ticketSchema = mongoose.Schema({
  number_of_seats:Number
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