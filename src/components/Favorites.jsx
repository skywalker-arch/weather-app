function Favorites({ favorites = [], setCity, getWeather, removeFavorite }) {

  if (!favorites || favorites.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-white mb-3 font-semibold">Favorites</h3>

      <div className="flex flex-wrap gap-2">
        {favorites.map((city, i) => (
          <div key={i} className="flex items-center gap-2 bg-slate-700 px-3 py-2 rounded-lg">
            <button
              onClick={() => { setCity(city); getWeather(city); }}
              className="text-white text-sm"
              aria-label={`load ${city}`}
            >
              {city}
            </button>

            <button
              onClick={() => removeFavorite(city)}
              className="text-sky-200 text-sm"
              aria-label={`remove ${city} from favorites`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );

}

export default Favorites;
