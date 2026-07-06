import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getGames, searchGames, deleteGame } from '../api/games'
import { IconClose } from '../components/icons'

const STATUS_FILTERS = ['All', 'Wishlist', 'Playing', 'Completed', 'Dropped']

const STATUS_COLORS = {
  Completed: 'bg-green-500/15 text-green-400 border-green-500/30',
  Playing: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Dropped: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  Wishlist: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function Library() {
  const [searchParams, setSearchParams] = useSearchParams()
  const platformId = searchParams.get('platform')
  const platformName = searchParams.get('platformName')

  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')

  const fetchGames = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (search.trim()) {
        const res = await searchGames(search.trim())
        setGames(res.data)
      } else {
        const params = {}
        if (statusFilter !== 'All') params.status = statusFilter
        if (platformId) params.platform = platformId
        const res = await getGames(params)
        setGames(res.data)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to load games')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search, platformId])

  useEffect(() => {
    const timeout = setTimeout(fetchGames, 300)
    return () => clearTimeout(timeout)
  }, [fetchGames])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this game from your library?')) return
    try {
      await deleteGame(id)
      setGames((prev) => prev.filter((g) => g.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete game')
    }
  }

  const clearPlatformFilter = () => setSearchParams({})

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">Library</h1>
        <Link
          to="/add"
          className="rounded-lg bg-scarlet px-4 py-2 text-sm font-medium text-white shadow-[0_4px_16px_-4px_rgba(224,38,63,0.6)] transition-colors hover:bg-ember"
        >
          + Add Game
        </Link>
      </div>

      {platformId && (
        <div className="mb-4 flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-full border border-scarlet/40 bg-scarlet/10 px-3 py-1.5 text-sm text-scarlet">
            Platform: {platformName ?? platformId}
            <button
              onClick={clearPlatformFilter}
              className="rounded-full p-0.5 hover:bg-scarlet/20"
              aria-label="Clear platform filter"
            >
              <IconClose className="h-3.5 w-3.5" />
            </button>
          </span>
        </div>
      )}

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-surface text-white rounded-lg px-4 py-2 border border-line focus:outline-none focus:border-scarlet mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            disabled={Boolean(search.trim())}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              statusFilter === status
                ? 'bg-scarlet text-white border-scarlet'
                : 'bg-surface text-gray-400 border-line hover:text-white'
            } ${search.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {status}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-scarlet/10 border border-scarlet/40 text-scarlet text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : games.length === 0 ? (
        <div className="text-gray-400">No games found.</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {games.map((game) => (
            <motion.div
              key={game.id}
              variants={cardVariants}
              className="overflow-hidden rounded-xl border border-line bg-surface transition-all duration-200 hover:border-scarlet/30 hover:shadow-[0_8px_24px_-12px_rgba(224,38,63,0.4)]"
            >
              {game.coverImageUrl && (
                <div className="h-32 w-full overflow-hidden">
                  <img src={game.coverImageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold text-lg">{game.title}</h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full border ${
                      STATUS_COLORS[game.status] || 'bg-gray-500/15 text-gray-400 border-gray-500/30'
                    }`}
                  >
                    {game.status}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-3">{game.genre}</p>

                <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                  <span>⭐ {game.rating}/10</span>
                  <span>{game.hoursPlayed}h played</span>
                  <span>{game.platform?.name ?? '—'}</span>
                </div>

                <div className="flex gap-4 text-sm">
                  <Link to={`/add/${game.id}`} className="text-scarlet hover:text-ember">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(game.id)} className="text-gray-500 hover:text-red-400">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
