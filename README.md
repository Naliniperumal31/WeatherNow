# Weather Now 🌤️

A responsive weather application built using the MERN stack. Users can search for a city and view current weather, a 7-day forecast, and hourly weather information.

## Features

- Search weather by city name
- Current temperature
- Feels-like temperature
- Humidity
- Wind speed
- Precipitation
- 7-day weather forecast
- Hourly weather forecast
- Select different days to view hourly weather
- Celsius / Fahrenheit conversion
- km/h / mph wind conversion
- mm / inches precipitation conversion
- Loading state
- Error handling for invalid cities
- Empty search validation
- Search history stored in MongoDB
- Responsive design for mobile, tablet and desktop
- Keyboard search using Enter key

## Tech Stack

### Frontend

- React.js
- Vite
- CSS

### Backend

- Node.js
- Express.js
- Axios

### Database

- MongoDB
- Mongoose

### Weather API

- Open-Meteo API

## Project Structure

```text
WeatherNow/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── weatherController.js
│   ├── middleware/
│   │   └── errorMiddleware.js
│   ├── models/
│   │   └── SearchHistory.js
│   ├── routes/
│   │   └── weatherRoutes.js
│   ├── services/
│   │   └── openWeatherService.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

## API Architecture

The application follows this flow:

React Frontend
↓
Express / Node.js Backend
↓
Open-Meteo Weather API
↓
Backend transforms weather data
↓
React displays weather information
↓
MongoDB stores search history

## Backend API

### Get Weather

```text
GET /api/weather?city=London
```

Example:

```text
http://localhost:5000/api/weather?city=London
```

The backend receives the city name, gets the location and weather information from Open-Meteo, transforms the response, and sends the required data to the React frontend.

Successful searches are also stored in MongoDB.

## Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Do not commit the `.env` file to GitHub.

## Installation

### Install Backend Dependencies

```bash
cd server
npm install
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

## Run the Application

### Start Backend

```bash
cd server
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will run on the Vite development URL.

## MongoDB

MongoDB is used to store successful weather searches.

The search history collection stores the searched city names and timestamps.

Example:

```text
city: London
createdAt: ...
```

## Error Handling

The application handles:

- Empty city search
- Invalid city name
- Weather API errors
- Backend errors
- Loading state
- No weather data

## Responsive Design

The application is designed for:

- Mobile devices
- Tablets
- Desktop screens

The layout adapts to different screen sizes using responsive CSS.

## Accessibility

The application supports:

- Keyboard navigation
- Enter key search
- Clear form controls
- Visible interactive elements
- Readable text and contrast

## Future Improvements

Possible future improvements include:

- Recent searches UI
- Favorite cities
- Current location weather
- Weather-based backgrounds
- User authentication
- More detailed weather charts

## Learning Outcomes

Through this project, I practiced:

- React components and state management
- API integration
- Express.js routing
- Node.js backend development
- MongoDB database integration
- Responsive CSS
- Error handling
- Frontend and backend communication
- Git and GitHub workflow