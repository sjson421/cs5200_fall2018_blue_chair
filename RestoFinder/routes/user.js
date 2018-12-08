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
          console.log("inside registeredUser");
          let registeredUser = {};
          let favourites = [];
          let follows = [];
          let followedBy = [];
          registeredUser.favourites = favourites;
          registeredUser.follows = follows;
          registeredUser.followedBy = followedBy;
          user.registeredUser = registeredUser;
        }



        else if (req.body.userType == "OWNER") {
          console.log("inside owner");
          console.log("user is ", user);
          let owner = {};
          let endorses = [];
          let follows = [];
          let endorsedBy = [];
          owner.endorses = endorses;
          owner.follows = follows;
          owner.endorsedBy = endorsedBy;
          user.owner = owner;
          console.log("user after owner insert is", user)
        }


        else if (req.body.userType == "CRITIC") {
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
        console.log("newUser is", newUser)
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            console.log(" user before saving", newUser)
            newUser.save()
            .then(newUser => res.json(newUser))
            .catch(err => console.log("user save error",err));
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
    return res.send(users);
  } catch (err) {
    return res.status(400).send(err);
  }
});

// get user by Username
router.get("/:username", async (req, res) => {
  try {
    const users = await User.find({username: req.params.username})
    return res.send(user);
  } catch(err) {
    return res.status(400).send(err);
  }
})


// get by id
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.find({
      _id: id
    });
    return res.send(user);
  } catch (err) {
    return res.status(400).send(err);
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
    return res.send(result);
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

    if (user.userType == 'OWNER' || user.userType == 'ADVERTISER')
    return res.send("No Reviews found");
    else {
      const reviews = await Review.find({
        user: id
      }).populate('user').populate('comments.userId').exec();
      return res.send(reviews);
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

    if (user1.userType == 'REGISTERED' || user1.userType == 'ADMIN') {
      // user1.registeredUser.follows = [];

      // if(user1.registeredUser.follows.filter())
      console.log(user1.registeredUser.follows[0]);
      console.log(user2._id);

      if (user1.registeredUser.follows.filter(user => user.equals(user2._id)).length > 0)
        return res.status(400).json({alreadyFollows: 'User already follows the user'});


      if (user2.userType == 'CRITIC' || user2.userType == 'REGISTERED') {

        user1.registeredUser.follows.push(user2);

        user1.save();

        // registerd user is the other user
        if (user2.userType == 'REGISTERED') {
          user2.registeredUser.followedBy.push(user1);
          user2.save();

        }
        // critic is the second user
        else {
          user2.critic.followedBy.push(user1);
          user2.save();
        }
        //
        //
        return res.json(user1);
      }
    }
    //
    //
    // critic follows a critic

    else if ((user1.userType == 'CRITIC' || user1.userType == 'ADMIN') && user2.userType == 'CRITIC' ) {

      if (user1.critic.follows.filter(user => user.equals(user2._id)).length > 0)
      return res.status(400).json({alreadyFollows: 'User already follows the user'});
      else {
        user1.critic.follows.push(user2);
        user1.save();
        user2.critic.followedBy.push(user1);
        user2.save();

        return res.json(user1);
      }
    }
    // owner follows a critic
    else if ((user1.userType == 'OWNER' || user1.userType == 'ADMIN') && user2.userType == 'CRITIC') {

      if (user1.owner.follows.filter(user => user.equals(user2._id)).length > 0)
      return res.status(400).json({alreadyFollows: 'User already follows the user'});
      else {
        user1.owner.follows.push(user2);
        user1.save();
        user2.critic.followedBy.push(user1);
        user2.save();

        return res.json(user1);
      }
    }

    else {
      res.status(400).json({followError: 'cannot follow this user'});
    }

  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});


// id1 unfollows id2
// id2 is unfollowed by id1
// POST REQUEST

router.post('/:id1/unfollow/:id2', async (req, res) => {
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

    // console.log(user2.userType);
    if (!user1 || !user2) return res.status(404).send('user not found');

    if (user1.userType == 'REGISTERED' || user1.userType == 'ADMIN') {
      // user1.registeredUser.follows = [];

      // if(user1.registeredUser.follows.filter())
      console.log("user1 follows list", user1.registeredUser.follows);
      console.log("user2 id is ", user2._id);

      if (user1.registeredUser.follows.filter(user => user.equals(user2._id)).length == 0)
        return res.status(400).json({NotFollows: 'User doesnt follow the user'});




      if (user2.userType == 'CRITIC' || user2.userType == 'REGISTERED') {
        let removalindex = 0;
        user1.registeredUser.follows.map((item, index) => {
          if(item.toString() == user2._id.toString())
            removalindex = index;
        });

        // user1.registeredUser.follows.splice(removalindex,1);


        console.log('remove index for the user', removalindex);

        user1.registeredUser.follows.splice(removalindex,1);

        user1.save();

        // registerd user is the other user
        if (user2.userType == 'REGISTERED') {
          // user2.registeredUser.followedBy.shift(user1);
          user2.registeredUser.followedBy.map((item, index) => {
            if(item.toString() == user1._id.toString())
              removalindex = index;
          });

          user2.registeredUser.follows.splice(removalindex,1);

          user2.save();
        }

        // critic is the second user
        else {

          user2.critic.followedBy.map((item, index) => {
            if(item.toString() == user1._id.toString())
              removalindex = index;
          });
          user2.critic.followedBy.splice(removalindex,1);
          user2.save();
        }
        //
        //
        return res.json(user1);
      }
    }
    //
    //
    // critic follows a critic

    else if ((user1.userType == 'CRITIC' || user1.userType == 'ADMIN') && user2.userType == 'CRITIC') {
      if (user1.critic.follows.filter(user => user.equals(user2._id)).length == 0)
        return res.status(400).json({NotFollows: 'User doesnt follow the user'});
      else {
        let removalindex = 0;
        let removalindex2 = 0;
        user1.critic.follows.map((item, index) => {
          if(item.toString() == user2._id.toString())
            removalindex = index;
        });

        user1.critic.follows.splice(removalindex, 1);
        user1.save();

        user2.critic.followedBy.map((item, index) => {
          if(item.toString() == user1._id.toString())
            removalindex2 = index;
        });

        user2.critic.followedBy.splice(removalindex2, 1);
        user2.save();

      }
      return res.json(user1);
    }
    // owner follows a critic
    else if ((user1.userType == 'OWNER' || user1.userType == 'ADMIN') && user2.userType == 'CRITIC') {

      if (user1.owner.follows.filter(user => user.equals(user2._id)).length > 0)
        return res.status(400).json({alreadyFollows: 'User already follows the user'});
      else {
        
        let removalindex = 0;
        let removalindex2 = 0;
        user1.owner.follows.map((item, index) => {
          if(item.toString() == user2._id.toString())
            removalindex = index;
        });

        user1.owner.follows.splice(removalindex, 1);
        user1.save();

        user2.critic.followedBy.map((item, index) => {
          if(item.toString() == user1._id.toString())
            removalindex2 = index;
        });

        user2.critic.followedBy.splice(removalindex2, 1);
        user2.save();
      }
      return res.json(user1);
    }

    else {
      res.status(400).json({followError: 'cannot follow this user'});
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});


// /api/user/userId/follow
// GET REQUEST
// get follows list for the user


// front end check if the json is empty, if empty then no one follows the user
router.get('/:id/follows', async (req, res) => {
  try {
    const id = req.params.id;
    let user = await User.find({_id: id});
    user = user[0];

    if (!user) return res.status(404).send("User not found");

    else if(user.userType == 'ADVERTISER') {

      return res.status(404).json({followError: 'advertiser does not have followers'});
    }

    else if(user.userType == 'REGISTERED' || user.userType == 'ADMIN') {
      console.log('registered');
      let follows = user.registeredUser.follows;
      console.log(follows);
      let followsArr = [];


      for(i = 0; i < follows.length; i++){
        user = await User.find({_id: id});
        console.log(user[0]);
        followsArr.push(user[0]);
      }

      return res.json(followsArr);


    }

    else if(user.userType == 'CRITIC' || user.userType == 'ADMIN') {
      console.log('critic');
      let follows = user.critic.follows;
      console.log(follows);
      //

      let followsArr = [];

      for(i = 0; i < follows.length; i++){
        user = await User.find({_id: id});
        console.log(user[0]);
        followsArr.push(user[0]);
      }

      return res.json(followsArr);

    }

    else if(user.userType == 'OWNER' || user.userType == 'ADMIN') {

      console.log('owner');
      let follows = user.owner.follows;
      console.log(follows);

      let followsArr = [];

      for(i = 0; i < follows.length; i++) {
        user = await User.find({_id: id});
        console.log(user[0]);
        followsArr.push(user[0]);
      }

      return res.json(followsArr);
    }

  }

  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// /api/user/userId/followedBy
// GET REQUEST
// get followedBy list for the user
router.get('/:id/followedby', async (req, res) => {
  try {
    const id = req.params.id;
    let user = await User.find({_id: id});
    user = user[0];

    if (!user) return res.status(404).send("User not found");

    else if(user.userType == 'ADVERTISER' || user.userType == 'OWNER') {

      return res.status(404).json({followError: 'User is not followed by others'});
    }

    else if(user.userType == 'REGISTERED' || user.userType == 'ADMIN') {
      console.log('registered User type')
      let followedBy = user.registeredUser.followedBy;

      let followedbyArr = [];

      for (i = 0; i < followedBy.length; i++) {
        user = await User.find({_id: id});
        console.log(user[0]);
        followedbyArr.push(user[0]);
      }

      return res.json(followedbyArr);
    }

    else if(user.userType == 'CRITIC' || user.userType == 'ADMIN') {
      let followedBy = user.critic.followedBy;
      let followedbyArr = [];

      for (i = 0; i < followedBy.length; i++) {
        user = await User.find({_id: id});
        console.log(user[0]);
        followedbyArr.push(user[0]);
      }

      return res.json(followedbyArr);
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
