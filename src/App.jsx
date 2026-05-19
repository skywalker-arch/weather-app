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

  const apiKey = "92f7ffa03f9e9af53314a2ca078ff1ed";

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

      const forecastResponse = await fetch(forecastUrl);

      const forecastData = await forecastResponse.json();

      if(weatherData.cod === "404"){

        setError("City not found");

        setWeather(null);

      } else {

        setWeather(weatherData);

        setForecast(forecastData.list.slice(0,6));

        saveSearch(searchCity);

      }

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

  return (

    <div className={
      darkMode
      ? "min-h-screen bg-slate-900 transition duration-500"
      : "min-h-screen bg-sky-100 transition duration-500"
    }>

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
          <Forecast forecast={forecast}/>
        )}

      </div>

    </div>

  );

}

export default App;