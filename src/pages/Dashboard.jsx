import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getStats } from '../api/games'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'

const STATUS_COLORS = {
  Completed: '#22c55e',
  Playing: '#3b82f6',
  Dropped: '#64748b',
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
  if (error) return <div className="text-scarlet">Could not connect to API. Is your backend running?</div>

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
      <h2 className="font-display text-3xl font-bold tracking-tight text-white mb-2">Dashboard</h2>
      <p className="text-gray-400 mb-8">Your backlog at a glance</p>

      <motion.div
        className="grid grid-cols-2 gap-4 mb-10 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[
          { label: 'Total Games', value: stats.totalGames, color: 'text-scarlet' },
          { label: 'Hours Played', value: stats.totalHoursPlayed, color: 'text-green-400' },
          { label: 'Avg Rating', value: stats.averageRatingOfCompleted?.toFixed(1) ?? '—', color: 'text-yellow-400' },
          { label: 'Top Platform', value: stats.mostPopularPlatformId?.platformName ?? '—', color: 'text-gray-200' },
        ].map(card => (
          <motion.div
            key={card.label}
            variants={cardVariants}
            className="rounded-xl border border-line bg-surface p-6 transition-colors duration-200 hover:border-scarlet/30"
          >
            <p className="text-gray-400 text-sm mb-1">{card.label}</p>
            <p className={`font-display text-3xl font-bold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="rounded-xl border border-line bg-surface p-4 sm:p-6">
        <h3 className="font-display font-semibold text-white mb-6">Games by Status</h3>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <div className="w-full max-w-[220px] shrink-0" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="30%"
                outerRadius="100%"
                data={chartData}
                startAngle={180}
                endAngle={-180}
              >
                <RadialBar dataKey="value" cornerRadius={4} />
                <Tooltip
                  contentStyle={{ background: '#131315', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto">
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
