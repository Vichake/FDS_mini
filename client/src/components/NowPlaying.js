import { useEffect, useRef, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
} from "react-icons/fa";

const NowPlaying = ({ currentSong, songs = [], onSelectSong }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentIndex = songs.findIndex((song) => song._id === currentSong?._id);

  const getSongUrl = (song) => {
    if (!song) return "";
    return `http://localhost:5000/${song.filePath.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!currentSong || !audio) return;

    const url = getSongUrl(currentSong);
    audio.src = url;
    audio.load();

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Auto play failed", err);
        setIsPlaying(false);
      }
    };

    setProgress(0);
    playAudio();

    // Cleanup on song change
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [currentSong]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleProgress = () => {
    const audio = audioRef.current;
    if (!audio || isNaN(audio.duration)) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    setProgress(percent);
  };

  const playNext = async () => {
    if (currentIndex < songs.length - 1) {
      onSelectSong(songs[currentIndex + 1]);
    }
  };
  
  const playPrevious = async () => {
    if (currentIndex > 0) {
      onSelectSong(songs[currentIndex - 1]);
    }
  };
  

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-tr from-[#1e3a8a] to-[#0f172a] text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_-2px_20px_rgba(0,0,0,0.5)] border-t border-gray-800 backdrop-blur-lg">
      
      {/* Song Info */}
      <div className="flex items-center gap-4 w-full md:w-1/3">
        <img
          src={currentSong?.imageUrl || "https://img.icons8.com/?size=100&id=CWZOl3WNER6r&format=png&color=ffffff"}
          alt={currentSong?.title || "No Song"}
          className="w-14 h-14 rounded-md object-cover shadow-md"
        />
        <div className="truncate">
          <h3 className="text-lg font-semibold leading-5 truncate max-w-[200px]">
            {currentSong?.title || "No Song Selected"}
          </h3>
          <p className="text-sm text-gray-400">{currentSong?.artist || "Unknown Artist"}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-full md:w-1/3">
        <div className="flex items-center gap-6 mb-1">
          <button
            onClick={playPrevious}
            disabled={currentIndex <= 0}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-30 transition-all"
          >
            <FaStepBackward size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-transform transform hover:scale-105 shadow-lg"
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>
          <button
            onClick={playNext}
            disabled={currentIndex >= songs.length - 1}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-30 transition-all"
          >
            <FaStepForward size={18} />
          </button>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => {
            const audio = audioRef.current;
            if (!audio) return;

            const newTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = newTime;
            setProgress(e.target.value);
          }}
          className="w-full max-w-[280px] h-1 appearance-none rounded-full overflow-hidden cursor-pointer transition-all"
          style={{
            background: `linear-gradient(to right, #10b981 ${progress}%, #2d2d2d ${progress}%)`,
          }}
        />
      </div>

      {/* Right: Optional Text */}
      <div className="w-full md:w-1/3 flex justify-end items-center gap-4">
        <span className="text-xs text-gray-500 hidden sm:inline">Lofi | Relax 🎧</span>
      </div>

      <audio ref={audioRef} onTimeUpdate={handleProgress} />
    </div>
  );
};

export default NowPlaying;
