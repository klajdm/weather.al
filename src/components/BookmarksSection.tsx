import React from 'react';
import type { City } from '../models/cities';
import CityDetails from './CityDetails';

interface BookmarksSectionProps {
  bookmarkedCities: City[];
  onRemoveBookmark: (cityId: string) => void;
}

/**
 * BookmarksSection Component
 * Displays all bookmarked cities with detailed weather information
 */
const BookmarksSection: React.FC<BookmarksSectionProps> = ({
  bookmarkedCities,
  onRemoveBookmark,
}) => {
  // Show empty state if no bookmarks
  if (bookmarkedCities.length === 0) {
    return (
      <div className="text-center py-20 text-white">
        <div className="text-8xl mb-6 opacity-70">⭐</div>
        <h2 className="text-4xl font-bold mb-4">No bookmarked cities yet.</h2>
        <p className="text-xl opacity-90 max-w-lg mx-auto">
          Add cities to your bookmarks from the Cities tab to see detailed weather information here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        {bookmarkedCities.map((city) => (
          <CityDetails
            key={city.id}
            city={city}
            onRemoveBookmark={onRemoveBookmark}
          />
        ))}
      </div>
    </div>
  );
};

export default BookmarksSection;
