import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

/**
 * SearchBar Component
 * Provides search functionality to filter cities by name
 */
const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <input
        type="text"
        className="w-full px-6 py-4 pr-14 text-lg rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 placeholder-gray-400"
        placeholder="Search cities..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl pointer-events-none">
        🔍
      </span>
    </div>
  );
};

export default SearchBar;
