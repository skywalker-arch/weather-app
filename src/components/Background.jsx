function Background({ weather, reduceMotion = false }){

  const main = (weather?.weather?.[0]?.main || "").toLowerCase();
  const isDay = (() => {
    if (!weather) return true;
    if (typeof weather.dt === 'number' && typeof weather.sys?.sunrise === 'number' && typeof weather.sys?.sunset === 'number') {
      return weather.dt >= weather.sys.sunrise && weather.dt < weather.sys.sunset;
    }
    return true;
  })();

  // If user requested reduced motion or save-data, show simple static backgroun
  if (reduceMotion) {
    const gradient = main.includes('clear') ? (isDay ? 'linear-gradient(180deg,#7dd3fc,#3b82f6)' : 'linear-gradient(180deg,#0f172a,#020617)')
      : main.includes('cloud') ? 'linear-gradient(180deg,#cbd5e1,#94a3b8)'
      : main.includes('rain') ? 'linear-gradient(180deg,#0ea5e9,#0369a1)'
      : main.includes('snow') ? 'linear-gradient(180deg,#e6f0ff,#cfe9ff)' : 'linear-gradient(180deg,#0f172a,#0b1220)';

    return (
      <div className="weather-bg pointer-events-none absolute inset-0 z-0" style={{ background: gradient }} />
    );
  }

  return (
    <div className="weather-bg pointer-events-none absolute inset-0 z-0">
      {/* Clear */}
      
      {main.includes('clear') && (
        <div className={`sun-wrap ${isDay ? 'day' : 'night'}`}>
          <div className="sun" />
        </div>
      )}

      {/* Clouds */}
      {main.includes('cloud') && (
        <div className="clouds">
          <div className="cloud cloud-1" />
          <div className="cloud cloud-2" />
        </div>
      )}

      {/* Rain */}
      {(main.includes('rain') || main.includes('drizzle')) && (
        <div className="rain">
          <div className="drops" />
        </div>
      )}

      {/* Snow */}
      {main.includes('snow') && (
        <div className="snow">
          <div className="flake" />
          <div className="flake flake-2" />
        </div>
      )}

      {/* Thunder */}
      {main.includes('thunder') && (
        <div className="thunder">
          <div className="bolt" />
        </div>
      )}
    </div>
  );

}

export default Background;
