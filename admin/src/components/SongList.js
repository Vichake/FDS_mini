import React, { useEffect, useState } from 'react';
import axios from '../axios';

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
      await axios.delete(`/songs/${id}`, {
  
      });
      alert('Song deleted successfully!');
      fetchSongs(); // Refresh list
    } catch (error) {
      console.error(error);
      alert('Failed to delete song');
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div>
      <h2>Uploaded Songs</h2>
      <ul>
        {songs.map((song) => (
          <li key={song._id} style={{ marginBottom: '10px' }}>
            <strong>{song.title}</strong> by {song.artist}
            <button
              onClick={() => handleDelete(song._id)}
              style={{ marginLeft: '10px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongList;
