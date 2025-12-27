// TypeScript interfaces for weather data models

export interface CurrentWeather {
  temperature: number;
  weathercode: number;
  windspeed: number;
  winddirection: number;
  time: string;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  weathercode: number[];
  precipitation_probability: number[];
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  current_weather: CurrentWeather;
  hourly?: HourlyForecast;
  daily?: DailyForecast;
}

export interface HistoricalWeatherData {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}
