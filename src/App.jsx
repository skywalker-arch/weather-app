import { useState, useEffect } from "react";

import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import Loader from "./components/Loader";
import SearchHistory from "./components/SearchHistory";

function App(){

  const [city,setCity] = useState("");

  const [weather,setWeather] = useState(null);

  const [forecast,setForecast] = useState([]);

  const [loading,setLoading] = useState(false);

  const [error,setError] = useState("");

  const [darkMode,setDarkMode] = useState(true);

  const [unit,setUnit] = useState("C");

  const [searches,setSearches] = useState([]);

  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(()=>{

    const saved =
      JSON.parse(localStorage.getItem("recent")) || [];

    setSearches(saved);

  },[]);

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

  return (

    <div className={`min-h-screen transition duration-500 ${bgClass}`}>

      <div className="max-w-md mx-auto p-6">

        <div className="flex justify-between mb-6">

          <button
            onClick={()=>setDarkMode(!darkMode)}
            className="bg-slate-700 text-white px-4 py-2 rounded-xl"
          >
            Mode
          </button>

          <button
            onClick={()=>
              setUnit(unit === "C" ? "F" : "C")
            }
            className="bg-sky-500 text-white px-4 py-2 rounded-xl"
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
          />
        )}

        {forecast.length > 0 && (
          <Forecast forecast={forecast} unit={unit} />
        )}

      </div>

    </div>

  );

}

export default App;