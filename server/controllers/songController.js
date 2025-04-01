const Song = require('../models/Song');
const path = require('path');
const User = require('../models/User');

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
       console.log(req.body);
       const {person,id} = req.body;
       const data = await User.findOne({username:person});
       const thatsong = await Song.findOne({_id:id});
       thatsong.totallikes++;
       await thatsong.save();
       data.favourites.push(id);
       await data.save();
       return res.status(200).send({message:"done"});
    }catch(err){
     console.log(err);
     return res.status(404).send({error:err});
    }
 };

// Get all favourite songs of a specific user
exports.getfavourites = async (req, res) => {
    try {
        const users = await User.find({});
        console.log(users);
      const { person } = req.query; // Extract email from query parameters
      console.log("Requested User Email:", person);
  
      // Find user by email and populate the favourites array with song details
      const user = await User.findOne({ email: person }).populate("favourites");

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if the user has any favourites
      if (!user.favourites || user.favourites.length === 0) {
        return res.status(200).json([]); // Return an empty array if no favourites
      }
  
      // Return the populated favourites array
      return res.status(200).json(user.favourites);
    } catch (err) {
      console.error("Error fetching favourites:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

 exports.getstatus = async (req, res) => {
    try {
        const { userId } = req.query; // Extract userId from query parameters
        // console.log(userId)
    
        // Validate userId
        if (!userId) {
          return res.status(400).json({ error: "userId is required" });
        }
    
        // Find user by ID and populate the favourites array with song details
        const user = await User.find({email:userId});
    
        // Check if user exists
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        // console.log(user);
    
        // Send the list of favourite songs
        return res.status(200).json({ favourites: user.favourites });
      } catch (err) {
        console.error("Error fetching favourites:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
  };
  
