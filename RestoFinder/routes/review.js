const express = require("express");
const router = express.Router();
const Review = require("../data/models/Review.schema.server");
const User = require("../data/models/User.schema.server");
const Restaurant = require("../data/models/Restaurant.schema.server");

// post review
router.post("/", async (req, res) => {
  try {
    let userId = req.body.user;
    let restaurantId = req.body.restaurant;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).send("Invalid User");
    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    if (!restaurant) return res.status(404).send("Invalid Restaturant");
    const review = new Review({
      user: userId,
      restaurant: restaurantId,
      rating: req.body.rating,
      text: req.body.text,
      time_created: req.body.time_created,
      url: req.body.url,
      comments: []
    });
    review.validate();
    const result = await review.save();
    const returnResult = await Review.find({_id: result._id}).populate('user').populate('restaurant');
    res.send(returnResult);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().populate('user').populate('restaurant');
    res.send(reviews);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get by id
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const review = await Review.find({ _id: id }).populate('restaurant').populate('user');
    res.send(review);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update review
router.put("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    var review = await Review.find({ _id: id });
    review = review[0];
    if (!review) return res.status(404).send("Object not found");
    let userId = req.body.user;
    let restaurantId = req.body.restaurant;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).send("Invalid User");
    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    if (!restaurant) return res.status(404).send("Invalid Restaturant");
    Review.updateOne(
      { _id: id },
      {
        $set: {
          user: userId,
          restaurant: restaurantId,
          rating: req.body.rating,
          text: req.body.text,
          time_created: req.body.time_created,
          url: req.body.url,
          comments: req.body.comments
        }
      }
    )
      .then(async () => {
        var result = await Review.find({ _id: id }).populate('user').populate('restaurant');
        res.send(result[0]);
      })
      .catch(err => {
        return res.status(400).send(err);
      });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// delete review
router.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    var review = await Review.find({ _id: id });
    review = review[0];
    if (!review) return res.status(404).send("Object not found");
    const result = await Review.deleteOne({ _id: review._id });
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// post a new comment
router.post("/:id/comment", async (req, res) => {
  try {
    let reviewId = req.params.id;
    var review = await Review.find({ _id: reviewId });
    review = review[0];
    if (!review) return res.status(404).send("Object not found");
    //console.log("here", review)
    let comment = {
      userId: req.body.userId,
      text: req.body.text
    };
    //console.log(comment);
    let comments = review.comments;
    comments.push(comment);
    console.log("comments are", comments);
    Review.updateOne(
      { _id: reviewId },
      {
        $set: {
          user: review.user,
          restaurant: review.restaurant,
          rating: review.rating,
          text: review.text,
          time_create: review.time_create,
          url: review.url,
          comments: comments
        }
      }
    )
      .then(async () => {
        var result = await Review.find({ _id: reviewId });
        res.send(result[0]);
      })
      .catch(err => {
        // console.log(err);
        return res.status(400).send(err);
      });
  } catch (err) {
    // console.log(err);
    res.status(400).send(err);
  }
});

// delete a comment
router.delete("/:reviewId/comment/:commentId", async (req, res) => {
  try {
    let reviewId = req.params.reviewId;
    let userId = req.body.userId;
    var review = await Review.find({ _id: reviewId });
    review = review[0];
    if (!review) return res.status(404).send("Object not found");
    let comments = review.comments;
    let newComments = JSON.parse(JSON.stringify(comments))
    let commentId = req.params.commentId;
    let userIdOfCommentToBeDeleted = null;
    comments.forEach((item, index) => {
      if (item._id == commentId) {
        newComments.splice(index, 1);
        userIdOfCommentToBeDeleted = item.userId;
      }
    });
    var user = await User.find({ _id: userId });
    if (!user) return res.status(404).send("User not found");
    console.log("comment user id is", userIdOfCommentToBeDeleted);
    console.log("user id is", userId);
    if(userId != userIdOfCommentToBeDeleted && user.userType != "ADMIN") return res.status(404).send("Invalid request");
    Review.updateOne(
      { _id: reviewId },
      {
        $set: {
          user: review.user,
          restaurant: review.restaurant,
          rating: review.rating,
          text: review.text,
          time_create: review.time_create,
          url: review.url,
          comments: newComments
        }
      }
    )
      .then(async () => {
        var result = await Review.find({ _id: reviewId });
        res.send(result[0]);
      })
      .catch(err => {
        console.log(err);
        return res.status(400).send(err);
      });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});
module.exports = router;
