const express = require("express");
const router = express.Router();
const Restaurant = require("../data/models/Restaurant.schema.server");

// get featured restaurants
router.get("/", async (req, res) => {
    try {
      console.log("api called");
      const restaurants = await Restaurant.find().limit(9);
      const returnRestaurants = [];
      const seen = [];
      for (r of restaurants) {
        if (!seen.includes(r.name)) {
          returnRestaurants.push(r);
          seen.push(r.name);
        }
      }
      res.send(returnRestaurants);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
});

module.exports = router;