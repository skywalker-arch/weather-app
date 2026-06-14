import { useState } from "react";

function Forecast({ forecast, unit = "C", slowNetwork = false }) {

  const [detailed, setDetailed] = useState(false);

  const temp = (c) => (unit === "C" ? Math.round(c) : Math.round(c * 9 / 5 + 32));

  const items = detailed ? forecast.slice(0, 8) : (slowNetwork ? forecast.slice(0,4) : forecast.slice(0,6));

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold">Forecast</h3>
        <div className="flex items-center gap-2">
          <span className="text-sky-100/80 text-sm">24h</span>
          <button
            onClick={() => setDetailed(!detailed)}
            className="bg-slate-700 text-white px-3 py-1 rounded-lg text-sm"
            aria-pressed={detailed}
            aria-label="toggle detailed forecast"
          >
            {detailed ? "Compact" : "Detailed"}
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="min-w-28 bg-slate-700/60 backdrop-blur p-3 rounded-xl text-center text-white shrink-0"
            role="group"
            aria-label={`forecast-${index}`}
          >
            <p className="text-sm mb-1">{item.dt_txt.split(" ")[0]}</p>
            <p className="text-xs text-sky-100/80 mb-1">{item.dt_txt.split(" ")[1].slice(0,5)}</p>
            {!slowNetwork && item?.weather?.[0]?.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                className="mx-auto"
                alt={item?.weather?.[0]?.description || ""}
              />
            )}
            <h3 className="text-xl font-bold mt-2">{typeof item?.main?.temp === "number" ? temp(item.main.temp) : "--"}°</h3>
            <p className="text-xs text-sky-100/80 mt-1">POP: {Math.round((item.pop ?? 0) * 100)}%</p>
          </div>
        ))}
      </div>
    </div>
  );

}

export default Forecast;