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
      time_create: req.body.time_create,
      url: req.body.url
    });
    review.validate();
    const result = await review.save();
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.send(reviews);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get by id
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const review = await Review.find({ _id: id });
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
          time_create: req.body.time_create,
          url: req.body.url
        }
      }
    )
      .then(async () => {
        var result = await Review.find({ _id: id });
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

module.exports = router;
