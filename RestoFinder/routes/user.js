const express = require("express");
const router = express.Router();

const User = require('../data/models/User.schema.server');
const Review = require('../data/models/Review.schema.server');
const bcrypt = require('bcryptjs');

// Get user dao here
router.get("/test", (req, res) => res.json({
  msg: "User works"
}));

// register User
router.post('/register', (req, res) => {
  User.findOne({
    username: req.body.username
  })
  .then(user => {
    if (user) {
      return res.status(400).json({
        username: 'Username already taken'
      });
    } else {
      if (req.body.password == req.body.confirmpassword) {
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
        if (req.body.userType == "REGISTERED") {
          let registeredUser = {};
          let favourites = [];
          let follows = [];
          let followedBy = [];
          registeredUser.favourites = favourites;
          registeredUser.follows = follows;
          registeredUser.followedBy = followedBy;
          user.registeredUser = registeredUser;
        } else if (req.body.userType == "OWNER") {
          let owner = {};
          let endorses = [];
          let follows = [];
          let endorsedBy = [];
          owner.endorses = endorses;
          owner.follows = follows;
          owner.endorsedBy = endorsedBy;
          user.owner = owner;
        } else if (req.body.userType == "CRITIC") {
          let critic = {};
          let company = {};
          let name = req.body.name;
          let position = req.body.position;
          company.name = name;
          company.position = position;
          critic.company = company;
          critic.follows = [];
          critic.followedBy = [];
          critic.endorses = [];
          user.critic = critic;

        } else if (req.body.userType == "ADVERTISER") {
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
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
            .then(newUser => res.json(newUser))
            .catch(err => console.log(err));
          });
        });
      } else {
        return res.status(400).json({
          password: 'Passwords do not match'
        });
      }
    }
  });
});



// login
router.post('/login', (req, res) => {
  if (req.body.username == '' || req.body.password == '')
  return res.status(400).json({
    login: 'Username or password is empty'
  });

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    username
  })
  .then(user => {
    if (!user) {
      return res.status(404).json({
        username: 'User not found'
      });
    }
    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if (isMatch)
      res.send(user);
      else
      return res.status(400).json({
        password: 'Password wrong'
      });
    });
  });
});

// get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});


// get by id
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.find({
      _id: id
    });
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});


// delete a user by id
router.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    var user = await User.find({
      _id: id
    });
    if (!user) return res.status(404).send("User not found");
    const result = await User.deleteOne({
      _id: user._id
    });
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

//
router.get('/:id/reviews', async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.find({
      _id: id
    });
    if (!user) return res.status(404).send("User not found");
    else {
      if (user.userType == 'OWNER' || user.userType == 'ADVERTISER')
      res.send("No Reviews found");
      else {
        const reviews = await Review.find({
          user: id
        }).populate('user').populate('comments.userId').exec();
        res.send(reviews);
      }
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// id1 follows id2
// id2 is follwed by id1
// POST REQUEST
router.post('/:id1/follow/:id2', async (req, res) => {

  try {
    const id1 = req.params.id1;
    const id2 = req.params.id2;
    // console.log("id is", id1);
    let user1 = await User.find({
      _id: id1
    });
    user1 = user1[0];
    let user2 = await User.find({
      _id: id2
    });
    user2 = user2[0];

    // console.log(user1);
    // console.log(user2.userType);
    if (!user1 || !user2) return res.status(404).send('user not found');

    if (user1.userType == 'REGISTERED') {
      // user1.registeredUser.follows = [];

      if (user2.userType == 'CRITIC' || user2.userType == 'REGISTERED') {

        // user1.registeredUser.follows.push(user2);
        //
        // user1.save();

        // registerd user is the other user
        if (user2.userType == 'REGISTERED') {
          // user2.registeredUser.followedBy.push(user1);
          // user2.save();
          console.log('hello');
        }
        // critic is the second user
        else {
          // console.log('helo');
          console.log('from critic else');
          // user2.critic.followedBy.push(user1);
          // user2.save();
        }
    //
    //
        res.json(user2);
      }
    //
    //
      // critic follows a critic
      else if (user1.userType == 'CRITIC' && user2.userType == 'CRITIC') {

        user1.critic.follows.push(user2);
        user1.save();
        user2.critic.followedBy.push(user1);
        user2.save();
      }
      // owner follows a critic
      else if (user1.userType == 'OWNER' && user2.userType == 'CRITIC') {

        user1.owner.follows.push(user2);
        user1.save();
        user2.critic.followedBy.push(user1);
      } else res.send('cannot follow the user');
    //
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});


module.exports = router;
