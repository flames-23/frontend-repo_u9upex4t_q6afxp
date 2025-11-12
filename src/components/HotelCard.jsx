export default function HotelCard({ hotel, onBook }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="relative h-44 overflow-hidden">
        <img
          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1501117716987-c8e3f71b1e47'}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
            <p className="text-sm text-gray-600">{hotel.city}</p>
          </div>
          <span className="text-sm font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            ⭐ {hotel.rating?.toFixed?.(1) || hotel.rating}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{hotel.description}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="text-gray-900 font-semibold">${hotel.price_per_night} / night</div>
          <button
            onClick={() => onBook?.(hotel)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  )
}
