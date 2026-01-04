import React from "react";
import { GoSearch } from "react-icons/go";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full px-5 py-3 pr-12 text-base rounded-xl bg-white/95 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 placeholder-gray-400"
        placeholder="Search cities..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
        <GoSearch className="text-gray-600" />
      </span>
    </div>
  );
};

export default SearchBar;
