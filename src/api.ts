// API functions for fetching weather data from Open-Meteo
import type { HistoricalWeatherData, WeatherData } from "./models/weather";
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

  // Precipitation unit - default to mm
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
 * Fetch forecast weather for a city (next 7-14 days)
 * @param latitude - City latitude
 * @param longitude - City longitude
 * @param settings - User settings for units and forecast days
 * @param days - Number of forecast days to fetch (default 7)
 * @returns Promise with forecast data
 */
export async function fetchForecast(
  latitude: number,
  longitude: number,
  settings: UserSettings,
  days: number = 7
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

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=${hourlyParams.join(",")}&daily=${dailyParams.join(",")}&timezone=auto&forecast_days=${days}&${urlParams}`;

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
 * Fetch historical weather data (past 7 days)
 * @param latitude - City latitude
 * @param longitude - City longitude
 * @returns Promise with historical weather data
 */
export async function fetchHistoricalWeather(
  latitude: number,
  longitude: number
): Promise<HistoricalWeatherData> {
  // Get date range for past 7 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&start_date=${formatDate(
    startDate
  )}&end_date=${formatDate(endDate)}&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: HistoricalWeatherData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching historical weather:", error);
    throw error;
  }
}
