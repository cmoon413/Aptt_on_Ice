// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
var Jeeves = require("../routes/Jeeves");
var db = require("../models");
const moment = require("moment");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/members");
    }
    res.render("login");
  });

  app.get("/signup", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/members");
    }
    res.render("signup");
  });
  app.get("/", isAuthenticated, function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/members");
    }
    res.render("login");
  });
  app.get("/members", isAuthenticated, function(req, res) {
    let Reservations = Jeeves.viewAllUserReservations(db, req);
    Reservations.then((data) => {
      res.render("members", { data });
    });
  });
  app.get("/make-reservation", isAuthenticated, function(req, res) {
    let Reservations = Jeeves.viewAllReservations(db);
    console.log(Reservations);
    Reservations.then((data) => {
      function trimDate(data) {
        data.start_Time = moment(data.start + "+8:00")
          .format("HH")
          .slice(0, 4);
        data.end_Time = data.end.toString().slice(16, 21);
      }
      const week = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      };
      data.forEach((reservation) => {
        switch (moment(reservation.start).format("dddd")) {
          case "Sunday":
            trimDate(reservation);
            week.sunday.push(reservation);
            break;
          case "Monday":
            trimDate(reservation);
            week.monday.push(reservation);
            break;
          case "Tuesday":
            trimDate(reservation);
            week.tuesday.push(reservation);
            break;
          case "Wednesday":
            trimDate(reservation);
            week.wednesday.push(reservation);
            break;
          case "Thursday":
            trimDate(reservation);
            week.thursday.push(reservation);
            break;
          case "Friday":
            trimDate(reservation);
            week.friday.push(reservation);
            break;
          case "Saturday":
            trimDate(reservation);
            week.saturday.push(reservation);
            break;
        }
      });
      res.render("calendar", week);
    });
  });
};
