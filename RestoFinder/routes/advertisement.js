const express = require("express");
const router = express.Router();
const Advertisement = require("../data/models/Advertisement.schema.server");
const User = require("../data/models/User.schema.server");
const Restaurant = require("../data/models/Restaurant.schema.server");
// post advertisement
router.post("/", async (req, res) => {
  try {
    let userId = req.body.advertiser;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).send("Invalid User");
    if (user.userType != "ADVERTISER")
      return res.status(404).send("Invalid Request");
    const advertisement = new Advertisement({
      advertiser: userId,
      text: req.body.text,
      posted_on: req.body.posted_on,
      image_url: req.body.image_url,
      url: req.body.url
    });
    advertisement.validate();
    const result = await advertisement.save();
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all
router.get("/", async (req, res) => {
  try {
    const advertisements = await Advertisement.find();
    res.send(advertisements);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get by id
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const advertisement = await Advertisement.find({ _id: id });
    res.send(advertisement);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update advertisement
router.put("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    var advertisement = await Advertisement.find({ _id: id });
    advertisement = advertisement[0];
    if (!advertisement) return res.status(404).send("Object not found");
    let userId = req.body.advertiser;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).send("Invalid User");
    if (user.userType != "ADVERTISER")
      return res.status(404).send("Invalid Request");
    Advertisement.updateOne(
      { _id: id },
      {
        $set: {
            advertiser: userId,
            text: req.body.text,
            posted_on: req.body.posted_on,
            image_url: req.body.image_url,
            url: req.body.url
        }
      }
    )
      .then(async () => {
        var result = await Advertisement.find({ _id: id });
        res.send(result[0]);
      })
      .catch(err => {
        return res.status(400).send(err);
      });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// delete advertisement
router.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    var advertisement = await Advertisement.find({ _id: id });
    advertisement = advertisement[0];
    if (!advertisement) return res.status(404).send("Object not found");
    const result = await Advertisement.deleteOne({ _id: advertisement._id });
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
