import React, { useEffect, useState } from 'react';
import type { City } from '../models/cities';
import type { WeatherData } from '../models/weather';
import { fetchCurrentWeather, getWeatherDescription, getWeatherEmoji } from '../api';

interface CityCardProps {
  city: City;
  isBookmarked: boolean;
  onToggleBookmark: (cityId: string) => void;
}

/**
 * CityCard Component
 * Displays a city with current weather information and bookmark toggle
 */
const CityCard: React.FC<CityCardProps> = ({ city, isBookmarked, onToggleBookmark }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current weather when component mounts
    const loadWeather = async () => {
      try {
        setLoading(true);
        const data = await fetchCurrentWeather(city.latitude, city.longitude);
        setWeather(data);
        setError(null);
      } catch (err) {
        setError('Failed to load weather');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [city.latitude, city.longitude]);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-800">{city.name}</h3>
        <button
          className="text-3xl hover:scale-125 transition-transform duration-200"
          onClick={() => onToggleBookmark(city.id)}
          title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
          {isBookmarked ? '★' : '☆'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">
          <div className="animate-pulse">Loading weather...</div>
        </div>
      )}

      {error && (
        <div className="text-center py-4 px-4 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {weather && !loading && !error && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-6xl">
              {getWeatherEmoji(weather.current_weather.weathercode)}
            </span>
            <span className="text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {Math.round(weather.current_weather.temperature)}°C
            </span>
          </div>
          <div className="text-lg text-gray-600 font-medium">
            {getWeatherDescription(weather.current_weather.weathercode)}
          </div>
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Wind:</span>
              <span className="font-semibold text-gray-700">
                {Math.round(weather.current_weather.windspeed)} km/h
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityCard;
