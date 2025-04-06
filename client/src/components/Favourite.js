import React, { useEffect, useState } from "react";
import axios from "axios";
import Like from "./like";

const FavouriteSongs = ({ user }) => {
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:5000/api/likes/getfavourites?person=${user.email}`)
      .then((res) => {
        setFavoriteSongs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching favorite songs:", err);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return <p className="text-center text-gray-300">Loading your favorites...</p>;
  }

  return (
    <div className="px-4 py-6">
      {favoriteSongs.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          You haven&apos;t liked any songs yet!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {favoriteSongs.map((song) => (
            <div
              key={song._id}
              className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white cursor-pointer rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-200 relative group min-h-[230px] flex flex-col justify-start"
            >
              <div className="w-full flex justify-center mb-3">
                <img
                  src={
                    song.coverImage ||
                    "https://img.icons8.com/?size=100&id=CWZOl3WNER6r&format=png&color=ffffff"
                  }
                  alt={song.title}
                  className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-blue-500"
                />
              </div>
              <div className="text-center px-1 mb-10">
                <h4 className="text-base font-semibold truncate">{song.title}</h4>
                <p className="text-sm text-gray-300 truncate">{song.artist}</p>
              </div>
              <div className="absolute bottom-3 right-4 opacity-80 group-hover:opacity-100 transition-opacity">
                <Like songId={song._id} userId={user.email} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouriteSongs;