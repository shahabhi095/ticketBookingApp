const express = require("express");

const { ticketModel, coachModel } = require("./model");
const ticketRouter = express.Router();


ticketRouter.get("/ticket", async (req, res) => {
    const bookingDetails = await coachModel.find();
  res.send(bookingDetails[0].coach);
  console.log(bookingDetails[0].coach)
});

//after getting userinput

ticketRouter.post("/ticket", async (req, res) => {
    let requestedBooking = req.body.number_of_seats;
  let seatStructure = await coachModel.find();
seatStructure = seatStructure[0].coach;

const seatsInRow = 7;
const lastRowSeats = 3;
const totalRows = 12
const seatLayout = seatStructure;

function seatsAvailableInRow(row, numOfSeats) {
  for (let i = 0; i <= seatsInRow - numOfSeats; i++) {
    let available = true;
    for (let j = i; j < i + numOfSeats; j++) {
      if (seatLayout[row][j]) {
        available = false;
        break;
      }
    }
    if (available) {
      return i;
    }
  }
  return -1;
}

// Function to reserve seats
function reserveSeats(numOfSeats) {
  if (numOfSeats > seatsInRow) {
    console.log("Cannot reserve more than 7 seats at a time.");
    return;
  }

  let row = -1;
  let seatIndex = -1;

  // Look for available seats in one row
  for (let i = 0; i < 12; i++) {
    const availableSeatIndex = seatsAvailableInRow(i, numOfSeats);
    if (availableSeatIndex !== -1) {
      row = i;
      seatIndex = availableSeatIndex;
      break;
    }
  }

  // If seats are not available in one row, book in nearby rows
  if (row === -1) {
    for (let i = 0; i < 12; i++) {
      const availableSeatIndex = seatsAvailableInRow(i, numOfSeats);
      if (availableSeatIndex !== -1) {
        row = i;
        seatIndex = availableSeatIndex;
        
        break;
      }
    }
  }

  // Reserve the seats
  if (row !== -1 && seatIndex !== -1) {
    const reservedSeats = [];
    for (let i = seatIndex; i < seatIndex + numOfSeats; i++) {
      seatLayout[row][i] = true;
      reservedSeats.push(`Row ${row + 1}, Seat ${i + 1}`);
    }
    console.log(
      `Successfully reserved ${numOfSeats} seats: ${reservedSeats.join(", ")}`
    );

    res.send({ ticket: reservedSeats });
  } else {
    console.log("No seats available.");
  }
}

reserveSeats(requestedBooking);

//console.log(new Array(7).fill(false));
console.log(requestedBooking);

});

ticketRouter.get("/coach", async (req, res) => {
  const coach = new coachModel({coach:[
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false],
  ]});

  await coach.save()
  res.send("new Coach added");

});
module.exports = { ticketRouter };
