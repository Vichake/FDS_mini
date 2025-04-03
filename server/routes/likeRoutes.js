const express = require('express');
const router = express.Router();
const {addfavourites,getfavourites, getstatus, removefavourites} = require('../controllers/songController');

// add like to a song
router.post('/addfavourites',addfavourites);
router.get("/getfavourites",getfavourites);
router.patch("/remove-favourite",removefavourites);
router.get("/status",getstatus);


module.exports = router;
    