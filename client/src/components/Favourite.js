import React, { useEffect, useState } from "react";
import axios from "axios";
import Like from "./like";

const FavouriteSongs = ({ user }) => {
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Fetch favorite songs from the backend
    axios
    .get(`http://localhost:5000/api/likes/getfavourites?person=${user.email}`)
    .then((res) => setFavoriteSongs(res.data))
    .catch((err) => console.error("Error fetching favorite songs:", err));
  }, [user]);

  return (
    <div>
      {/* <h1 className="text-3xl font-bold mb-4">Your Favorite Songs</h1> */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {favoriteSongs.map((song) => (
          <div
            key={song._id}
            className="bg-gray-800 hover:bg-gray-700 cursor-pointer p-4 rounded-lg shadow-md flex flex-col items-center transition duration-200 relative"
          >
            <img
              src={
                song.coverImage || // Replace with actual song cover image URL
                "https://img.icons8.com/?size=100&id=CWZOl3WNER6r&format=png&color=000000"
              }
              alt={song.title}
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
            <h4 className="text-lg font-medium">{song.title}</h4>
            <p className="text-sm text-gray-400">{song.artist}</p>

            {/* Like button positioned at bottom-right */}
            <div className="absolute bottom-2 right-2">
              <Like songId={song._id} userId={user.email} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavouriteSongs;