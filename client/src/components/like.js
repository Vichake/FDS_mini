import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";

const LikeButton = ({ songId, userId }) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch initial like status
  useEffect(() => {
    if (!userId || !songId) return;

    axios
      .get(`http://localhost:5000/api/likes/status?songId=${songId}&userId=${userId}`)
      .then((res) => setLiked(res.data.liked))
      .catch((err) => console.error("Error fetching like status:", err));
  }, [songId, userId]);

  const toggleLike = async (event) => {
    event.stopPropagation();
    if (!userId || !songId) {
      console.error("User ID or Song ID is missing.");
      return;
    }

    try {
      if (!liked) {
        await axios.post("http://localhost:5000/api/likes/addfavourites", { songId, userId });
      } else {
        await axios.patch("http://localhost:5000/api/likes/remove-favourite", { songId, userId });
      }
      // setLoading(true);
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating favourites:", error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        liked ? "text-red-500" : "text-gray-500"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Heart fill={liked ? "currentColor" : "none"} strokeWidth={2} size={24} />
    </button>
  );
};

export default LikeButton;
