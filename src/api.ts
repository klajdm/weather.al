// API functions for fetching weather data from Open-Meteo
// Documentation: https://open-meteo.com/en/docs

import type { WeatherData } from "./models/weather";
import type { UserSettings } from "./models/settings";

/**
 * Build API URL parameters from user settings
 */
function buildUrlParams(settings: UserSettings): string {
  const params = new URLSearchParams();

  // Temperature unit
  if (settings.units.temperature === "fahrenheit") {
    params.append("temperature_unit", "fahrenheit");
  }

  // Wind speed unit - default to km/h
  params.append("wind_speed_unit", "kmh");

  // Precipitation unit - default to mm (no param needed, it's the default)

  return params.toString();
}

/**
 * Fetch current weather for a city
 * @param latitude - City latitude
 * @param longitude - City longitude
 * @param settings - User settings for units
 * @returns Promise with current weather data
 */
export async function fetchCurrentWeather(
  latitude: number,
  longitude: number,
  settings: UserSettings
): Promise<WeatherData> {
  const urlParams = buildUrlParams(settings);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto&${urlParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: WeatherData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
}

/**
 * Fetch forecast weather for a city (next 3-14 days)
 * @param latitude - City latitude
 * @param longitude - City longitude
 * @param settings - User settings for units and forecast days
 * @returns Promise with forecast data
 */
export async function fetchForecast(
  latitude: number,
  longitude: number,
  settings: UserSettings
): Promise<WeatherData> {
  const urlParams = buildUrlParams(settings);

  // Build daily parameters based on settings
  const dailyParams = [
    "weathercode",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_sum",
  ];
  if (settings.weatherData.showUVIndex) dailyParams.push("uv_index_max");
  if (settings.weatherData.showSunriseSunset) dailyParams.push("sunrise", "sunset");

  // Build hourly parameters based on settings
  const hourlyParams = ["temperature_2m", "weathercode", "precipitation_probability"];
  if (settings.weatherData.showHumidity) hourlyParams.push("relativehumidity_2m");
  if (settings.weatherData.showFeelsLike) hourlyParams.push("apparent_temperature");
  if (settings.weatherData.showPressure) hourlyParams.push("surface_pressure");

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=${hourlyParams.join(",")}&daily=${dailyParams.join(",")}&timezone=auto&forecast_days=14&${urlParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: WeatherData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
}

/**
 * Get weather description from WMO weather code
 * @param code - WMO weather code
 * @returns Weather description string
 */
export function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  return weatherCodes[code] || "Unknown";
}

/**
 * Get weather emoji icon from WMO weather code
 * @param code - WMO weather code
 * @returns Weather emoji
 */
export function getWeatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "🌨️";
  return "⛈️";
}
