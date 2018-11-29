const express = require('express');

const router = express.Router();

const User = require('../models/User.schema.server');

router.get('/test', (req, res) => res.json({msg: 'User works'}));


module.exports = router;
