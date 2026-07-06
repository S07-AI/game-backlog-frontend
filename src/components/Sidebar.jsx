import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/library', label: 'Library', icon: '🎮' },
  { path: '/platforms', label: 'Platforms', icon: '🖥️' },
  { path: '/add', label: 'Add Game', icon: '➕' },
]

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* Backdrop — mobile only, closes the drawer on tap */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-2 overflow-y-auto border-r border-white/10 bg-[#1a1d27] p-6 transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:inset-auto md:min-h-screen md:translate-x-0`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-tight">
            🎯 Backlog Tracker
          </h1>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            onClick={onClose}
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
    </>
  )
}
