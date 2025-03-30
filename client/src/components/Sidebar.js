import { FaHome, FaHeart } from "react-icons/fa";
import React from "react";

// Sidebar Component
const Sidebar = ({ onSelectTab }) => {
  return (
    <div className="w-64 bg-gray-800 p-4 flex flex-col">
      <h2 className="text-2xl font-semibold mb-6">Diddy Party</h2>
      <nav className="flex flex-col space-y-4">
        <button
          className="text-left hover:text-green-400"
          onClick={() => onSelectTab("home")} // Trigger the home tab
        >
          <FaHome />
          Home
        </button>
        <button
          className="text-left hover:text-green-400"
          onClick={() => onSelectTab("favorites")} // Trigger favorites tab
        >
          <FaHeart />
          Favorites
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
