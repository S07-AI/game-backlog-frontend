import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { createGame, updateGame, getGame, getPlatforms, searchExternalGames } from '../api/games'

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
    coverImageUrl: '',
  })

  // Live game-search dropdown under the Title field
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const skipNextSearch = useRef(false)

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
          coverImageUrl: g.coverImageUrl ?? '',
        })
      })
      .catch(() => setError('Failed to load game'))
      .finally(() => setLoading(false))
  }, [id, isEditMode])

  // Debounced search against our backend's RAWG proxy whenever the title changes
  useEffect(() => {
    if (skipNextSearch.current) {
      skipNextSearch.current = false
      return
    }
    if (!form.title.trim()) {
      setSearchResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await searchExternalGames(form.title.trim())
        setSearchResults(res.data)
        setShowResults(true)
      } catch (err) {
        console.error(err)
      } finally {
        setSearching(false)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [form.title])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePickResult = (result) => {
    skipNextSearch.current = true // the title change below shouldn't re-trigger a search
    setForm((prev) => ({
      ...prev,
      title: result.name,
      genre: result.genre || prev.genre,
      coverImageUrl: result.backgroundImage || prev.coverImageUrl,
    }))
    setShowResults(false)
    setSearchResults([])
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
      coverImageUrl: form.coverImageUrl || null,
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
      <h1 className="font-display text-2xl font-bold tracking-tight text-white mb-6">
        {isEditMode ? 'Edit Game' : 'Add New Game'}
      </h1>

      {error && (
        <div className="bg-scarlet/10 border border-scarlet/40 text-scarlet text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            autoComplete="off"
            required
            className="w-full bg-surface text-white rounded-lg px-4 py-2 border border-line focus:outline-none focus:border-scarlet"
          />
          {searching && (
            <p className="mt-1 text-xs text-gray-500">Searching…</p>
          )}

          {showResults && searchResults.length > 0 && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-line bg-surface-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
              {searchResults.map((result) => (
                <button
                  type="button"
                  key={result.rawgId}
                  onClick={() => handlePickResult(result)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-white/5"
                >
                  {result.backgroundImage ? (
                    <img
                      src={result.backgroundImage}
                      alt=""
                      className="h-10 w-14 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-14 shrink-0 rounded bg-ink" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">{result.name}</p>
                    <p className="truncate text-xs text-gray-500">
                      {[result.genre, result.releaseYear].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </div>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="w-full border-t border-line px-3 py-1.5 text-center text-xs text-gray-500 hover:text-white"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {form.coverImageUrl && (
          <div className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3">
            <img src={form.coverImageUrl} alt="" className="h-16 w-24 rounded object-cover" />
            <div className="flex-1 text-sm text-gray-400">Cover art attached</div>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, coverImageUrl: '' }))}
              className="text-xs text-gray-500 hover:text-red-400"
            >
              Remove
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-1">Genre</label>
          <input
            type="text"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="w-full bg-surface text-white rounded-lg px-4 py-2 border border-line focus:outline-none focus:border-scarlet"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full bg-surface text-white rounded-lg px-4 py-2 border border-line focus:outline-none focus:border-scarlet"
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
            className="w-full bg-surface text-white rounded-lg px-4 py-2 border border-line focus:outline-none focus:border-scarlet"
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
            className="w-full bg-surface text-white rounded-lg px-4 py-2 border border-line focus:outline-none focus:border-scarlet"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Platform</label>
          <select
            name="platformId"
            value={form.platformId}
            onChange={handleChange}
            required
            className="w-full bg-surface text-white rounded-lg px-4 py-2 border border-line focus:outline-none focus:border-scarlet"
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
            className="bg-scarlet hover:bg-ember text-white font-medium rounded-lg px-5 py-2 shadow-[0_4px_16px_-4px_rgba(224,38,63,0.6)] transition-colors disabled:opacity-50"
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
