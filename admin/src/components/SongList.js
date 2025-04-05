import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './css/song.css';

const SongList = ({ token }) => {
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    try {
      const res = await axios.get('/songs');
      setSongs(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch songs');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/songs/${id}`);
      alert('Song deleted!');
      fetchSongs();
    } catch (error) {
      console.error(error);
      alert('Failed to delete song');
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div className="card slide-in">
      <h2 className="title">Uploaded Songs</h2>
      <ul className="song-list">
        {songs.map((song, index) => (
          <li key={song._id} style={{ animationDelay: `${index * 0.1}s` }} className="song-item fade-in">
            <div>
              <strong>{song.title}</strong> by {song.artist}
            </div>
            <button onClick={() => handleDelete(song._id)} className='deleteBtn'>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongList;
