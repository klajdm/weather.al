// User settings interface and types

export type TemperatureUnit = "celsius" | "fahrenheit";

export interface UserSettings {
  units: {
    temperature: TemperatureUnit;
  };
  weatherData: {
    showUVIndex: boolean;
    showSunriseSunset: boolean;
    showHumidity: boolean;
    showFeelsLike: boolean;
    showPressure: boolean;
  };
}

export const defaultSettings: UserSettings = {
  units: {
    temperature: "celsius",
  },
  weatherData: {
    showUVIndex: false,
    showSunriseSunset: false,
    showHumidity: false,
    showFeelsLike: false,
    showPressure: false,
  },
};
