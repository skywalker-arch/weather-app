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

    <div className="flex gap-3">

      <input
        type="text"
        value={city}
        placeholder="Enter city..."
        onChange={(e)=>setCity(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 p-3 rounded-xl bg-slate-700 text-white outline-none"
      />

      <button
        onClick={()=>getWeather(city)}
        className="bg-sky-500 hover:bg-sky-600 text-white px-5 rounded-xl transition"
      >
        Search
      </button>

    </div>

  );

}

export default SearchBar;