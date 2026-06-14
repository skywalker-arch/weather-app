import { useState, useEffect } from "react";

import './App.css';
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import Loader from "./components/Loader";
import SearchHistory from "./components/SearchHistory";
import Favorites from "./components/Favorites";
import Background from "./components/Background";

function App(){

  const [city,setCity] = useState("");

  const [weather,setWeather] = useState(null);

  const [forecast,setForecast] = useState([]);

  const [loading,setLoading] = useState(false);

  const [error,setError] = useState("");

  const [darkMode,setDarkMode] = useState(() => {
    try {
      const v = localStorage.getItem("darkMode");
      return v !== null ? JSON.parse(v) : true;
    } catch { return true; }
  });

  const [unit,setUnit] = useState(() => {
    try {
      return localStorage.getItem("unit") || "C";
    } catch { return "C"; }
  });

  const [searches,setSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem("recent")) || []; } catch (e) { return []; }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("favorites")) || []; } catch { return []; }
  });

  const apiKey = import.meta.env.VITE_API_KEY;

  const [saveData, setSaveData] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
  });
  const [slowNetwork, setSlowNetwork] = useState(() => {
    try {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const type = conn?.effectiveType || '';
      return type === '2g' || type === 'slow-2g';
    } catch { return false; }
  });

  

  useEffect(()=>{
    try{ localStorage.setItem("favorites", JSON.stringify(favorites)); } catch (e) { /* ignore */ }
  },[favorites]);

  useEffect(()=>{
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const handler = () => {
      if (conn && 'saveData' in conn) setSaveData(conn.saveData);
      if (conn && 'effectiveType' in conn) setSlowNetwork(conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g');
    };
    try{ conn && conn.addEventListener && conn.addEventListener('change', handler); } catch (e) { /* ignore */ }
    const mm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    const mmHandler = (e) => setPrefersReducedMotion(e.matches);
    try{ mm && mm.addEventListener && mm.addEventListener('change', mmHandler); } catch (e) { /* ignore */ }
    return () => {
      try{ conn && conn.removeEventListener && conn.removeEventListener('change', handler); } catch (e) { /* ignore */ }
      try{ mm && mm.removeEventListener && mm.removeEventListener('change', mmHandler); } catch (e) { /* ignore */ }
    };
  },[]);

  function addFavorite(city){
    if(!city) return;
    setFavorites(prev => {
      const next = [city, ...prev.filter(c => c !== city)].slice(0,10);
      return next;
    });
  }

  function removeFavorite(city){
    setFavorites(prev => prev.filter(c => c !== city));
  }

  async function getWeather(searchCity){
    if(searchCity === ""){
      return;
    }

    try{

      setLoading(true);

      setError("");

      const weatherUrl =
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}&units=metric`;

      const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${apiKey}&units=metric`;

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        setError(weatherData.message || "City not found");
        setWeather(null);
        setForecast([]);
        setLoading(false);
        return;
      }

      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      if (!forecastResponse.ok) {
        // If forecast failed but current weather succeeded, still show weather
        setWeather(weatherData);
        setForecast([]);
        saveSearch(searchCity);
        setLoading(false);
        return;
      }

      // At this point both responses are OK
      setWeather(weatherData);
      setForecast(Array.isArray(forecastData.list) ? forecastData.list.slice(0,6) : []);
      saveSearch(searchCity);

    }

    catch(error){

      console.log(error);

      setError("Something went wrong");

    }

    setLoading(false);

  }

  function saveSearch(city){

    let recent =
      JSON.parse(localStorage.getItem("recent")) || [];

    recent.unshift(city);

    recent = [...new Set(recent)].slice(0,5);

    localStorage.setItem(
      "recent",
      JSON.stringify(recent)
    );

    setSearches(recent);

  }

  const getBgClass = () => {
    if (!weather) return darkMode ? "bg-slate-900" : "bg-sky-100";

    const main = (weather?.weather?.[0]?.main || "").toLowerCase();

    const isDay = (() => {
      if (typeof weather?.dt === "number" && typeof weather?.sys?.sunrise === "number" && typeof weather?.sys?.sunset === "number") {
        return weather.dt >= weather.sys.sunrise && weather.dt < weather.sys.sunset;
      }
      return true;
    })();

    if (main.includes("cloud")) return isDay ? "bg-linear-to-br from-gray-400 via-blue-500 to-gray-700" : "bg-linear-to-br from-gray-700 via-slate-900 to-black";
    if (main.includes("rain") || main.includes("drizzle")) return "bg-linear-to-br from-blue-800 via-indigo-700 to-slate-900";
    if (main.includes("thunder")) return "bg-linear-to-br from-purple-800 via-indigo-900 to-black";
    if (main.includes("snow")) return "bg-linear-to-br from-blue-200 via-white to-slate-400";
    if (main.includes("clear")) return isDay ? "bg-linear-to-br from-sky-400 via-sky-600 to-indigo-700" : "bg-linear-to-br from-indigo-900 via-slate-900 to-black";

    return darkMode ? "bg-slate-900" : "bg-sky-100";
  };

  const bgClass = getBgClass();

  // Persist unit and theme
  useEffect(()=>{
    try{
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    } catch (e) { /* ignore */ }
  },[darkMode]);

  useEffect(()=>{
    try{
      localStorage.setItem("unit", unit);
    } catch (e) { /* ignore */ }
  },[unit]);

  // Geolocation: fetch weather by coordinates
  async function getWeatherByCoords(lat, lon){
    try{
      setLoading(true);
      setError("");

      const weatherUrl =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        setError(weatherData.message || "Location not found");
        setWeather(null);
        setForecast([]);
        setLoading(false);
        return;
      }

      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      if (!forecastResponse.ok) {
        setWeather(weatherData);
        setForecast([]);
        saveSearch(weatherData.name || "");
        setLoading(false);
        return;
      }

      setWeather(weatherData);
      setCity(weatherData.name || "");
      setForecast(Array.isArray(forecastData.list) ? forecastData.list.slice(0,6) : []);
      if (weatherData.name) saveSearch(weatherData.name);

    }
    catch(err){
      console.error(err);
      setError("Something went wrong");
    }
    setLoading(false);
  }

  function locateMe(){
    if (!navigator.geolocation){
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        getWeatherByCoords(latitude, longitude);
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  }

  return (

    <div className={`relative min-h-screen transition duration-500 ${bgClass}`}>

      <Background weather={weather} reduceMotion={prefersReducedMotion || saveData || slowNetwork} />

      <div className="relative z-10 max-w-md mx-auto p-6">

          <div className="flex justify-between mb-6">

            <div className="flex gap-3">
              <button
                onClick={()=>setDarkMode(!darkMode)}
                className="bg-slate-700 text-white px-4 py-2 rounded-xl"
                aria-label="toggle theme"
              >
                Mode
              </button>

              <button
                onClick={locateMe}
                className="bg-sky-600 text-white px-4 py-2 rounded-xl"
                aria-label="use my location"
              >
                Locate
              </button>
            </div>

            <button
              onClick={()=>
                setUnit(unit === "C" ? "F" : "C")
              }
              className="bg-sky-500 text-white px-4 py-2 rounded-xl"
              aria-label="toggle units"
            >
              °{unit}
            </button>

          </div>

        <SearchBar
          city={city}
          setCity={setCity}
          getWeather={getWeather}
        />

        <SearchHistory
          searches={searches}
          setCity={setCity}
          getWeather={getWeather}
        />

        <Favorites
          favorites={favorites}
          setCity={setCity}
          getWeather={getWeather}
          removeFavorite={removeFavorite}
        />

        {loading && <Loader/>}

        {error && (
          <p className="text-red-500 mt-5 text-center">
            {error}
          </p>
        )}

        {weather && (
          <WeatherCard
            weather={weather}
            unit={unit}
            addFavorite={addFavorite}
            isFavorite={favorites.includes(weather?.name)}
            slowNetwork={slowNetwork}
          />
        )}

        {forecast.length > 0 && (
          <Forecast forecast={forecast} unit={unit} slowNetwork={slowNetwork} />
        )}

      </div>

    </div>

  );

}

export default App;