import { Routes, Route, Navigate } from 'react-router-dom';
import CitiesPage from './pages/CitiesPage';
import BookmarksPage from './pages/BookmarksPage';
import type { City } from './models/cities';

interface AppRoutesProps {
  cities: City[];
  searchTerm: string;
  bookmarkedIds: string[];
  onToggleBookmark: (cityId: string) => void;
  onRemoveBookmark: (cityId: string) => void;
}

/**
 * Application Routes
 * Centralized routing configuration for the Weather Albania app
 */
export default function AppRoutes({
  cities,
  searchTerm,
  bookmarkedIds,
  onToggleBookmark,
  onRemoveBookmark,
}: AppRoutesProps) {
  return (
    <Routes>
      {/* Redirect root to cities */}
      <Route path="/" element={<Navigate to="/cities" replace />} />
      
      {/* Cities Page - Browse all Albanian cities */}
      <Route
        path="/cities"
        element={
          <CitiesPage
            cities={cities}
            searchTerm={searchTerm}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={onToggleBookmark}
          />
        }
      />
      
      {/* Bookmarks Page - View saved cities with detailed weather */}
      <Route
        path="/bookmarks"
        element={
          <BookmarksPage
            cities={cities}
            searchTerm={searchTerm}
            bookmarkedIds={bookmarkedIds}
            onRemoveBookmark={onRemoveBookmark}
          />
        }
      />
      
      {/* Catch-all redirect to cities */}
      <Route path="*" element={<Navigate to="/cities" replace />} />
    </Routes>
  );
}
