import React, { useState } from "react";
import Like from "./like";

const SongList = ({ songs, onSelectSong, user }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 py-6">
      {/* Search bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-blue-600 bg-[#1e293b] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 shadow-md"
        />
      </div>

      {/* Song grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredSongs.map((song) => (
          <div
            key={song._id}
            onClick={() => onSelectSong(song)}
            className="bg-[#1e293b] hover:bg-[#334155] text-white cursor-pointer rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-200 relative group min-h-[230px] flex flex-col justify-start"
          >
            {/* Image */}
            <div className="w-full flex justify-center mb-3">
              <img
                src={
                  song.imageUrl ||
                  "https://img.icons8.com/?size=100&id=CWZOl3WNER6r&format=png&color=ffffff"
                }
                alt={song.title}
                className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-blue-500"
              />
            </div>

            {/* Song Info */}
            <div className="text-center px-1 mb-10">
              <h4 className="text-base font-semibold truncate">{song.title}</h4>
              <p className="text-sm text-gray-300 truncate">{song.artist}</p>
            </div>

            {/* Like button */}
            <div className="absolute bottom-3 right-4 opacity-80 group-hover:opacity-100 transition-opacity">
              <Like songId={song._id} userId={user.email} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;
