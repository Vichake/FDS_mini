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
    if (!currentSong || !audioRef.current) return;

    const url = getSongUrl(currentSong);
    const audio = audioRef.current;
    audio.src = url;
    audio.load();

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Playback error:", error);
        setIsPlaying(false);
      }
    };

    setProgress(0);
    playAudio();
  }, [currentSong]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleProgress = () => {
    if (!audioRef.current) return;
    const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(isNaN(percent) ? 0 : percent);
  };

  const playNext = () => {
    if (currentIndex < songs.length - 1) {
      onSelectSong(songs[currentIndex + 1]);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      onSelectSong(songs[currentIndex - 1]);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-tr from-[#1e3a8a] to-[#0f172a] text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_-2px_20px_rgba(0,0,0,0.5)] border-t border-gray-800 backdrop-blur-lg">
      
      {/* Left: Song Info */}
      <div className="flex items-center gap-4 w-full md:w-1/3">
        <img
          src={
            currentSong?.imageUrl ||
            "https://img.icons8.com/?size=100&id=CWZOl3WNER6r&format=png&color=ffffff"
          }
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

      {/* Center: Controls + Progress */}
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
            disabled={currentIndex === -1 || currentIndex >= songs.length - 1}
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
            if (!audioRef.current) return;
            const newTime = (e.target.value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = isNaN(newTime) ? 0 : newTime;
            setProgress(e.target.value);
          }}
          className="w-full max-w-[280px] h-1 appearance-none rounded-full overflow-hidden cursor-pointer transition-all"
          style={{
            background: `linear-gradient(to right, #10b981 ${progress}%, #2d2d2d ${progress}%)`,
          }}
        />
      </div>

      {/* Right: Future Feature Area */}
      <div className="w-full md:w-1/3 flex justify-end items-center gap-4">
        <span className="text-xs text-gray-500 hidden sm:inline">Lofi | Relax 🎧</span>
      </div>

      <audio ref={audioRef} onTimeUpdate={handleProgress} />
    </div>
  );
};

export default NowPlaying;
