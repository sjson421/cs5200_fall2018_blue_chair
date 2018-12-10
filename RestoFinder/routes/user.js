const express = require("express");
const router = express.Router();

const User = require('../data/models/User.schema.server');
const Review = require('../data/models/Review.schema.server');
const Restaurant = require('../data/models/Restaurant.schema.server');
const bcrypt = require('bcryptjs');
let _ = require('underscore');

// Get user dao here
router.get("/test", (req, res) => res.json({
  msg: "User works"
}));

// register User
// NEEDS ENTIRE SCHEMA UNSTRUCTURED/ NOT IN A MAP + confirmpassword
// POST REQUEST
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
            zipcode: req.body.zipcode
          },
          picture: req.body.picture,
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


// update User
// SEND IN THE ENTIRE User BODY!!!! Updated and non updated fields too!
// this will need the password field because the entire update code is inside
// bcyrpt hash
// userid in params
// req.body has the profile data.
// PUT REQUEST
// ONLY ALLOWS TO CHANGE USER.schema contents and not other.
router.put('/update/:id', async (req, res) => {
  try {
    const userid = req.params.id;
    let user = await User.find({_id: userid});
    user = user[0];

    // const userfields = {};
    if (!user) return res.status(404).send('user not found');

    let password = req.body.password;

    let users = await User.find({'username': req.body.username, 'email': req.body.email});

    if(users.length > 0) return res.send('USERNAME OR EMAIL ALREADY EXISTS. CHANGE TO CONTINUE');

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
          User.updateOne({_id: userid},
            {
              $set: {
                username: req.body.username,
                email: req.body.email,
                password: hash,
                address:{
                  streetaddress: req.body.streetaddress,
                  streetaddress2: req.body.streetaddress2,
                  city: req.body.city,
                  state: req.body.state,
                  country: req.body.country,
                  zipcode: req.body.zipcode
                },
                picture: req.body.picture,
                phone: req.body.phone,
              }
            }
          ).then(async() => {
            let user = await User.find({_id: userid});
            res.json(user[0]);
          }).catch(err => res.status(400).send(err));
      });
    });
  }

  catch(err){
    console.log(err);
    return res.status(400).send(err);
  }
});


//
// login
// needs username and password
// POST REQUEST
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

// get user by term
// send the username from front end
// PUBLIC API AVAILABLE FOR ANON USER
router.get("/search/:username", async (req, res) => {
  try {
    let term = req.params.username;
    var regex = new RegExp(term, "i");
    const users = await User.find({ username: regex }).limit(15);
    const returnUsers = [];
    const seen = [];
    for (r of users) {
      if (!seen.includes(r.username)) {
        returnUsers.push(r);
        seen.push(r.username);
      }
    }
    return res.send(returnUsers);
  } catch(err) {
    return res.status(400).send(err);
  }
});


// get by id
// get the user by id where id is passed in from the front
// GET REQUEST
router.get("/:id", async (req, res) => {
  try {

    let id = req.params.id;
    console.log(id);
    // const user = await User.findOne({_id: id});
    const user = await User.findOne({_id: id});


    if (!user) return res.status(404).send("User not found");
    console.log(user);

    return res.json({user:user});
  }
  catch (err) {
    return res.status(400).send(err);
  }
});


// delete a user by id
// ID IS THE USER ID
router.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    var user = await User.find({_id: id});
    user = user[0];

    if (!user) return res.status(404).send("User not found");
    const result = await User.deleteOne({
      _id: user._id
    });

    return res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all reviews for a user
// ID IS THE USER ID
router.get('/:id/reviews', async (req, res) => {
  try {
    let id = req.params.id;
    let user = await User.find({
      _id: id
    });
    user = user[0];

    if (!user) return res.status(404).send("User not found");

    if (user.userType == 'OWNER' || user.userType == 'ADVERTISER')
    return res.send("No Reviews found");
    else {
      const reviews = await Review.find({
        user: id
      }).populate('user').populate('restaurant');
      return res.send(reviews);
    }

  } catch (err) {
    res.status(400).send(err);
  }
});

// delete a review for the user
// id1 is the id of user
// id2 is the id of review
// give both of them from front
// DELETE REQUEST
router.delete('/:id1/review/:id2', async (req, res) => {
  try {
    let user = req.params.id1;
    let reviewId = req.params.id2;

    let review = await Review.find({_id: reviewId});
    review = review[0];

    if(review.user == user) return res.status(404).send("User cannot delete others reviews")
    else {
      const result = await Review.deleteOne({ _id: review._id});
      return res.send(result);
    }
  }
  catch(err) {
    res.status(400).send(err);

  }
})

// id1 endorses id2
// id2 is endorsed by id1
// POST REQUEST

router.post('/:id1/endorse/:id2', async (req, res) => {
  try {
    const id1 = req.params.id1;
    const id2 = req.params.id2;

    let user1 = await User.find({_id: id1});
    user1 = user1[0];

    let user2 = await User.find({_id: id2});
    user2 = user2[0];

    if (!user1 || !user2) return res.status(404).send('user not found');

    if(user1.userType == 'OWNER' || user1.userType == 'ADMIN') {

      if (user1.owner.endorses.filter(user => user.equals(user2._id)).length > 0)
      return res.status(400).json({alreadyFollows: 'User already endorses the user'});

      else {
        if(user2.userType == 'OWNER') {
          user1.owner.endorses.push(user2);
          user1.save();

          user2.owner.endorsedBy.push(user1);
          user2.save();

          return res.json({user1: user1, user2: user2});
        }
        else return res.json({cannotFollow: 'An owner user type cannot endorse this User'});
      }



    } else if(user1.userType == 'CRITIC' || user1.userType == 'ADMIN') {

      if (user1.critic.endorses.filter(user => user.equals(user2._id)).length > 0)
      return res.status(400).json({alreadyFollows: 'User already endorses the user'});
      else {

        if(user2.userType == 'OWNER') {
          user1.critic.endorses.push(user2);
          user1.save();

          user2.owner.endorsedBy.push(user1);
          user2.save();

          return res.json({user1: user1, user2: user2});
        }
        else return res.json({cannotFollow: 'A critic user type cannot endorse this User'});

      }

    } else return res.send("This USER TYPE cannot endorse");

  }
  catch (err) {
    res.status(400).send(err);
  }
});


// id1 unendorse id2
// id2 is unendorsed by id1
// POST REQUEST

router.post('/:id1/unendorse/:id2', async (req, res) => {
  try {
    const id1 = req.params.id1;
    const id2 = req.params.id2;

    let user1 = await User.find({
      _id: id1
    });
    user1 = user1[0];
    let user2 = await User.find({_id: id2});
    user2 = user2[0];

    if (!user1 || !user2) return res.status(404).send('user not found');

    if (user1.userType == "OWNER" || user1.userType == "ADMIN") {

      if (user1.owner.endorses.filter(user => user.equals(user2._id)).length == 0)
      return res.status(400).json({doesNotEndorse: 'Owner does not endorse this user'});

      let removalindex = 0;
      user1.owner.endorses.map((item, index) => {
        if(item.toString() == user2._id.toString())
        removalindex = index;
      });

      console.log('remove index for the user', removalindex);

      user1.owner.endorses.splice(removalindex,1);

      user1.save();

      if(user2.userType == "OWNER") {
        let removalindex = 0;
        user2.owner.endorsedBy.map((item, index) => {
          if(item.toString() == user1._id.toString())
          removalindex = index;
        });


        console.log('remove index for the user', removalindex);

        user2.owner.endorsedBy.splice(removalindex,1);

        user2.save();

        return res.json({user1: user1, user2: user2});

      } else return res.status(400).json({unEndorseError: 'cannot unendorse this user'});

    } else if (user1.userType == "CRITIC" || user1.userType == "ADMIN") {
      if (user1.critic.endorses.filter(user => user.equals(user2._id)).length == 0)
      return res.status(400).json({doesNotEndorse: 'Critic does not endorse the Owner'});

      let removalindex = 0;
      user1.critic.endorses.map((item, index) => {
        if(item.toString() == user2._id.toString())
        removalindex = index;
      });

      // user1.registeredUser.follows.splice(removalindex,1);


      console.log('remove index for the user', removalindex);

      user1.critic.endorses.splice(removalindex,1);

      user1.save();

      if(user2.userType == "OWNER") {
        let removalindex = 0;
        user2.owner.endorsedBy.map((item, index) => {
          if(item.toString() == user1._id.toString())
          removalindex = index;
        });


        console.log('remove index for the user', removalindex);

        user2.owner.endorsedBy.splice(removalindex,1);

        user2.save();

        return res.json({user1: user1, user2: user2});
      }

    } else return res.send("This user type cannot endorse");
  }

  catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// get endorses

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
      console.log('owner as first user')
      console.log('critic the second')
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

          user2.registeredUser.followedBy.splice(removalindex,1);

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

      if (user1.owner.follows.filter(user => user.equals(user2._id)).length == 0)
      return res.status(400).json({alreadyFollows: 'User doesnt user'});
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
      // let followsArr = [];
      //
      //
      // for(i = 0; i < follows.length; i++){
      //   user = await User.find({_id: id});
      //   console.log(user[0]);
      //   followsArr.push(user[0]);
      // }

      return res.json(follows);


    }

    else if(user.userType == 'CRITIC' || user.userType == 'ADMIN') {
      console.log('critic');
      let follows = user.critic.follows;
      console.log(follows);
      //

      // let followsArr = [];
      //
      // for(i = 0; i < follows.length; i++){
      //   user = await User.find({_id: id});
      //   console.log(user[0]);
      //   followsArr.push(user[0]);
      // }

      return res.json(follows);

    }

    else if(user.userType == 'OWNER' || user.userType == 'ADMIN') {

      console.log('owner');
      let follows = user.owner.follows;
      console.log(follows);

      // let followsArr = [];
      //
      // for(i = 0; i < follows.length; i++) {
      //   user = await User.find({_id: id});
      //   console.log(user[0]);
      //   followsArr.push(user[0]);
      // }

      return res.json(follows);
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

      // let followedbyArr = [];
      //
      // for (i = 0; i < followedBy.length; i++) {
      //   user = await User.find({_id: id});
      //   console.log(user[0]);
      //   followedbyArr.push(user[0]);
      // }

      return res.json(followedBy);
    }

    else if(user.userType == 'CRITIC' || user.userType == 'ADMIN') {
      let followedBy = user.critic.followedBy;
      // let followedbyArr = [];
      //
      // for (i = 0; i < followedBy.length; i++) {
      //   user = await User.find({_id: id});
      //   console.log(user[0]);
      //   followedbyArr.push(user[0]);
      // }



      return res.json(followedBy);
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});


// /api/user/userId/endorses
// GET REQUEST
// get endorses list for the user
// returns an array

router.get('/:id/endorses', async (req, res) => {
  try {
    const id = req.params.id;
    let user = await User.find({_id: id});

    user = user[0];

    if (!user) return res.status(404).send("User not found");

    else if (user.userType == 'OWNER' || user.userType == 'CRITIC' || user.userType == 'ADMIN') {
      if(user.userType == 'OWNER' || user.userType == 'ADMIN') {
        let endorses = user.owner.endorses;
        return res.json(endorses);
      } else if(user.userType == 'CRITIC' || user.userType == 'ADMIN'){
        let endorses = user.critic.endorses;
        return res.json(endorses);
      }

    } else return res.status(404).json({endorseError: 'User does not endorse others'});

  }
  catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// /api/user/userId/endorsedBy
// GET request
// get endorsedBy list for the user
// returns an array

router.get('/:id/endorsedBy', async (req, res) => {
  try {
    const id = req.params.id;
    let user = await User.find({_id: id});

    user = user[0];

    if (!user) return res.status(404).send("User not found");

    else if (user.userType == 'OWNER' || user.userType == 'ADMIN') {
      let endorsedBy = user.owner.endorsedBy;
      return res.json(endorsedBy);

    } else return res.status(404).json({endorsedByError: 'User type not endorsed By anyone'});
  }
  catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});



// /userId/favorites/restaurantId
// add to favorites list of User
// POST Request
// add a restaurant to the favorites list.
router.post('/:id1/favorites/:id2', async (req, res) => {
  try {
    const userid = req.params.id1;
    const restid = req.params.id2;

    let user = await User.find({_id: userid});
    user = user[0];

    // console.log(user);
    if (!user) return res.status(404).send("User not found");

    let restId = await Restaurant.find({_id: restid});
    restId = restId[0];

    if (!restId) return res.status(404).send("Restaurant not found");



    if(user.userType == "REGISTERED" || user.userType == "ADMIN") {
      if (user.registeredUser.favourites.filter(rest => rest.equals(restId._id)).length > 0)
      return res.status(400).json({alreadyFavorite: 'User already has the restaurant as favorite'});
      else {
        user.registeredUser.favourites.push(restId);
        user.save();
        return res.json({user: user});
      }
    }

    else return res.status(400).json({userTypeError: 'This user type cannot have Favorites'})



  }
  catch(err) {
    res.status(400).send(err);
  }
});



// /userId/favorites/restaurantId
// delete a restaurant from favorites list of user
// POST request
router.post('/:id1/unfavorites/:id2', async(req, res) => {
  try {
    const userid = req.params.id1;
    const restid = req.params.id2;

    let user = await User.find({_id: userid});
    user = user[0];

    // console.log(user);
    if (!user) return res.status(404).send("User not found");

    let restId = await Restaurant.find({_id: restid});
    restId = restId[0];

    if (!restId) return res.status(404).send("Restaurant not found");

    if(user.userType == "REGISTERED" || user.userType == "ADMIN") {
      if (user.registeredUser.favourites.filter(rest => rest.equals(restId._id)).length == 0)
      return res.status(400).json({alreadyFavorite: 'User does not have the restaurant as favorite'});


      let removalindex = 0;
      user.registeredUser.favourites.map((item, index) => {
        if(item.toString() == restId._id.toString())
        removalindex = index;

      });

      console.log('remove index for the restaurant', removalindex);

      user.registeredUser.favourites.splice(removalindex,1);

      user.save();
      return res.json({user: user});
    }
  }
  catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});


// /userId/favorite
// get favorites list for a user
// GET REQUEST
router.get('/:id/favorites', async(req, res) => {
  try {
    const userid = req.params.id;
    let user = await User.find({_id: userid});
    user = user[0];

    if(!user) return res.status(404).send("User not found");

    if(user.userType == 'REGISTERED' || user.userType == 'ADMIN') {
      let favorites = user.registeredUser.favourites;
      return res.json(favorites);

    } else return res.status(404).json({favoritesError: 'User type does not have favorites'});

  }
  catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});


// add restaurant to userType = OWNER
// get the user back with restaurant added
// change the is_claimed field for the restaurant
// /userId/owns/restId
// POST REQUEST

router.post('/:userid/owns/:restid', async (req, res) => {
  try {
    const userid = req.params.userid;
    const restid  =req.params.restid;

    let user = await User.find({_id: userid});
    user = user[0];

    let rest = await Restaurant.find({_id: restid});
    rest = rest[0];


    if(user.userType == "OWNER" || user.userType == "ADMIN")
    {

      if(!user.owner.restaurant) {
        if(!rest.is_claimed)
        {
          user.owner.restaurant = rest;
          rest.is_claimed = !rest.is_claimed;

          user.save();
          rest.save();
        } else return res.json({alreadyOwned: 'This restaurant is already owned by someone else.'});

      } else return res.json({userOwns: 'This user already Owns a restaurant'});

    } else return res.json({illegalUserType: 'This User Type is not allowed to own restaurants'});

    return res.json(user);
  }
  catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});


// remove the restaurant key from owner object
// change the is_claimed field to false
// /userId/disowns/restId
// POST REQUEST

router.post('/:userid/disown/:restid', async (req, res) => {
  try {
    const userid = req.params.userid;
    const restid = req.params.restid;

    let user = await User.find({_id: userid});
    user = user[0];

    let rest = await Restaurant.find({_id: restid});
    rest = rest[0];

    if(!user) return res.status(404).send("User not found");

    if(user.userType == "OWNER" || user.userType == "ADMIN") {
      if(user.owner.restaurant) {

        if(rest.is_claimed) {

          console.log("user.owner.restaurant");
          rest.is_claimed = !rest.is_claimed;


          rest.save();

          user.owner.restaurant = undefined;
          user.save();


          res.json(user);
          // _.omit(user.owner, "restaurant");


        } else return res.json({alreadyOwned: 'This restaurant is owned by someone else.'});

      } else return res.json({userOwns: 'This user does not Own a restaurant'});

    } else return res.json({illegalUserType: 'This User Type is not allowed to own restaurants'});


  }
  catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});


// getowned/UserID
// get the restaurant owned by the user.userType = OWNER;
// GET Request

router.get('/getowned/:id', async (req, res) => {
  try{
    let user = await User.find({_id: req.params.id});
    user = user[0];

    if(!user) return res.status(404).send("User not found");


    if(user.userType == "OWNER" || user.userType == "ADMIN") {

      let restaurant = await Restaurant.find({ _id: user.owner.restaurant});
      restaurant = restaurant[0];
      if(restaurant)
      return res.json(restaurant);
      else
      return res.status(400).send("DOESNT OWN A RESTAURANT");

    }

    else return res.json({illegalUserType: 'This User Type is not allowed to own restaurants'});

  }
  catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});


router.get('/getads/:id', async (req, res) => {
  try {
    let user = await User.find({_id: req.params.id});
    user = user[0];

    if(!user) return res.status(404).send("User not found");


    if(user.userType == "ADVERTISER" || user.userType == "ADMIN"){
      let advertisement = await Advertisement.find({advertiser: req.params.id});

      if(advertisement.length > 0)
      return res.json(advertisement);
      else
      return res.status(400).send("DOESNT HAVE ADVERTISEMENT");
    }
    else return res.json({illegalUserType: 'This User Type is not allowed to have advertisements'});

  }
  catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});


module.exports = router;
