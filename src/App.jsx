import { useState } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import Platforms from './pages/Platforms'
import AddGame from './pages/AddGame'
import Login from './pages/Login'
import Signup from './pages/Signup'

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#0f1117] text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#1a1d27] px-4 py-3 md:hidden">
          <span className="text-lg font-bold tracking-tight">🎯 Backlog Tracker</span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-300 hover:bg-white/5 hover:text-white"
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/library" element={<Library />} />
            <Route path="/platforms" element={<Platforms />} />
            <Route path="/add" element={<AddGame />} />
            <Route path="/add/:id" element={<AddGame />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
