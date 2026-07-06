import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { createGame, updateGame, getGame, getPlatforms } from '../api/games'

const STATUS_OPTIONS = ['Wishlist', 'Playing', 'Completed', 'Dropped']

export default function AddGame() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const [platforms, setPlatforms] = useState([])
  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    title: '',
    genre: '',
    status: 'Wishlist',
    rating: '',
    hoursPlayed: '',
    platformId: '',
  })

  useEffect(() => {
    getPlatforms()
      .then((res) => setPlatforms(res.data))
      .catch(() => setError('Failed to load platforms'))
  }, [])

  useEffect(() => {
    if (!isEditMode) return
    getGame(id)
      .then((res) => {
        const g = res.data
        setForm({
          title: g.title ?? '',
          genre: g.genre ?? '',
          status: g.status ?? 'Wishlist',
          rating: g.rating ?? '',
          hoursPlayed: g.hoursPlayed ?? '',
          platformId: g.platformId ?? '',
        })
      })
      .catch(() => setError('Failed to load game'))
      .finally(() => setLoading(false))
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload = {
      title: form.title,
      genre: form.genre,
      status: form.status,
      rating: Number(form.rating),
      hoursPlayed: Number(form.hoursPlayed),
      platformId: Number(form.platformId),
    }

    try {
      if (isEditMode) {
        await updateGame(id, payload)
      } else {
        await createGame(payload)
      }
      navigate('/library')
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.title ||
        err.response?.data?.message ||
        'Something went wrong. Check your inputs and try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  return (
    <motion.div
      className="max-w-xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <h1 className="text-2xl font-bold text-white mb-6">
        {isEditMode ? 'Edit Game' : 'Add New Game'}
      </h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1d27] text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Genre</label>
          <input
            type="text"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="w-full bg-[#1a1d27] text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full bg-[#1a1d27] text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Rating (1–10)</label>
          <input
            type="number"
            name="rating"
            min="1"
            max="10"
            value={form.rating}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1d27] text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Hours Played</label>
          <input
            type="number"
            name="hoursPlayed"
            min="0"
            value={form.hoursPlayed}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1d27] text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Platform</label>
          <select
            name="platformId"
            value={form.platformId}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1d27] text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="" disabled>Select a platform</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg px-5 py-2 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Game'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/library')}
            className="text-gray-400 hover:text-white px-5 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  )
}