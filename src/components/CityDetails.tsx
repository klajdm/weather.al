import React, { useEffect, useState } from "react";
import type { City } from "../models/cities";
import type { WeatherData, HistoricalWeatherData } from "../models/weather";
import {
  fetchForecast,
  fetchHistoricalWeather,
  getWeatherDescription,
  getWeatherEmoji,
} from "../api";
import { useSettings } from "../hooks/useSettings";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

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
  const [historical, setHistorical] = useState<HistoricalWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showExtended, setShowExtended] = useState<boolean>(false);

  useEffect(() => {
    // Fetch forecast and historical data when component mounts or settings change
    const loadWeatherData = async (attempt = 0) => {
      try {
        setLoading(true);
        setError(null);
        const [forecastData, historicalData] = await Promise.all([
          fetchForecast(city.latitude, city.longitude, settings),
          fetchHistoricalWeather(city.latitude, city.longitude),
        ]);
        setForecast(forecastData);
        setHistorical(historicalData);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error(`Failed to load weather data for ${city.name}:`, err);

        // Retry logic: attempt up to 2 times with delay
        if (attempt < 2) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s
          setTimeout(() => {
            loadWeatherData(attempt + 1);
          }, delay);
        } else {
          setError("Failed to load weather data");
          setLoading(false);
        }
      }
    };

    loadWeatherData();
  }, [city.latitude, city.longitude, settings, city.name]);

  const handleRetry = () => {
    setError(null);
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        const [forecastData, historicalData] = await Promise.all([
          fetchForecast(city.latitude, city.longitude, settings),
          fetchHistoricalWeather(city.latitude, city.longitude),
        ]);
        setForecast(forecastData);
        setHistorical(historicalData);
        setError(null);
      } catch (err) {
        setError("Failed to load weather data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadWeatherData();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getUnitSymbol = () => {
    return settings.units.temperature === "fahrenheit" ? "°F" : "°C";
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="bg-white/95 backdrop-blur-md border-none shadow-lg overflow-hidden">
      <CardHeader className="flex flex-row justify-between items-center pb-4">
        <h2 className="text-2xl font-bold text-gray-800">{city.name}</h2>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemoveBookmark(city.id)}
          title="Remove from bookmarks"
          className="bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all"
        >
          Remove
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        {loading && (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-pulse">Loading weather data...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-6 px-4 space-y-3">
            <div className="bg-red-50 text-red-600 rounded-xl text-sm py-3 px-4">{error}</div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {forecast && !loading && !error && (
          <div className="space-y-6">
            {/* Current Weather - Modern */}
            <div className="bg-linear-to-br from-blue-50/50 to-cyan-50/50 rounded-2xl p-4 border border-blue-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">
                  Current Weather
                </h3>
                <div className="text-xs text-gray-500 font-medium">
                  {formatDateTime(forecast.current_weather.time)}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Weather Icon and Temperature */}
                <div className="flex items-center gap-4">
                  <div className="text-6xl drop-shadow-lg">
                    {getWeatherEmoji(forecast.current_weather.weathercode)}
                  </div>
                  <div>
                    <div className="text-5xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      {Math.round(forecast.current_weather.temperature)}
                      {getUnitSymbol()}
                    </div>
                    <div className="text-base text-gray-600 font-medium mt-1">
                      {getWeatherDescription(forecast.current_weather.weathercode)}
                    </div>
                  </div>
                </div>

                {/* Weather Details Grid - Modern */}
                <div className="flex-1 grid grid-cols-2 gap-3 content-start">
                  <div className="flex justify-between items-center px-2 sm:px-3 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl text-xs sm:text-sm shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <span className="text-gray-500 font-medium">Wind</span>
                    <span className="font-bold text-gray-800">
                      {Math.round(forecast.current_weather.windspeed)} km/h
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-2 sm:px-3 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl text-xs sm:text-sm shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <span className="text-gray-500 font-medium">Direction</span>
                    <span className="font-bold text-gray-800">
                      {forecast.current_weather.winddirection}°
                    </span>
                  </div>

                  {/* Additional Weather Data */}
                  {settings.weatherData.showHumidity && forecast.hourly?.relative_humidity_2m && (
                    <div className="flex justify-between items-center px-2 sm:px-3 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl text-xs sm:text-sm shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <span className="text-gray-500 font-medium">Humidity</span>
                      <span className="font-bold text-gray-800">
                        {forecast.hourly.relative_humidity_2m[0]}%
                      </span>
                    </div>
                  )}

                  {settings.weatherData.showFeelsLike && forecast.hourly?.apparent_temperature && (
                    <div className="flex justify-between items-center px-2 sm:px-3 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl text-xs sm:text-sm shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <span className="text-gray-500 font-medium">Feels Like</span>
                      <span className="font-bold text-gray-800">
                        {Math.round(forecast.hourly.apparent_temperature[0])}
                        {getUnitSymbol()}
                      </span>
                    </div>
                  )}

                  {settings.weatherData.showPressure && forecast.hourly?.surface_pressure && (
                    <div className="flex justify-between items-center px-2 sm:px-3 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl text-xs sm:text-sm shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <span className="text-gray-500 font-medium">Pressure</span>
                      <span className="font-bold text-gray-800">
                        {Math.round(forecast.hourly.surface_pressure[0])} hPa
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Historical Weather - Previous 7 Days */}
            {historical && (
              <div>
                <h3 className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-4">
                  Previous 7 Days
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {historical.daily.time.slice(0, -1).map((date, index) => (
                    <div
                      key={date}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl p-3 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-cyan-200"
                    >
                      <div className="font-semibold text-gray-700 text-xs mb-2">
                        {formatDate(date)}
                      </div>
                      <div className="text-4xl my-2 group-hover:scale-110 transition-transform duration-300">
                        {getWeatherEmoji(historical.daily.weathercode[index])}
                      </div>
                      <div className="flex justify-center items-center gap-1 text-sm font-bold mb-2">
                        <span className="text-red-500">
                          {Math.round(historical.daily.temperature_2m_max[index])}°
                        </span>
                        <span className="text-gray-300">/</span>
                        <span className="text-blue-500">
                          {Math.round(historical.daily.temperature_2m_min[index])}°
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight font-medium">
                        {getWeatherDescription(historical.daily.weathercode[index])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Forecast - Modern */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">
                  {showExtended ? "14" : "7"}-Day Forecast
                </h3>
                <Button
                  size="sm"
                  onClick={() => setShowExtended(!showExtended)}
                  className="bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 shadow-md hover:shadow-lg transition-all"
                >
                  {showExtended ? "Show Less" : "Show More"}
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {forecast.daily?.time.slice(0, showExtended ? 14 : 7).map((date, index) => (
                  <div
                    key={date}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-3 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-cyan-200"
                  >
                    <div className="font-semibold text-gray-700 text-xs mb-2">
                      {formatDate(date)}
                    </div>
                    <div className="text-4xl my-2 group-hover:scale-110 transition-transform duration-300">
                      {getWeatherEmoji(forecast.daily!.weathercode[index])}
                    </div>
                    <div className="flex justify-center items-center gap-1 text-sm font-bold mb-2">
                      <span className="text-red-500">
                        {Math.round(forecast.daily!.temperature_2m_max[index])}°
                      </span>
                      <span className="text-gray-300">/</span>
                      <span className="text-blue-500">
                        {Math.round(forecast.daily!.temperature_2m_min[index])}°
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-600 mb-1.5 leading-tight font-medium">
                      {getWeatherDescription(forecast.daily!.weathercode[index])}
                    </div>
                    {forecast.daily!.precipitation_sum && (
                      <div className="text-[10px] text-cyan-600 font-semibold bg-cyan-50 px-2 py-1 rounded-full inline-block">
                        Rain: {forecast.daily!.precipitation_sum[index].toFixed(1)}mm
                      </div>
                    )}

                    {/* Additional Weather Data in Forecast */}
                    {settings.weatherData.showUVIndex && forecast.daily!.uv_index_max && (
                      <div className="text-[10px] text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-full inline-block mt-1">
                        UV: {forecast.daily!.uv_index_max[index].toFixed(1)}
                      </div>
                    )}

                    {settings.weatherData.showSunriseSunset &&
                      forecast.daily!.sunrise &&
                      forecast.daily!.sunset && (
                        <div className="text-[10px] text-gray-500 mt-1.5 space-y-0.5 font-medium">
                          <div>Sunrise: {formatTime(forecast.daily!.sunrise[index])}</div>
                          <div>Sunset: {formatTime(forecast.daily!.sunset[index])}</div>
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
