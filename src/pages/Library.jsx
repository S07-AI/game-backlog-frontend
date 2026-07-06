import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getGames, searchGames, deleteGame } from '../api/games'

const STATUS_FILTERS = ['All', 'Wishlist', 'Playing', 'Completed', 'Dropped']

const STATUS_COLORS = {
  Completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  Playing: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  Dropped: 'bg-red-500/20 text-red-400 border-red-500/30',
  Wishlist: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
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
        const params = statusFilter !== 'All' ? { status: statusFilter } : {}
        const res = await getGames(params)
        setGames(res.data)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to load games')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search])

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

  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Library</h1>
        <Link
          to="/add"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg px-4 py-2 text-sm"
        >
          + Add Game
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-[#1a1d27] text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500 mb-4"
      />

      <div className="flex gap-2 mb-6">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            disabled={Boolean(search.trim())}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              statusFilter === status
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-[#1a1d27] text-gray-400 border-gray-700 hover:text-white'
            } ${search.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {status}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
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
              className="bg-[#1a1d27] rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-semibold text-lg">{game.title}</h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full border ${
                    STATUS_COLORS[game.status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
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

              <div className="flex gap-3 text-sm">
                <Link to={`/add/${game.id}`} className="text-indigo-400 hover:text-indigo-300">
                  Edit
                </Link>
                <button onClick={() => handleDelete(game.id)} className="text-red-400 hover:text-red-300">
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}