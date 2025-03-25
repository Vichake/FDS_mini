import { useState } from "react";
import { Heart } from "lucide-react";

const LikeButton = ({ onLike }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    if (onLike) onLike(!liked);
  };

  return (
    <button
      onClick={toggleLike}
      className={`p-2 rounded-full transition-colors ${liked ? "text-red-500" : "text-gray-500"}`}
    >
      <Heart fill={liked ? "currentColor" : "none"} strokeWidth={2} size={24} />
    </button>
  );
};

export default LikeButton;