import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getStats } from '../api/games'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'

const STATUS_COLORS = {
  Completed: '#22c55e',
  Playing: '#6366f1',
  Dropped: '#ef4444',
  Wishlist: '#f59e0b',
}

// Parent container — staggers its children in one after another
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

// Each card — fades up individually, timed by the parent's stagger
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getStats()
      .then(res => setStats(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-400">Loading stats...</div>
  if (error) return <div className="text-red-400">Could not connect to API. Is your backend running?</div>

  const chartData = stats.gamesByStatus.map(s => ({
    name: s.status,
    value: s.count,
    fill: STATUS_COLORS[s.status] ?? '#888',
  }))

  return (
    <motion.div
      className="max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
      <p className="text-gray-400 mb-8">Your backlog at a glance</p>

      <motion.div
        className="grid grid-cols-2 gap-4 mb-10 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[
          { label: 'Total Games', value: stats.totalGames, color: 'text-indigo-400' },
          { label: 'Hours Played', value: stats.totalHoursPlayed, color: 'text-green-400' },
          { label: 'Avg Rating', value: stats.averageRatingOfCompleted?.toFixed(1) ?? '—', color: 'text-yellow-400' },
          { label: 'Top Platform', value: stats.mostPopularPlatformId?.platformName ?? '—', color: 'text-pink-400' },
        ].map(card => (
          <motion.div
            key={card.label}
            variants={cardVariants}
            className="bg-[#1a1d27] rounded-xl p-6 border border-white/10"
          >
            <p className="text-gray-400 text-sm mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="bg-[#1a1d27] rounded-xl p-6 border border-white/10">
        <h3 className="text-white font-semibold mb-6">Games by Status</h3>
        <div className="flex items-center gap-8">
          <ResponsiveContainer width={220} height={220}>
            <RadialBarChart
              innerRadius="30%"
              outerRadius="100%"
              data={chartData}
              startAngle={180}
              endAngle={-180}
            >
              <RadialBar dataKey="value" cornerRadius={4} />
              <Tooltip
                contentStyle={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-3">
            {stats.gamesByStatus.map(s => (
              <div key={s.status} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: STATUS_COLORS[s.status] ?? '#888' }} />
                <span className="text-gray-300 text-sm">{s.status}</span>
                <span className="text-white font-bold ml-auto pl-6">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}