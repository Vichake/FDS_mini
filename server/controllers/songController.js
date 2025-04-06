const Song = require('../models/Song');
const path = require('path');
const User = require('../models/User');
const Like = require('../models/Like');

// Add Song (Admin only)
exports.addSong = async (req, res) => {
    try {
        const { title, artist } = req.body;
        const filePath = req.file.path;

        const song = new Song({ title, artist, filePath });
        await song.save();


        res.status(201).json({ message: 'Song uploaded successfully', song });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload song' });
    }
};

// Delete Song (Admin only)
exports.deleteSong = async (req, res) => {
    try {
        const { id } = req.params;
        const song = await Song.findByIdAndDelete(id);

        if (!song) return res.status(404).json({ error: 'Song not found' });

        res.status(200).json({ message: 'Song deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete song' });
    }
};

// Get All Songs (Public)
exports.getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        // console.log(songs);
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get songs' });
    }
};

// add song to favourites
exports.addfavourites = async(req,res)=>{
    try{
        const { songId, userId } = req.body; // Extract songId and userId from request body
        // console.log("addfavourites called",songId,userId);
        const user = await Like.findOne({ userId: userId });
        if(!user){
            // console.log("User not found");
            const newUser = new Like({
                userId: userId,
                songIds: [songId]
            });
            await newUser.save();
            res.status(200).json({ message: 'Added to favouite successfully'});
        }
        else {
            const songExists = user.songIds.includes(songId);
            if (songExists) {
                // console.log("Song already exists in favourites");
                return res.status(400).json({ message: 'Song already exists in favourites' });
            } else {
                user.songIds.push(songId);
                await user.save();
                // console.log("Added to favourites successfully");
                return res.status(200).json({ message: 'Added to favourites successfully' });
            }
        }

    }catch(err){
     console.log(err);
     return res.status(404).send({error:err});
    }
 };

// getting the status of a song whether it is in favourites or not
 exports.getstatus = async (req, res) => {
    try {
        const { songId, userId } = req.query; // Extract songId and userId from query parameters
        const user = await Like.findOne({ userId: userId });

        if (!user) {
            return res.status(200).json({ liked: false, message: "Song not found in favourites" });
        }
        const songExists = user.songIds.includes(songId);

        if (songExists) {
            // console.log("Song already exists in favourites");
            return res.status(200).json({ liked: true, message: "Song already exists in favourites" });
        } else {
            // console.log("Song not found in favourites");
            return res.status(200).json({ liked: false, message: "Song not found in favourites" });
        }
      } catch (err) {
        console.error("Error fetching favourites:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
  };

  exports.removefavourites = async (req, res) => {
    try {
        const { songId, userId } = req.body;
        // console.log("removefavourites called",songId,userId);
        const user = await Like.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const songExists = user.songIds.includes(songId);
        if (!songExists) {
            // console.log("Song not found in favourites");
            return res.status(400).json({ message: "Song not found in favourites" });
        } else {
            // console.log("Song found in favourites, removing it");
            user.songIds = user.songIds.filter((id) => id != songId); // Remove the songId from the user's favourites
            await user.save();
            return res.status(200).json({ message: "Removed from favourites successfully" });
        }
      } catch (err) {
        // console.error("Error fetching favourites:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
  }
  

// Get all favourite songs of a specific user
exports.getfavourites = async (req, res) => {
    try {
        // console.log("getfavourites called");  
        const { person } = req.query; // Extract userId from query parameters
        // console.log("person",person);
        // res.send("getfavourites called");
        const songs = await Like.findOne({ userId: person });
        if (!songs) {
            return res.status(404).json({ message: "User not found" });
        }
        const songIds = songs.songIds; // Extract songIds from the user
        const favouriteSongs = await Song.find({ _id: { $in: songIds } }); // Find all songs with the given songIds
        res.status(200).json(favouriteSongs); // Send the favourite songs as a response
    } catch (err) {
      console.error("Error fetching favourites:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };