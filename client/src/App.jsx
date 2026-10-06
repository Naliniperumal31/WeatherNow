import { useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState('')
  const [unit, setUnit] = useState('C')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  // Temperature conversion
  const convertTemp = (temp) => {
    return unit === 'C' ? temp : (temp * 9) / 5 + 32
  }

  // Wind conversion
  const convertWind = (speed) => {
    return unit === 'C' ? speed : speed * 0.621371
  }

  // Precipitation conversion
  const convertRain = (rain) => {
    return unit === 'C' ? rain : rain / 25.4
  }

  // Weather icon
  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️'
    if ([1, 2, 3].includes(code)) return '🌤️'
    if ([45, 48].includes(code)) return '🌫️'
    if ([51, 53, 55, 56, 57].includes(code)) return '🌦️'
    if ([61, 63, 65, 66, 67].includes(code)) return '🌧️'
    if ([71, 73, 75, 77].includes(code)) return '❄️'
    if ([80, 81, 82].includes(code)) return '🌦️'
    if ([95, 96, 99].includes(code)) return '⛈️'

    return '🌤️'
  }

  // Format hourly time
  const formatTime = (time) => {
    const date = new Date(time)

    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  // Search weather
  const searchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to fetch weather')
      }

      setWeather(data)

      // Automatically select first day
      setSelectedDate(data.daily?.[0]?.date || '')
    } catch (err) {
      setWeather(null)
      setSelectedDate('')
      setError(err.message || 'Unable to fetch weather')
    } finally {
      setLoading(false)
    }
  }

  // Selected day
  const activeDate =
    selectedDate || weather?.daily?.[0]?.date || ''

  // Hourly data for selected day
  const selectedHourly =
    weather?.hourly
      ?.filter((item) => item.time.startsWith(activeDate))
      .slice(0, 12) || []

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <h1>🌤️ Weather Now</h1>
        <p>Your daily weather companion</p>

        <div className="unit-buttons">
          <button
            onClick={() => setUnit('C')}
            className={unit === 'C' ? 'active' : ''}
          >
            °C
          </button>

          <button
            onClick={() => setUnit('F')}
            className={unit === 'F' ? 'active' : ''}
          >
            °F
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="main">

        <h2>Check the Weather</h2>

        <p>Enter your city to know the weather</p>

        {/* SEARCH */}
        <div className="search">

          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                searchWeather()
              }
            }}
          />

          <button
            onClick={searchWeather}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Search'}
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {/* WEATHER DATA */}
        {weather && (
          <>

            {/* CURRENT WEATHER */}
            <div className="weather-card">

              <div className="weather-icon">
                {getWeatherIcon(
                  weather.current.weatherCode
                )}
              </div>

              <h2>
                {weather.location.city},{' '}
                {weather.location.country}
              </h2>

              <h1>
                {Math.round(
                  convertTemp(
                    weather.current.temperature
                  )
                )}
                °{unit}
              </h1>

              {/* WEATHER DETAILS */}
              <div className="weather-details">

                <div className="weather-detail">
                  <span>Feels Like</span>

                  <strong>
                    {Math.round(
                      convertTemp(
                        weather.current.feelsLike
                      )
                    )}
                    °{unit}
                  </strong>
                </div>

                <div className="weather-detail">
                  <span>Humidity</span>

                  <strong>
                    {weather.current.humidity}%
                  </strong>
                </div>

                <div className="weather-detail">
                  <span>Wind</span>

                  <strong>
                    {Math.round(
                      convertWind(
                        weather.current.windSpeed
                      )
                    )}{' '}
                    {unit === 'C' ? 'km/h' : 'mph'}
                  </strong>
                </div>

                <div className="weather-detail">
                  <span>Precipitation</span>

                  <strong>
                    {convertRain(
                      weather.current.precipitation
                    ).toFixed(1)}{' '}
                    {unit === 'C' ? 'mm' : 'in'}
                  </strong>
                </div>

              </div>

            </div>

            {/* 7 DAY FORECAST */}
            <div className="forecast-section">

              <h2>7-Day Forecast</h2>

              <div className="forecast-list">

                {weather.daily.map((item, index) => (

                  <div
                    className={`forecast-card ${
                      activeDate === item.date
                        ? 'selected'
                        : ''
                    }`}
                    key={item.date}
                    onClick={() =>
                      setSelectedDate(item.date)
                    }
                  >

                    <h3>
                      {index === 0
                        ? 'Today'
                        : new Date(
                            item.date
                          ).toLocaleDateString(
                            [],
                            {
                              weekday: 'short',
                            }
                          )}
                    </h3>

                    <div className="forecast-icon">
                      {getWeatherIcon(
                        item.weatherCode
                      )}
                    </div>

                    <p>
                      {Math.round(
                        convertTemp(item.high)
                      )}
                      ° /{' '}
                      {Math.round(
                        convertTemp(item.low)
                      )}
                      °
                    </p>

                  </div>

                ))}

              </div>

            </div>

            {/* HOURLY FORECAST */}
            <div className="hourly-section">

              <h2>Hourly Forecast</h2>

              <p className="hourly-day">
                {activeDate
                  ? new Date(
                      activeDate
                    ).toLocaleDateString([], {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Select a day'}
              </p>

              <div className="hourly-list">

                {selectedHourly.length > 0 ? (

                  selectedHourly.map((item) => (

                    <div
                      className="hourly-card"
                      key={item.time}
                    >

                      <p>
                        {formatTime(item.time)}
                      </p>

                      <div className="hourly-icon">
                        {getWeatherIcon(
                          item.weatherCode
                        )}
                      </div>

                      <h3>
                        {Math.round(
                          convertTemp(
                            item.temperature
                          )
                        )}
                        °{unit}
                      </h3>

                    </div>

                  ))

                ) : (

                  <p>
                    No hourly data available.
                  </p>

                )}

              </div>

            </div>

          </>
        )}

        {/* EMPTY STATE */}
        {!weather &&
          !loading &&
          !error && (

            <div className="weather-card">

              <div className="weather-icon">
                🌤️
              </div>

              <h2>Your City</h2>

              <p>
                Search for a city to see the weather
              </p>

            </div>

          )}

      </main>

      {/* FOOTER */}
      <footer>
        <p>
          Weather Now © 2026
        </p>
      </footer>

    </div>
  )
}

export default App