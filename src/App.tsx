import { useState, useEffect } from "react";
import { albanianCities } from "./models/cities";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Footer from "./components/Footer";
import CitiesSection from "./components/CitiesSection";
import BookmarksSection from "./components/BookmarksSection";
import SettingsModal from "./components/SettingsModal";

// LocalStorage key for bookmarks
const BOOKMARKS_STORAGE_KEY = "weather-albania-bookmarks";

function App() {
  // State management
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'cities' | 'bookmarks'>('cities');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Initialize bookmarks from localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load bookmarks from localStorage:", error);
      return [];
    }
  });

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        BOOKMARKS_STORAGE_KEY,
        JSON.stringify(bookmarkedIds)
      );
    } catch (error) {
      console.error("Failed to save bookmarks to localStorage:", error);
    }
  }, [bookmarkedIds]);

  /**
   * Toggle bookmark status for a city
   * Adds to bookmarks if not present, removes if already bookmarked
   */
  const toggleBookmark = (cityId: string): void => {
    setBookmarkedIds((prev) => {
      if (prev.includes(cityId)) {
        return prev.filter((id) => id !== cityId);
      } else {
        return [...prev, cityId];
      }
    });
  };

  /**
   * Remove a city from bookmarks
   */
  const removeFromBookmarks = (cityId: string): void => {
    setBookmarkedIds((prev) => prev.filter((id) => id !== cityId));
  };

  /**
   * Handle search input changes
   */
  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-500 to-cyan-400">
      {/* Navbar */}
      <Navbar 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange}
        onOpenSettings={() => setShowSettings(true)}
      />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile Search Bar - Above tabs on mobile only */}
        <div className="md:hidden py-4">
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        </div>

        {/* Tab Navigation */}
        <nav className="flex justify-center gap-4 py-6">
          <button
            onClick={() => setActiveTab('cities')}
            className={`flex cursor-pointer items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              activeTab === 'cities'
                ? 'bg-white text-cyan-600 shadow-xl scale-105'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            <span>Cities</span>
            <span className={`px-2.5 py-0.5 rounded-full text-sm ${
              activeTab === 'cities' ? 'bg-cyan-600 text-white' : 'bg-white/30'
            }`}>
              {albanianCities.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex cursor-pointer items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              activeTab === 'bookmarks'
                ? 'bg-white text-cyan-600 shadow-xl scale-105'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            <span>Bookmarks</span>
            <span className={`px-2.5 py-0.5 rounded-full text-sm ${
              activeTab === 'bookmarks' ? 'bg-cyan-600 text-white' : 'bg-white/30'
            }`}>
              {bookmarkedIds.length}
            </span>
          </button>
        </nav>

        {/* Content */}
        <main className="pb-8">
          {activeTab === 'cities' ? (
            <CitiesSection
              cities={albanianCities}
              searchTerm={searchTerm}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={toggleBookmark}
            />
          ) : (
            <BookmarksSection
              cities={albanianCities}
              searchTerm={searchTerm}
              bookmarkedIds={bookmarkedIds}
              onRemoveBookmark={removeFromBookmarks}
            />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
