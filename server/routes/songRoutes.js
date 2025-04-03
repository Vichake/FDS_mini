const express = require('express');
const router = express.Router();
const multer = require('multer');
const Song = require('../models/Song');
const { addSong, deleteSong, getAllSongs } = require('../controllers/songController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
// Multer setup (example)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST Route
router.post('/add', upload.single('song'), async (req, res) => {
  try {
    const { title, artist } = req.body;
    const filePath = req.file.path;

    const newSong = new Song({
      title,
      artist,
      filePath
    });

    await newSong.save();

    res.status(201).json({ message: 'Song uploaded successfully!', song: newSong });
  } catch (error) {
    console.error('Error uploading song:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', getAllSongs);
router.post('/add', verifyToken, isAdmin, upload.single('song'), addSong);
router.delete('/:id', deleteSong);

module.exports = router;
