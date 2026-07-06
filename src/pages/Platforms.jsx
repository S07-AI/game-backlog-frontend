import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getPlatforms, getPlatformGames } from '../api/games'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function Platforms() {
  const [platforms, setPlatforms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlatformsWithCounts = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getPlatforms()
        const platformList = res.data

        const withCounts = await Promise.all(
          platformList.map(async (p) => {
            try {
              const gamesRes = await getPlatformGames(p.id)
              return { ...p, gameCount: gamesRes.data.length }
            } catch {
              return { ...p, gameCount: 0 }
            }
          })
        )

        setPlatforms(withCounts)
      } catch (err) {
        console.error(err)
        setError('Failed to load platforms')
      } finally {
        setLoading(false)
      }
    }

    fetchPlatformsWithCounts()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <h1 className="text-2xl font-bold text-white mb-6">Platforms</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : platforms.length === 0 ? (
        <div className="text-gray-400">No platforms found.</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {platforms.map((platform) => (
            <motion.div
              key={platform.id}
              variants={cardVariants}
              className="bg-[#1a1d27] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition"
            >
              <h3 className="text-white font-semibold text-lg mb-1">{platform.name}</h3>
              <p className="text-gray-400 text-sm">
                {platform.gameCount} {platform.gameCount === 1 ? 'game' : 'games'}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}