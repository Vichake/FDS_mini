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
 exports.getfavourites = async(req,res)=>{
    try{
       const {person} = req.body;
       const data = await User.findOne({username:person});
       let array=[];
    //    console.log(data);
       console.log(data.favourites);
       for(var i=0;i<data.favourites.length;i++){
          const songyy = await song.findOne({_id:data.favourites[i]});
          console.log(songyy);
          array.push(songyy);
       }
       console.log(array);
       return res.status(200).send({response:array});
    }catch(err){
     console.log(err);
     return res.status(404).send({error:err});
    }
 };
