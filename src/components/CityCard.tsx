import React, { useEffect, useState, useRef } from "react";
import type { City } from "../models/cities";
import type { WeatherData } from "../models/weather";
import { fetchCurrentWeather, getWeatherDescription, getWeatherEmoji } from "../api";
import { useSettings } from "../hooks/useSettings";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MdStar } from "react-icons/md";
import { MdStarBorder } from "react-icons/md";
import { MapPin } from "lucide-react";

interface CityCardProps {
  city: City;
  isBookmarked: boolean;
  onToggleBookmark: (cityId: string) => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, isBookmarked, onToggleBookmark }) => {
  const { settings } = useSettings();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect when card is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing once visible
          }
        });
      },
      {
        rootMargin: "100px", // Load weather slightly before card is visible
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Only fetch weather when card becomes visible
    if (!isVisible) return;

    const loadWeather = async (attempt = 0) => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCurrentWeather(city.latitude, city.longitude, settings);
        setWeather(data);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error(`Failed to load weather for ${city.name}:`, err);

        // Retry logic: attempt up to 2 times with delay
        if (attempt < 2) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s
          setTimeout(() => {
            loadWeather(attempt + 1);
          }, delay);
        } else {
          setError("Failed to load weather");
          setLoading(false);
        }
      }
    };

    loadWeather();
  }, [isVisible, city.latitude, city.longitude, settings, city.name]);

  const handleRetry = () => {
    setError(null);
    const loadWeather = async () => {
      try {
        setLoading(true);
        const data = await fetchCurrentWeather(city.latitude, city.longitude, settings);
        setWeather(data);
        setError(null);
      } catch (err) {
        setError("Failed to load weather");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadWeather();
  };

  const getUnitSymbol = () => {
    return settings.units.temperature === "fahrenheit" ? "°F" : "°C";
  };

  const getWindSpeedUnit = () => {
    return "km/h";
  };

  return (
    <Card
      ref={cardRef}
      className="bg-white/90 backdrop-blur-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none"
    >
      <CardHeader className="flex flex-row justify-between items-center pb-2 sm:pb-4">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-800">{city.name}</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="text-2xl sm:text-3xl hover:scale-125 transition-transform duration-200 h-auto w-auto p-1 cursor-pointer"
                onClick={() => onToggleBookmark(city.id)}
              >
                {isBookmarked ? (
                  <MdStar className="text-yellow-400" />
                ) : (
                  <MdStarBorder className="hover:text-yellow-400" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>

      <CardContent>
        {!isVisible && (
          <div className="text-center py-8 text-gray-400">
            <MapPin className="w-10 h-10 mx-auto animate-pulse" strokeWidth={1.5} />
          </div>
        )}

        {isVisible && loading && (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-pulse">Loading weather...</div>
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

        {weather && !loading && !error && (
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-4xl sm:text-6xl">
                {getWeatherEmoji(weather.current_weather.weathercode)}
              </span>
              <span className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                {Math.round(weather.current_weather.temperature)}
                {getUnitSymbol()}
              </span>
            </div>
            <div className="text-sm sm:text-lg text-gray-600 font-medium">
              {getWeatherDescription(weather.current_weather.weathercode)}
            </div>
            <div className="pt-2 sm:pt-3 border-t border-gray-200">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-500">Wind:</span>
                <span className="font-semibold text-gray-700">
                  {Math.round(weather.current_weather.windspeed)} {getWindSpeedUnit()}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CityCard;
