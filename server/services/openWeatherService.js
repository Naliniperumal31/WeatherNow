
const axios = require("axios");

const getWeatherData = async (city) => {
  try {
    console.log("Searching city:", city);

    // 1. Find city coordinates
    let geoResponse;

    try {
      geoResponse = await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        {
          params: {
            name: city,
            count: 1,
            language: "en",
            format: "json",
          },
          timeout: 15000,
        }
      );
    } catch (error) {
      console.error(
        "GEOCODING ERROR:",
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }

    const location = geoResponse.data.results?.[0];

    if (!location) {
      const error = new Error("City not found");
      error.statusCode = 404;
      throw error;
    }

    console.log("City found:", location.name, location.country);

    // 2. Get weather forecast
    let weatherResponse;

    try {
      weatherResponse = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            current:
              "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
            hourly:
              "temperature_2m,precipitation,weather_code,wind_speed_10m",
            daily:
              "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
            temperature_unit: "celsius",
            wind_speed_unit: "kmh",
            precipitation_unit: "mm",
            timezone: "auto",
            forecast_days: 7,
          },
          timeout: 20000,
        }
      );
    } catch (error) {
      console.error(
        "FORECAST ERROR:",
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }

    const data = weatherResponse.data;

    return {
      location: {
        city: location.name,
        country: location.country,
        countryCode: location.country_code,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      current: {
        temperature: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        precipitation: data.current.precipitation,
        weatherCode: data.current.weather_code,
      },
      daily: data.daily.time.map((date, index) => ({
        date,
        high: data.daily.temperature_2m_max[index],
        low: data.daily.temperature_2m_min[index],
        precipitation: data.daily.precipitation_sum[index],
        weatherCode: data.daily.weather_code[index],
      })),
      hourly: data.hourly.time.map((time, index) => ({
        time,
        temperature: data.hourly.temperature_2m[index],
        precipitation: data.hourly.precipitation[index],
        windSpeed: data.hourly.wind_speed_10m[index],
        weatherCode: data.hourly.weather_code[index],
      })),
    };
  } catch (error) {
    console.error("Weather Service Error:", error.message);
    throw error;
  }
};

module.exports = { getWeatherData };