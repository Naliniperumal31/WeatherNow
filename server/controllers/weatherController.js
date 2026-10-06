const { getWeatherData } = require("../services/openWeatherService");
const SearchHistory = require("../models/SearchHistory");

const getWeatherController = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city || !city.trim()) {
      return res.status(400).json({
        message: "Please enter a city name",
      });
    }

    const weatherData = await getWeatherData(city.trim());

    await SearchHistory.create({
      city: city.trim(),
    });

    res.status(200).json(weatherData);
  } catch (error) {
    console.log("Weather API Error:", error.message);

    const statusCode = error.statusCode || error.status || 500;

    res.status(statusCode).json({
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  getWeather: getWeatherController,
};