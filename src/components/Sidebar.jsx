import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/library', label: 'Library', icon: '🎮' },
  { path: '/platforms', label: 'Platforms', icon: '🖥️' },
  { path: '/add', label: 'Add Game', icon: '➕' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

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

      <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-4">
        {user && (
          <span className="truncate px-4 text-xs text-gray-500">{user.displayName}</span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
        >
          <span>🚪</span>
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}
