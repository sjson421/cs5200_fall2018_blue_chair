const express = require("express");
const router = express.Router();
const Event = require("../data/models/Event.schema.server");
const User = require("../data/models/User.schema.server");
const Restaurant = require("../data/models/Restaurant.schema.server");
// post event
router.post("/", async (req, res) => {
  try {
    let userId = req.body.owner;
    let restaurantId = req.body.restaurant;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).send("Invalid User");
    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    if (!restaurant) return res.status(404).send("Invalid Restaturant");
    if (user.userType != "OWNER" && user.owner.restaurant == restaurantId)
      return res.status(404).send("Invalid Request");
    const event = new Event({
      name: req.body.name,
      owner: userId,
      restaurant: restaurantId,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      date: req.body.date,
      description: req.body.description,
      price: req.body.price,
      ages: req.body.ages
    });
    event.validate();
    const result = await event.save();
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.send(events);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get by id
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const event = await Event.find({ _id: id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update event
router.put("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    var event = await Event.find({ _id: id });
    event = event[0];
    if (!event) return res.status(404).send("Object not found");
    let userId = req.body.user;
    let restaurantId = req.body.restaurant;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).send("Invalid User");
    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    if (!restaurant) return res.status(404).send("Invalid Restaturant");
    if (user.userType != "OWNER" && user.owner.restaurant == restaurantId)
      return res.status(404).send("Invalid Request");
    Event.updateOne(
      { _id: id },
      {
        $set: {
            name: req.body.name,
            owner: userId,
            restaurant: restaurantId,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            date: req.body.date,
            description: req.body.description,
            price: req.body.price,
            ages: req.body.ages
        }
      }
    )
      .then(async () => {
        var result = await Event.find({ _id: id });
        res.send(result[0]);
      })
      .catch(err => {
        return res.status(400).send(err);
      });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// delete event
router.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    var event = await Event.find({ _id: id });
    event = event[0];
    if (!event) return res.status(404).send("Object not found");
    const result = await Event.deleteOne({ _id: event._id });
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
