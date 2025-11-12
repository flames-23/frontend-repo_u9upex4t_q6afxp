export default function Hero({ onSearch }) {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="mx-auto max-w-6xl px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Book your perfect stay
          </h1>
          <p className="mt-4 text-gray-600">
            Discover top-rated hotels, resorts, and lodges around the world.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const city = new FormData(e.currentTarget).get('city')
              onSearch?.(city)
            }}
            className="mt-6 bg-white p-3 rounded-lg shadow flex gap-2"
          >
            <input
              name="city"
              placeholder="Search by city (e.g., Miami)"
              className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">
              Search
            </button>
          </form>
        </div>
        <div className="hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"
            alt="Hotel"
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
