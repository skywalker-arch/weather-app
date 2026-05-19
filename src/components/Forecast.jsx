function Forecast({
  forecast
}) {

  return (

    <div className="grid grid-cols-2 gap-4 mt-8">

      {forecast.map((item,index)=>(

        <div
          key={index}
          className="bg-slate-700 p-4 rounded-xl text-center text-white"
        >

          <p className="mb-2">
            {item.dt_txt.split(" ")[0]}
          </p>

          <img
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
            className="mx-auto"
          />

          <h3 className="text-xl font-bold">
            {Math.round(item.main.temp)}°
          </h3>

        </div>

      ))}

    </div>

  );

}

export default Forecast;