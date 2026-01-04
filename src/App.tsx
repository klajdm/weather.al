import { useState, useEffect } from "react";
import { albanianCities } from "./models/cities";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Footer from "./components/Footer";
import CitiesSection from "./components/CitiesSection";
import BookmarksSection from "./components/BookmarksSection";
import SettingsModal from "./components/SettingsModal";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// LocalStorage key for bookmarks
const BOOKMARKS_STORAGE_KEY = "weather-albania-bookmarks";

function App() {
  // State management
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"cities" | "bookmarks">("cities");
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
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarkedIds));
    } catch (error) {
      console.error("Failed to save bookmarks to localStorage:", error);
    }
  }, [bookmarkedIds]);

  // Toggle bookmark status for a city
  const toggleBookmark = (cityId: string): void => {
    const city = albanianCities.find((c) => c.id === cityId);
    const cityName = city?.name || "City";
    const isCurrentlyBookmarked = bookmarkedIds.includes(cityId);

    setBookmarkedIds((prev) => {
      if (prev.includes(cityId)) {
        return prev.filter((id) => id !== cityId);
      } else {
        return [...prev, cityId];
      }
    });

    // Show toast after state update
    if (isCurrentlyBookmarked) {
      toast.success(`${cityName} removed from bookmarks`);
    } else {
      toast.success(`${cityName} added to bookmarks`);
    }
  };

  /**
   * Remove a city from bookmarks
   */
  const removeFromBookmarks = (cityId: string): void => {
    const city = albanianCities.find((c) => c.id === cityId);
    const cityName = city?.name || "City";

    setBookmarkedIds((prev) => prev.filter((id) => id !== cityId));
    toast.success(`${cityName} removed from bookmarks`);
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
        <div className="md:hidden pt-6">
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center py-6">
          <nav className="inline-flex items-center justify-center rounded-xl bg-white/95 backdrop-blur-md p-1 text-muted-foreground shadow-lg relative">
            <div
              className={`absolute top-1 bottom-1 rounded-xl bg-sky-500 shadow-md transition-all duration-300 ease-in-out ${
                activeTab === "cities" ? "left-1" : "left-[calc(50%)]"
              }`}
              style={{
                width: "calc(50% - 4px)",
              }}
            />
            <button
              onClick={() => setActiveTab("cities")}
              className={`relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-xl px-8 py-2.5 text-sm font-semibold transition-colors duration-300 ease-in-out gap-2 cursor-pointer ${
                activeTab === "cities" ? "text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>Cities</span>
              <span
                className={`px-3 py-0.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === "cities" ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {albanianCities.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-xl px-8 py-2.5 text-sm font-semibold transition-colors duration-300 ease-in-out gap-2 cursor-pointer ${
                activeTab === "bookmarks" ? "text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>Bookmarks</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                  activeTab === "bookmarks" ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {bookmarkedIds.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <main className="pb-8">
          {activeTab === "cities" ? (
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

      {/* Toast Notifications */}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;
