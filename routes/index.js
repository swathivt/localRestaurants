const express = require("express");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { Client } = require("@googlemaps/google-maps-services-js");
const axios = require("axios");

const Registration = mongoose.model("Registration");
let userDoc = mongoose.model("Registration");

let session;

const apiKey = "asdf"; //New Key

async function placesNearByClientLib() {
  var restaurantData;

  var config = {
    method: "get",
    url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522%2C151.1957362&radius=1500&type=restaurant&key=" + apiKey  ,
    headers: {},
  };

  await axios(config)
    .then(function (response) {
      
      restaurantData = response.data


    })
    .catch(function (error) {
      console.log(error);
    });

  return restaurantData;
}

/******************************************************Home Page*****************************************/

router.get("/", async (req, res) => {
  var restaurantData = await placesNearByClientLib();

  //console.log(JSON.stringify(restaurantData));
  
   res.render("home", {
    
     restaurants: restaurantData,
   });
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
              email: req.session.emailAddress,
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
