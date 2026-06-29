import { NavLink } from 'react-router-dom'

const links = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/library', label: 'Library', icon: '🎮' },
  { path: '/platforms', label: 'Platforms', icon: '🖥️' },
  { path: '/add', label: 'Add Game', icon: '➕' },
]

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#1a1d27] min-h-screen p-6 flex flex-col gap-2 border-r border-white/10">
      <h1 className="text-xl font-bold text-white mb-8 tracking-tight">
        🎯 Backlog Tracker
      </h1>
      {links.map(link => (
        <NavLink
          key={link.path}
          to={link.path}
          end={link.path === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 
            ${isActive
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <span>{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </div>
  )
}
