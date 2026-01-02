import React, { useMemo } from 'react';
import type { City } from '../models/cities';
import BookmarksSection from '../components/BookmarksSection';

interface BookmarksPageProps {
  cities: City[];
  searchTerm: string;
  bookmarkedIds: string[];
  onRemoveBookmark: (cityId: string) => void;
}

const BookmarksPage: React.FC<BookmarksPageProps> = ({
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

  return (
    <div className="w-full">
      {searchTerm.trim() && bookmarkedCities.length === 0 && bookmarkedIds.length > 0 ? (
        <div className="text-center py-16 text-white">
          <div className="text-7xl mb-4">🔍</div>
          <h2 className="text-3xl font-bold mb-2">No bookmarked cities found</h2>
          <p className="text-xl opacity-90">Try a different search term.</p>
        </div>
      ) : (
        <BookmarksSection
          bookmarkedCities={bookmarkedCities}
          onRemoveBookmark={onRemoveBookmark}
        />
      )}
    </div>
  );
};

export default BookmarksPage;
