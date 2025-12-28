import { useState, useEffect } from 'react';
import { BrowserRouter, NavLink } from 'react-router-dom';
import { albanianCities } from './models/cities';
import SearchBar from './components/SearchBar';
import AppRoutes from './Routes';

// LocalStorage key for bookmarks
const BOOKMARKS_STORAGE_KEY = 'weather-albania-bookmarks';

/**
 * Main App Component
 * Manages application state including:
 * - Routing between Cities and Bookmarks pages
 * - Search term for filtering
 * - Bookmarked cities (persisted in localStorage)
 */
function App() {
  // State management
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Initialize bookmarks from localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load bookmarks from localStorage:', error);
      return [];
    }
  });

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarkedIds));
    } catch (error) {
      console.error('Failed to save bookmarks to localStorage:', error);
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
    <BrowserRouter>
      <div className="min-h-screen bg-linear-to-br from-blue-400 via-purple-500 to-indigo-600">
        {/* Header Section */}
        <header className="text-center py-8 px-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2">
            🌤️ Weather Albania
          </h1>
          <p className="text-xl text-white/90">Real-time weather for Albanian cities</p>
        </header>

        {/* Search Bar - Always visible */}
        <div className="max-w-2xl mx-auto px-4 mb-6">
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        </div>

        {/* Tab Navigation */}
        <nav className="flex justify-center gap-4 px-4 mb-6">
          <NavLink
            to="/cities"
            className={({ isActive }) => `flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              isActive
                ? 'bg-white text-purple-600 shadow-xl scale-105'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            {({ isActive }) => (
              <>
                <span>🏙️ Cities</span>
                <span className={`px-2.5 py-0.5 rounded-full text-sm ${
                  isActive ? 'bg-purple-600 text-white' : 'bg-white/30'
                }`}>
                  {albanianCities.length}
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/bookmarks"
            className={({ isActive }) => `flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              isActive
                ? 'bg-white text-purple-600 shadow-xl scale-105'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            {({ isActive }) => (
              <>
                <span>⭐ Bookmarks</span>
                <span className={`px-2.5 py-0.5 rounded-full text-sm ${
                  isActive ? 'bg-purple-600 text-white' : 'bg-white/30'
                }`}>
                  {bookmarkedIds.length}
                </span>
              </>
            )}
          </NavLink>
        </nav>

        {/* Main Content - Routes */}
        <main className="max-w-7xl mx-auto px-4 pb-8">
          <AppRoutes
            cities={albanianCities}
            searchTerm={searchTerm}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
            onRemoveBookmark={removeFromBookmarks}
          />
        </main>

        {/* Footer */}
        <footer className="text-center py-6 text-white/80 mt-8">
          <p>
            Powered by{' '}
            <a 
              href="https://open-meteo.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold underline hover:text-white"
            >
              Open-Meteo API
            </a>
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
