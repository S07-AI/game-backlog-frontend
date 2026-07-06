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
  return (
    <div className="flex min-h-screen bg-[#0f1117] text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
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
