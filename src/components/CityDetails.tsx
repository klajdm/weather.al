import React, { useEffect, useState } from 'react';
import type { City } from '../models/cities';
import type { WeatherData, HistoricalWeatherData } from '../models/weather';
import {
  fetchForecast,
  fetchHistoricalWeather,
  getWeatherDescription,
  getWeatherEmoji,
} from '../api';

interface CityDetailsProps {
  city: City;
  onRemoveBookmark: (cityId: string) => void;
}

/**
 * CityDetails Component
 * Displays detailed weather information including forecast and history for bookmarked cities
 */
const CityDetails: React.FC<CityDetailsProps> = ({ city, onRemoveBookmark }) => {
  const [forecast, setForecast] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<HistoricalWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch forecast and historical data when component mounts
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        const [forecastData, historyData] = await Promise.all([
          fetchForecast(city.latitude, city.longitude),
          fetchHistoricalWeather(city.latitude, city.longitude),
        ]);
        setForecast(forecastData);
        setHistory(historyData);
        setError(null);
      } catch (err) {
        setError('Failed to load weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [city.latitude, city.longitude]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800">{city.name}</h2>
        <button
          className="px-6 py-3 bg-linear-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          onClick={() => onRemoveBookmark(city.id)}
          title="Remove from bookmarks"
        >
          Remove ✕
        </button>
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-500">
          <div className="animate-pulse text-lg">Loading weather data...</div>
        </div>
      )}

      {error && (
        <div className="text-center py-6 px-6 bg-red-50 text-red-600 rounded-2xl">
          {error}
        </div>
      )}

      {forecast && history && !loading && !error && (
        <div className="space-y-8">
          {/* Current Weather */}
          <div>
            <h3 className="text-2xl font-bold text-purple-600 mb-4">Current Weather</h3>
            <div className="flex items-center gap-6 mb-6">
              <span className="text-8xl">
                {getWeatherEmoji(forecast.current_weather.weathercode)}
              </span>
              <div>
                <div className="text-6xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {Math.round(forecast.current_weather.temperature)}°C
                </div>
                <div className="text-2xl text-gray-600 font-medium mt-2">
                  {getWeatherDescription(forecast.current_weather.weathercode)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                <span className="text-gray-600 font-medium">Wind Speed:</span>
                <span className="font-bold text-gray-800 text-lg">
                  {Math.round(forecast.current_weather.windspeed)} km/h
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                <span className="text-gray-600 font-medium">Wind Direction:</span>
                <span className="font-bold text-gray-800 text-lg">
                  {forecast.current_weather.winddirection}°
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div>
            <h3 className="text-2xl font-bold text-purple-600 mb-4">7-Day Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {forecast.daily?.time.map((date, index) => (
                <div 
                  key={date} 
                  className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="font-semibold text-gray-700 text-sm mb-2">
                    {formatDate(date)}
                  </div>
                  <div className="text-5xl my-3">
                    {getWeatherEmoji(forecast.daily!.weathercode[index])}
                  </div>
                  <div className="flex justify-center items-center gap-1 text-lg font-bold mb-2">
                    <span className="text-red-500">
                      {Math.round(forecast.daily!.temperature_2m_max[index])}°
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className="text-blue-500">
                      {Math.round(forecast.daily!.temperature_2m_min[index])}°
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {getWeatherDescription(forecast.daily!.weathercode[index])}
                  </div>
                  {forecast.daily!.precipitation_sum && (
                    <div className="text-xs text-blue-600 font-medium">
                      💧 {forecast.daily!.precipitation_sum[index].toFixed(1)}mm
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Historical Weather (Past 7 Days) */}
          <div>
            <h3 className="text-2xl font-bold text-purple-600 mb-4">Past 7 Days</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {history.daily.time.map((date, index) => (
                <div 
                  key={date} 
                  className="bg-linear-to-br from-gray-50 to-slate-100 rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="font-semibold text-gray-700 text-sm mb-2">
                    {formatDate(date)}
                  </div>
                  <div className="text-5xl my-3">
                    {getWeatherEmoji(history.daily.weathercode[index])}
                  </div>
                  <div className="flex justify-center items-center gap-1 text-lg font-bold mb-2">
                    <span className="text-red-500">
                      {Math.round(history.daily.temperature_2m_max[index])}°
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className="text-blue-500">
                      {Math.round(history.daily.temperature_2m_min[index])}°
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {getWeatherDescription(history.daily.weathercode[index])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityDetails;
