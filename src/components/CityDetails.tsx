import React, { useEffect, useState } from 'react';
import type { City } from '../models/cities';
import type { WeatherData } from '../models/weather';
import {
  fetchForecast,
  getWeatherDescription,
  getWeatherEmoji,
} from '../api';
import { useSettings } from '../hooks/useSettings';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CityDetailsProps {
  city: City;
  onRemoveBookmark: (cityId: string) => void;
}

/**
 * CityDetails Component
 * Displays detailed weather information including forecast and history for bookmarked cities
 */
const CityDetails: React.FC<CityDetailsProps> = ({ city, onRemoveBookmark }) => {
  const { settings } = useSettings();
  const [forecast, setForecast] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showExtended, setShowExtended] = useState<boolean>(false);

  useEffect(() => {
    // Fetch forecast when component mounts or settings change
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        const forecastData = await fetchForecast(city.latitude, city.longitude, settings);
        setForecast(forecastData);
        setError(null);
      } catch (err) {
        setError('Failed to load weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [city.latitude, city.longitude, settings]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getUnitSymbol = () => {
    return settings.units.temperature === 'fahrenheit' ? '°F' : '°C';
  };

  const getWindSpeedUnit = () => {
    return 'km/h';
  };

  const getPrecipitationUnit = () => {
    return 'mm';
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-md border-none">
      <CardHeader className="flex flex-row justify-between items-center pb-4 border-b-2 border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800">{city.name}</h2>
        <Button
          variant="destructive"
          onClick={() => onRemoveBookmark(city.id)}
          title="Remove from bookmarks"
          className="bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
        >
          Remove
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
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

      {forecast && !loading && !error && (
        <div className="space-y-8">
          {/* Current Weather */}
          <div>
            <h3 className="text-2xl font-bold text-cyan-600 mb-4">Current Weather</h3>
            <div className="flex items-center gap-6 mb-6">
              <span className="text-8xl">
                {getWeatherEmoji(forecast.current_weather.weathercode)}
              </span>
              <div>
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  {Math.round(forecast.current_weather.temperature)}{getUnitSymbol()}
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
                  {Math.round(forecast.current_weather.windspeed)} {getWindSpeedUnit()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                <span className="text-gray-600 font-medium">Wind Direction:</span>
                <span className="font-bold text-gray-800 text-lg">
                  {forecast.current_weather.winddirection}°
                </span>
              </div>
              
              {/* Additional Weather Data */}
              {settings.weatherData.showHumidity && forecast.hourly?.relative_humidity_2m && (
                <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Humidity:</span>
                  <span className="font-bold text-gray-800 text-lg">
                    {forecast.hourly.relative_humidity_2m[0]}%
                  </span>
                </div>
              )}
              
              {settings.weatherData.showFeelsLike && forecast.hourly?.apparent_temperature && (
                <div className="flex justify-between items-center p-4 bg-cyan-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Feels Like:</span>
                  <span className="font-bold text-gray-800 text-lg">
                    {Math.round(forecast.hourly.apparent_temperature[0])}{getUnitSymbol()}
                  </span>
                </div>
              )}
              
              {settings.weatherData.showPressure && forecast.hourly?.surface_pressure && (
                <div className="flex justify-between items-center p-4 bg-teal-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Pressure:</span>
                  <span className="font-bold text-gray-800 text-lg">
                    {Math.round(forecast.hourly.surface_pressure[0])} hPa
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Forecast */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-cyan-600">
                {showExtended ? '14' : '7'}-Day Forecast
              </h3>
              <Button
                onClick={() => setShowExtended(!showExtended)}
                className="bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
              >
                {showExtended ? 'Show Less' : 'Show More'}
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {forecast.daily?.time.slice(0, showExtended ? 14 : 7).map((date, index) => (
                <div 
                  key={date} 
                  className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
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
                    <div className="text-xs text-cyan-600 font-medium">
                      💧 {forecast.daily!.precipitation_sum[index].toFixed(1)}{getPrecipitationUnit()}
                    </div>
                  )}
                  
                  {/* Additional Weather Data in Forecast */}
                  {settings.weatherData.showUVIndex && forecast.daily!.uv_index_max && (
                    <div className="text-xs text-orange-600 font-medium mt-1">
                      ☀️ UV: {forecast.daily!.uv_index_max[index].toFixed(1)}
                    </div>
                  )}
                  
                  {settings.weatherData.showSunriseSunset && forecast.daily!.sunrise && forecast.daily!.sunset && (
                    <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                      <div>🌅 {formatTime(forecast.daily!.sunrise[index])}</div>
                      <div>🌇 {formatTime(forecast.daily!.sunset[index])}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </CardContent>
    </Card>
  );
};

export default CityDetails;
