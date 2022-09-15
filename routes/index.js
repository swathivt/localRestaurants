const express = require("express");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const Registration = mongoose.model('Registration');

/******************************************************Home Page*****************************************/

router.get("/", (req, res) => {
  res.render("home");
});

/******************************************************Registration Page*****************************************/
router.get("/registration", (req, res) => {
  res.render("form");
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

     Registration
        .find({ emailAddress: req.body.emailAddress, password:  req.body.password})
        .then(userDoc => {
          console.log(userDoc.length);

          if(userDoc.length == 1) {
            console.log('successfully authenticated by ' + req.body.emailAddress);
              res.render('home');
          } else {
            console.log('Failed to authenticated by ' + req.body.emailAddress);
            res.render('login');
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

module.exports = router;
