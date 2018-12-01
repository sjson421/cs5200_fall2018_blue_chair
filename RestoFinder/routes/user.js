const express = require("express");
const router = express.Router();

const User = require('../data/models/User.schema.server');


// Get user dao here
router.get("/test", (req, res) => res.json({ msg: "User works" }));

/// register User
router.post('/', (req, res) => {

})


module.exports = router;
