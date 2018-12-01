const express = require("express");
const router = express.Router();

const User = require('../data/models/User.schema.server');
const bcrypt = require('bcryptjs');

// Get user dao here
router.get("/test", (req, res) => res.json({ msg: "User works" }));

/// register User
router.post('/register', (req, res) => {
  User.findOne({username: req.body.username})
      .then(user => {
        if(user) {
          return res.status(400).json({username: 'Username already taken'});
        }
        else {
          if(req.body.password == req.body.confirmpassword) {
            console.log(req.body.name);
            let user = {
              username: req.body.username,
              email: req.body.email,
              password: req.body.password,
              address: {
                streetaddress: req.body.streetaddress,
                streetaddress2: req.body.streetaddress2,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                zipcode: req.body.zipcode,
              },
              phone: req.body.phone,
              userType: req.body.userType,
            }
            if(req.body.userType == "REGISTERED") {
              let registeredUser = {};
              let favouritesList = [];
              let follows = [];
              registeredUser.favouritesList = favouritesList;
              registeredUser.follows = follows;
              user.registeredUser = registeredUser;
            }

            else if(req.body.userType == "OWNER") {
              let owner = {};
              let endorse = [];
              let follows = [];
              owner.endorse = endorse;
              owner.follows = follows;
              user.owner = owner;
            }

            else if(req.body.userType == "CRITIC") {
              let critic = {};
              let company  = {};
              let name = req.body.name;
              let position  = req.body.position;
              company.name = name;
              company.position = position;
              critic.company = company;
              critic.follows = [];
              critic.endorse = [];
              user.critic = critic;

            }

            else if(req.body.userType == "ADVERTISER") {
              let advertiser = {};
              let company = {};
              let payment = {};
              let name = req.body.name;
              let position = req.body.position;
              let credit_card_number = req.body.credit_card_number;
              let cardType = req.body.cardType;
              let cvv = req.body.cvv;

              company.name = name;
              company.position = position;

              payment.credit_card_number = credit_card_number;
              payment.cardType = cardType;
              payment.cvv = cvv;

              advertiser.company = company;
              advertiser.payment = payment;
              user.advertiser = advertiser;
            }

            const newUser = new User(user);
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt,(err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(newUser => res.json(newUser))
                .catch(err => console.log(err));
              });
            });
          }
          else {
            return res.status(400).json({password: 'Passwords do not match'});
          }
        }
      });
});

// get all users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});


module.exports = router;
