import { useState } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import { IconMenu, IconMark } from './components/icons'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import Platforms from './pages/Platforms'
import AddGame from './pages/AddGame'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ConfirmEmail from './pages/ConfirmEmail'

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-ink text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <IconMark className="h-5 w-4 text-scarlet" />
            <span className="font-display text-base font-bold tracking-tight">
              Backlog<span className="text-scarlet">.</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-300 hover:bg-white/5 hover:text-white"
            aria-label="Open menu"
          >
            <IconMenu className="h-[22px] w-[22px]" />
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
        <Route path="/confirm" element={<ConfirmEmail />} />

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
