import React, { useState } from 'react';
import axios from '../axios';
import './css/song.css';

const SongUpload = ({ token }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !artist || !file) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('song', file);

    try {
      await axios.post('/songs/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Song uploaded successfully!');
      setTitle('');
      setArtist('');
      setFile(null);
    } catch (error) {
      console.error(error);
      alert('Failed to upload song');
    }
  };

  return (
    <div className="card fade-in">
      <h2 className="title">Upload a New Song</h2>
      <form onSubmit={handleUpload} className="form">
        <input
          type="text"
          placeholder="Song Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Artist Name"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="customFileInput"
      />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default SongUpload;
