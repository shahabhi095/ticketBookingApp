const express = require("express");

const { ticketModel, coachModel } = require("../model/model");
const ticketRouter = express.Router();

//get all ticket for displaying
ticketRouter.get("/ticket", async (req, res) => {
  const bookingDetails = await coachModel.find();
  res.send(bookingDetails[0].coach);
});

//after getting userinput book ticket

ticketRouter.post("/ticket", async (req, res) => {
  let requestedBooking = req.body.number_of_seats;
  let seatStructure = await coachModel.find();
  let id = seatStructure[0]._id;
  seatStructure = seatStructure[0].coach;

  const seatsInRow = 7;
  const lastRowSeats = 3;
  const totalRows = 12;
  const seatLayout = seatStructure;

  function seatsAvailableInRow(row, numOfSeats) {
    if (row === 11) {
      for (let i = 0; i <= lastRowSeats - numOfSeats; i++) {
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
    } else {
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
    }

    return -1;
  }
  // Check Total Number of vacant seats.

  function checkVacantSeats(seatLayout) {
    let count = 0;

    for (let i = 0; i < 12; i++) {
      if (i == 11) {
        for (let j = 0; j < 3; j++) {
          if (seatLayout[i][j] == false) {
            count++;
          }
        }
      } else {
        for (let j = 0; j < 7; j++) {
          if (seatLayout[i][j] == false) {
            count++;
          }
        }
      }
    }

    return count;
  }

  // Function to reserve seats
  async function reserveSeats(numOfSeats) {
    if (+numOfSeats > seatsInRow) {
      res.send({ seat: "Cannot reserve more than 7 seats at a time." });
      return;
    }

    let row = -1;
    let seatIndex = -1;

    // Look for available seats in one row
    for (let i = 0; i < 12; i++) {
      const availableSeatIndex = seatsAvailableInRow(i, +numOfSeats);
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
    const reservedSeats = [];
    const reservedSeatsNum = [];

    if (row !== -1 && seatIndex !== -1) {
      for (let i = seatIndex; i < seatIndex + numOfSeats; i++) {
        seatLayout[row][i] = true;
        reservedSeats.push(`Row ${row + 1}, Seat ${i + 1}`);
        reservedSeatsNum.push(row * 7 + i + 1);
      }
      console.log(
        `Successfully reserved ${numOfSeats} seats: ${reservedSeats.join(", ")}`
      );
      //updating seat status in coach
      await coachModel.findByIdAndUpdate({ _id: id }, { coach: seatLayout });
      res.send({
        seat: `Successfully reserved ${numOfSeats} seat, seats Number: ${reservedSeatsNum.join(
          ", "
        )}`,
      });
    } else {
      let value = checkVacantSeats(seatLayout);
      if (numOfSeats <= value) {
        let count = 0;
        let flag = false;
        for (let i = 0; i < 12; i++) {
          if (i == 11) {
            for (let j = 0; j < 3; j++) {
              if (seatLayout[i][j] == false) {
                seatLayout[i][j] = true;
                reservedSeats.push(`Row ${i + 1}, Seat ${j + 1}`);
                reservedSeatsNum.push(i * 7 + j + 1);
                count++;
                if (count == numOfSeats) {
                  flag = true;
                  break;
                }
              }
            }
          } else {
            for (let j = 0; j < 7; j++) {
              if (seatLayout[i][j] == false) {
                seatLayout[i][j] = true;
                reservedSeats.push(`Row ${i + 1}, Seat ${j + 1}`);
                reservedSeatsNum.push(i * 7 + j + 1);

                count++;
                if (count == numOfSeats) {
                  flag = true;
                  break;
                }
              }
            }
          }
          if (flag == true) {
            await coachModel.findByIdAndUpdate(
              { _id: id },
              { coach: seatLayout }
            );
            res.send({
              seat: `Successfully reserved ${numOfSeats} seat, seats Number: ${reservedSeatsNum.join(
                ", "
              )}`,
            });
            break;
          }
        }
      } else {
        res.send({
          seat: `No seats available.`,
        });
        console.log("No seats available.");
      }
    }
  }
  reserveSeats(+requestedBooking);
});

//setting up new coach

ticketRouter.get("/coach", async (req, res) => {
  const coach = new coachModel({
    coach: [
      new Array(7).fill(false),
      new Array(7).fill(false),
      new Array(7).fill(false),
      new Array(7).fill(false),
      new Array(7).fill(false),
      new Array(7).fill(false),
      new Array(7).fill(false),
      new Array(7).fill(false),
      new Array(7).fill(false),
      new Array(7).fill(false),
      new Array(7).fill(false),
      new Array(3).fill(false),
    ],
  });

  await coach.save();
  res.send("new Coach added");
});
module.exports = { ticketRouter };
