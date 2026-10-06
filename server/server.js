require("dotenv").config();

const express = require("express");
const cors = require("cors");
const weatherRoutes = require("./routes/weatherRoutes");
const connectDB = require("./config/db");

const app = express();

connectDB();

const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/weather", weatherRoutes);
console.log("Weather routes loaded");

app.get("/", (req, res) => {
  res.send("Weather Now Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
