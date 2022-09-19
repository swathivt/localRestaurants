const express = require("express");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const {Client} = require("@googlemaps/google-maps-services-js");


const Registration = mongoose.model("Registration");
let userDoc = mongoose.model("Registration");

let session;

/******************************************************Home Page*****************************************/

router.get("/", (req, res) => {
  const client = new Client({});

  client
    .elevation({
      params: {
        locations: [{ lat: 50.481104, lng: -122.475586 }],
        key: "AIzaSyD9RvBHIptwksmmGwzixojAm8FPV9-rVyg",
      },
      timeout: 1000, // milliseconds
    })
    .then((r) => {
      console.log(r.data.results[0].elevation);
    })
    .catch((e) => {
      console.log(e.response.data.error_message);
    });

  res.render("home");
});

/******************************************************Registration Page*****************************************/
router.get("/registration", (req, res) => {
  res.render("signUp");
});

router.post(
  "/registration",
  [
    check("firstName")
      .isLength({ min: 1 })
      .withMessage("Please enter a first name"),

    check("lastName")
      .isLength({ min: 1 })
      .withMessage("Please enter a last name"),

    check("emailAddress")
      .isLength({ min: 1 })
      .withMessage("Please enter an email"),

    check("password").isLength({ min: 1 }).withMessage("Please enter password"),
  ],

  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const registration = new Registration(req.body);

      registration
        .save()
        .then(() => {
          res.send("Thank you for your registration!");
        })
        .catch((err) => {
          console.log(err);

          res.send("Sorry! Something went wrong.");
        });
    } else {
      res.send("Sorry! Something went wrong with INPUT");
    }
  }
);

/***************************************************Log In Page**************************************************/
router.get("/logIn", (req, res) => {
  res.render("logIn");
});

router.post(
  "/logIn",
  [
    check("emailAddress")
      .isLength({ min: 1 })
      .withMessage("Please enter an email"),

    check("password").isLength({ min: 1 }).withMessage("Please enter password"),
  ],

  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      // const logInModel = new Registration(req.body);

      Registration.find({
        emailAddress: req.body.emailAddress,
        password: req.body.password,
      })
        .then((userDoc) => {
          console.log(userDoc);

          if (userDoc.length == 1) {
            session = req.session;
            session.emailAddress = req.body.emailAddress;
            session.firstName = userDoc[0].firstName;
            console.log(req.session);
            console.log(
              "successfully authenticated by " + req.body.emailAddress
            );

            res.render("home", {
              firstName: req.session.firstName,
              email: req.session.emailAddress
            });
          } else {
            console.log("Failed to authenticated by " + req.body.emailAddress);
            res.render("login");
          }
        })
        .catch((err) => {
          console.log(err);

          res.send("Sorry! Something went wrong.");
        });
    } else {
      res.send("Sorry! Something went wrong with INPUT");
    }
  }
);


router.get("/logOut", (req, res) => {
  console.log(JSON.stringify(req.session));
  req.session.destroy();

  res.redirect("/");
});

module.exports = router;
