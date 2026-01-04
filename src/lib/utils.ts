import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

/**
 * Format date and time to "Weekday Day, HH:MM" format
 * @param dateString - ISO date string
 * @returns Formatted string like "Sun 4, 14:30"
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const day = date.getDate();
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${weekday} ${day}, ${timePart}`;
}

/**
 * Format date to "Mon DD" format
 * @param dateString - ISO date string
 * @returns Formatted string like "Jan 4"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Format time to "HH:MM" format
 * @param dateString - ISO date string
 * @returns Formatted string like "14:30"
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Get temperature unit symbol based on settings
 * @param temperatureUnit - "celsius" or "fahrenheit"
 * @returns "°C" or "°F"
 */
export function getUnitSymbol(temperatureUnit: "celsius" | "fahrenheit"): string {
  return temperatureUnit === "fahrenheit" ? "°F" : "°C";
}
