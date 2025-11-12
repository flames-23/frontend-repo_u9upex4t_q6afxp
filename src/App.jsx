import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HotelCard from './components/HotelCard'
import Login from './pages/Login'
import Contact from './pages/Contact'

function Home() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchHotels = async (city) => {
    try {
      setLoading(true)
      const url = city ? `${baseUrl}/hotels?city=${encodeURIComponent(city)}` : `${baseUrl}/hotels`
      const res = await fetch(url)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to load hotels')
      setHotels(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
    // Try seeding once (idempotent)
    fetch(`${baseUrl}/hotels/seed`, { method: 'POST' }).catch(() => {})
  }, [])

  const handleBook = (hotel) => {
    localStorage.setItem('selectedHotel', JSON.stringify(hotel))
    window.location.href = '/book'
  }

  return (
    <>
      <Hero onSearch={(city) => fetchHotels(city)} />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Hotels</h2>
        {loading ? (
          <p className="text-gray-600">Loading hotels...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((h) => (
              <HotelCard key={h.id} hotel={h} onBook={handleBook} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function BookingPage() {
  const navigate = useNavigate()
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const hotel = JSON.parse(localStorage.getItem('selectedHotel') || 'null')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState(null)

  const submitBooking = async (e) => {
    e.preventDefault()
    if (!hotel) return
    try {
      const res = await fetch(`${baseUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: 'guest@example.com',
          hotel_id: hotel.id,
          check_in: checkIn,
          check_out: checkOut,
          guests: Number(guests),
          special_requests: note
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Booking failed')
      setStatus('Your booking is confirmed!')
      setTimeout(() => navigate('/'), 1500)
    } catch (e) {
      setStatus(e.message)
    }
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">No hotel selected</p>
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-4 py-2 rounded-md">Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-start gap-4">
            <img src={hotel.images?.[0]} className="w-32 h-24 object-cover rounded" />
            <div>
              <h1 className="text-2xl font-semibold">{hotel.name}</h1>
              <p className="text-gray-600">{hotel.city}</p>
              <p className="font-medium mt-1">${hotel.price_per_night} / night</p>
            </div>
          </div>
          <form onSubmit={submitBooking} className="grid gap-3 mt-6">
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required className="rounded-md border px-3 py-2" />
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required className="rounded-md border px-3 py-2" />
            </div>
            <input type="number" min="1" max="10" value={guests} onChange={(e) => setGuests(e.target.value)} className="rounded-md border px-3 py-2" />
            <textarea placeholder="Special requests (optional)" value={note} onChange={(e) => setNote(e.target.value)} className="rounded-md border px-3 py-2" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Confirm Booking</button>
            {status && <p className="text-sm text-gray-700">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book" element={<BookingPage />} />
      </Routes>
    </div>
  )
}

export default App
