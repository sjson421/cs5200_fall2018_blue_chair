const express = require("express");
const router = express.Router();
const EventModel = require("../data/models/Event.schema.server");
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
    if (user.userType != "OWNER" && user.userType != "ADMIN")
      return res.status(404).send("Invalid Request");
    const event = new EventModel({
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
    const returnResult = await EventModel.find({_id: result._id}).populate('owner').populate('restaurant');
    res.send(returnResult);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all
router.get("/", async (req, res) => {
  try {
    const events = await EventModel.find().populate('restaurant').populate('owner');
    res.send(events);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get by id
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const event = await EventModel.find({ _id: id }).populate('owner').populate('restaurant');
    res.send(event);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update event
router.put("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    var event = await EventModel.find({ _id: id });
    event = event[0];
    if (!event) return res.status(404).send("Object not found");
    let userId = req.body.owner;
    let restaurantId = req.body.restaurant;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).send("Invalid User");
    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    if (!restaurant) return res.status(404).send("Invalid Restaturant");
    if (user.userType != "OWNER" && user.userType != "ADMIN")
      return res.status(404).send("Invalid Request");
    EventModel.updateOne(
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
        var result = await EventModel.find({ _id: id }).populate('user').populate('owner');
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
    var event = await EventModel.find({ _id: id });
    event = event[0];
    if (!event) return res.status(404).send("Object not found");
    const result = await EventModel.deleteOne({ _id: event._id });
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
