import { motion } from "framer-motion";

function WeatherCard({
  weather,
  unit
}) {

  return (

    <motion.div
      initial={{ opacity:0, y:30 }}
      animate={{ opacity:1, y:0 }}
      className="text-white text-center mt-8"
    >

      <h2 className="text-4xl font-bold mb-2">
        {weather.name}
      </h2>

      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        className="mx-auto"
      />

      <h1 className="text-6xl font-bold">

        {Math.round(weather.main.temp)}
        °{unit}

      </h1>

      <p className="capitalize text-xl mt-2">
        {weather.weather[0].description}
      </p>

      <div className="mt-5 flex justify-center gap-8">

        <div>
          <p className="text-slate-300">
            Humidity
          </p>

          <h3 className="text-xl">
            {weather.main.humidity}%
          </h3>
        </div>

        <div>
          <p className="text-slate-300">
            Wind
          </p>

          <h3 className="text-xl">
            {weather.wind.speed} km/h
          </h3>
        </div>

      </div>

    </motion.div>

  );

}

export default WeatherCard;