
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Weather routes
app.use("/api/weather", require("./routes/weatherRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "WeatherNow API is running" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected successfully");
    } else {
      console.error("MONGO_URI is missing");
      process.exit(1);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();