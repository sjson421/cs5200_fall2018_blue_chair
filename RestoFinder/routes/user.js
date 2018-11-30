const express = require('express');
const router = express.Router();
// Get user dao here
router.get('/test', (req, res) => res.json({msg: 'User works'}));

module.exports = router;