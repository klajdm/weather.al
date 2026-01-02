import React, { useMemo } from 'react';
import type { City } from '../models/cities';
import CityDetails from './CityDetails';

interface BookmarksSectionProps {
  cities: City[];
  searchTerm: string;
  bookmarkedIds: string[];
  onRemoveBookmark: (cityId: string) => void;
}

const BookmarksSection: React.FC<BookmarksSectionProps> = ({
  cities,
  searchTerm,
  bookmarkedIds,
  onRemoveBookmark,
}) => {
  // Get bookmarked cities and filter by search term
  const bookmarkedCities = useMemo(() => {
    const bookmarked = cities.filter((city) => bookmarkedIds.includes(city.id));
    
    if (!searchTerm.trim()) {
      return bookmarked;
    }
    
    return bookmarked.filter((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cities, bookmarkedIds, searchTerm]);

  // Show empty state if no bookmarks
  if (bookmarkedCities.length === 0 && bookmarkedIds.length === 0) {
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

  // Show search no results state
  if (searchTerm.trim() && bookmarkedCities.length === 0 && bookmarkedIds.length > 0) {
    return (
      <div className="text-center py-16 text-white">
        <div className="text-7xl mb-4">🔍</div>
        <h2 className="text-3xl font-bold mb-2">No bookmarked cities found</h2>
        <p className="text-xl opacity-90">Try a different search term.</p>
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
