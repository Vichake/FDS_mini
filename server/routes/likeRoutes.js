const express = require('express');
const router = express.Router();

// add like to a song
router.post('/', (req, res) => {
    const { userId, songId } = req.body;
    console.log(userId, songId);
    res.send('Like added to song!');
});


module.exports = router;
