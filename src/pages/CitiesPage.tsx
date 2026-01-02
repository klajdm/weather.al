import React, { useMemo } from 'react';
import type { City } from '../models/cities';
import CityCard from '../components/CityCard';

interface CitiesPageProps {
  cities: City[];
  searchTerm: string;
  bookmarkedIds: string[];
  onToggleBookmark: (cityId: string) => void;
}

const CitiesPage: React.FC<CitiesPageProps> = ({
  cities,
  searchTerm,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  // Filter cities based on search term
  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) {
      return cities;
    }
    return cities.filter((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cities, searchTerm]);

  return (
    <div className="w-full">
      {filteredCities.length === 0 ? (
        <div className="text-center py-16 text-white">
          <div className="text-7xl mb-4">🔍</div>
          <h2 className="text-3xl font-bold mb-2">No cities found</h2>
          <p className="text-xl opacity-90">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCities.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              isBookmarked={bookmarkedIds.includes(city.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CitiesPage;
