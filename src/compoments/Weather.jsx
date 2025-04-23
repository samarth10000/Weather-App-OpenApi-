import React, { useEffect, useState, useRef } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';

const Weather = () => {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const inputRef = useRef();

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }

    setLoading(true);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        alert('City not found');
        setWeatherData(null);
        setTimeout(() => setLoading(false), 2000); // Ensure loading shows for 2 seconds
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      const newWeatherData = {
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      };

      // Ensure spinner shows for at least 2 seconds
      setTimeout(() => {
        setWeatherData(newWeatherData);
        setLoading(false);
      }, 2000);
    } catch (error) {
      setWeatherData(null);
      setTimeout(() => setLoading(false), 2000); // Ensure spinner shows for 2 seconds
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    search("paris");
  }, []);

  return (
    <div className="Weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img
          src={search_icon}
          alt="Search"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {loading ? (
        <div className="spinner">
          <div></div>
        </div>
      ) : weatherData ? (
        <>
          <img src={weatherData.icon} className="Weather-icon" alt="Weather Icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="Location">{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind Speed" />
              <div>
                <p>{weatherData.windspeed}</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>Please search for a city</>
      )}
    </div>
  );
};

export default Weather;
