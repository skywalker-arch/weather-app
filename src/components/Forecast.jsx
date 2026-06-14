function Forecast({ forecast, unit = "C" }) {

  const temp = (c) => (unit === "C" ? Math.round(c) : Math.round(c * 9 / 5 + 32));

  return (
    <div className="mt-6">
      <h3 className="text-white mb-3 font-semibold">Forecast</h3>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {forecast.map((item, index) => (
          <div
            key={index}
            className="min-w-[120px] bg-slate-700 p-3 rounded-xl text-center text-white flex-shrink-0"
          >
            <p className="text-sm mb-1">{item.dt_txt.split(" ")[0]}</p>
            <p className="text-xs text-sky-100/80 mb-1">{item.dt_txt.split(" ")[1].slice(0,5)}</p>
            {item?.weather?.[0]?.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                className="mx-auto"
                alt={item?.weather?.[0]?.description || ""}
              />
            )}
            <h3 className="text-xl font-bold mt-2">{typeof item?.main?.temp === "number" ? temp(item.main.temp) : "--"}°</h3>
          </div>
        ))}
      </div>
    </div>
  );

}

export default Forecast;