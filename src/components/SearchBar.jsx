function SearchBar({
  city,
  setCity,
  getWeather
}) {

  function handleKeyDown(e){

    if(e.key === "Enter"){
      getWeather(city);
    }

  }

  return (

    <div className="flex gap-3 items-center">

      <div className="relative flex-1">
        <svg className="w-5 h-5 text-sky-200 absolute left-3 top-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <input
          type="text"
          value={city}
          placeholder="Search city or ZIP code"
          onChange={(e)=>setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 p-3 rounded-xl bg-slate-700 text-white outline-none"
        />

        {city && (
          <button
            onClick={()=>setCity("")}
            className="absolute right-3 top-3 text-sky-200 hover:text-white"
            aria-label="clear"
          >
            ×
          </button>
        )}
      </div>

      <button
        onClick={()=>getWeather(city)}
        className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 rounded-xl transition"
      >
        Search
      </button>

    </div>

  );

}

export default SearchBar;