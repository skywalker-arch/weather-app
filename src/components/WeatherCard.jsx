import { motion } from "framer-motion";

function WeatherCard({ weather, unit, addFavorite, isFavorite }) {

  const temp = (c) => (unit === "C" ? Math.round(c) : Math.round(c * 9 / 5 + 32));

  const formatTime = (unixSec, tzOffset) => {
    if (typeof unixSec !== "number" || typeof tzOffset !== "number") return "--";
    const date = new Date((unixSec + tzOffset) * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const localTime = weather?.dt && typeof weather.timezone === "number"
    ? formatTime(weather.dt, weather.timezone)
    : "--";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >

      <div className="bg-linear-to-br from-sky-600 via-indigo-600 to-slate-700 rounded-2xl p-6 shadow-xl text-white">

        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <h2 className="text-3xl font-bold">{weather?.name || ""}</h2>
            <p className="text-sm text-sky-100/80">Local time: {localTime}</p>
          </div>

          <div className="flex items-center gap-3">
            {weather?.weather?.[0]?.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt={weather?.weather?.[0]?.description || "weather icon"}
                className="w-24 h-24"
              />
            )}

            {addFavorite && (
              <button
                onClick={() => addFavorite(weather?.name)}
                className="bg-slate-700 text-sky-200 px-3 py-2 rounded-lg"
                aria-pressed={isFavorite}
                aria-label="add to favorites"
              >
                {isFavorite ? "★" : "☆"}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-end justify-center gap-6">
          <div className="text-center">
            <h1 className="text-6xl font-bold">
              {typeof weather?.main?.temp === "number" ? temp(weather.main.temp) : "--"}
              <span className="text-2xl">°{unit}</span>
            </h1>
            <p className="capitalize mt-1">{weather?.weather?.[0]?.description || ""}</p>
          </div>

          <div className="text-left text-sky-100/90">
            <p>Feels like: <strong className="text-white">{typeof weather?.main?.feels_like === "number" ? temp(weather.main.feels_like) + `°${unit}` : "--"}</strong></p>
            <p>Humidity: <strong className="text-white">{weather?.main?.humidity ?? "--"}%</strong></p>
            <p>Pressure: <strong className="text-white">{weather?.main?.pressure ?? "--"} hPa</strong></p>
            <p>Wind: <strong className="text-white">{weather?.wind?.speed ?? "--"} m/s</strong></p>
          </div>
        </div>

        <div className="mt-5 flex justify-between text-sm text-sky-100/80">
          <div>
            <p>Sunrise</p>
            <p className="text-white">{formatTime(weather?.sys?.sunrise, weather?.timezone ?? 0)}</p>
          </div>
          <div>
            <p>Sunset</p>
            <p className="text-white">{formatTime(weather?.sys?.sunset, weather?.timezone ?? 0)}</p>
          </div>
        </div>

      </div>

    </motion.div>
  );

}

export default WeatherCard;