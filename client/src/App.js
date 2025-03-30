import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import SongList from "./components/SongList";
import NowPlaying from "./components/NowPlaying";
import Favourite from "./components/Favourite";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthPage from "./pages/AuthPage"; // ✅ New AuthPage with Login/Register toggle

const App = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState("home"); // State to track the selected tab

  // ✅ Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch songs once the user logs in
  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:5000/api/songs")
        .then((res) => setSongs(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  // ✅ Play/Pause toggle
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // ✅ Next song
  const playNext = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((song) => song._id === currentSong._id);
    if (currentIndex !== -1 && currentIndex < songs.length - 1) {
      setCurrentSong(songs[currentIndex + 1]);
    }
  };

  // ✅ Previous song
  const playPrev = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((song) => song._id === currentSong._id);
    if (currentIndex > 0) {
      setCurrentSong(songs[currentIndex - 1]);
    }
  };

  // ✅ Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    setCurrentSong(null); // optional: clear the player
  };

  // ✅ Handle tab selection (home, playlists, favourites)
  const handleSelectTab = (tab) => {
    setSelectedTab(tab);
  };

  // ✅ If no user logged in, show the AuthPage (Login/Signup)
  if (!user) {
    return <AuthPage />;
  }

  // ✅ Main app when user is logged in
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold">Hello, </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelectTab={handleSelectTab} /> {/* Pass handleSelectTab to Sidebar */}

        <main className="flex-1 p-6 flex flex-col justify-between pb-20 overflow-y-auto">
          <div>
            {selectedTab === "home" && (
              <>
                <h1 className="text-3xl font-bold mb-4">Discover Songs</h1>
                <SongList songs={songs} onSelectSong={setCurrentSong}  />
                
              </>
            )}

            {selectedTab === "playlists" && (
              <h1 className="text-3xl font-bold mb-4">Your Playlists</h1>
              // You can add playlist-related content here
            )}

            {selectedTab === "favorites" && (
              <>
                <h1 className="text-3xl font-bold mb-4">Your Favorites</h1>
                <Favourite user={user}/> {/* Show the Favourite component when 'favorites' tab is selected */}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Now Playing */}
      {currentSong && (
        <NowPlaying
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onNext={playNext}
          onPrev={playPrev}
        />
      )}
    </div>
  );
};

export default App;
