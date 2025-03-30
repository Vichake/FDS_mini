const express = require('express');
const router = express.Router();
const {addfavourites,getfavourites} = require('../controllers/songController');

// add like to a song
router.post('/addfavourites',addfavourites);
router.get("/getfavourites",getfavourites);


module.exports = router;
    