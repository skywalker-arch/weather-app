function SearchHistory({
  searches,
  setCity,
  getWeather
}) {

  return (

    <div className="mt-6">

      <h3 className="text-white mb-3 font-semibold">
        Recent Searches
      </h3>

      <div className="flex flex-wrap gap-2">

        {searches.map((item,index)=>(

          <button
            key={index}
            type="button"
            onClick={()=>{
              setCity(item);
              getWeather(item);
            }}
            className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm"
            aria-label={`search ${item}`}
            title={`Search ${item}`}
          >
            {item}
          </button>

        ))}

      </div>

    </div>

  );

}

export default SearchHistory;