import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconDashboard, IconLibrary, IconPlatforms, IconAdd, IconLogout, IconClose, IconMark } from './icons'

const links = [
  { path: '/', label: 'Dashboard', icon: IconDashboard },
  { path: '/library', label: 'Library', icon: IconLibrary },
  { path: '/platforms', label: 'Platforms', icon: IconPlatforms },
  { path: '/add', label: 'Add Game', icon: IconAdd },
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
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-1.5 overflow-y-auto border-r border-line bg-surface p-6 transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:inset-auto md:min-h-screen md:translate-x-0`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <IconMark className="h-6 w-5 text-scarlet" />
            <h1 className="font-display text-lg font-bold tracking-tight text-white">
              Backlog<span className="text-scarlet">.</span>
            </h1>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        {links.map(link => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-scarlet text-white shadow-[0_4px_16px_-4px_rgba(224,38,63,0.6)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          )
        })}

        <div className="mt-auto flex flex-col gap-2 border-t border-line pt-4">
          {user && (
            <span className="truncate px-4 text-xs text-gray-500">{user.displayName}</span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
          >
            <IconLogout className="h-[18px] w-[18px]" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  )
}
