import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import Platforms from './pages/Platforms'
import AddGame from './pages/AddGame'

export default function App() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-[#0f1117] text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/library" element={<Library />} />
            <Route path="/platforms" element={<Platforms />} />
            <Route path="/add" element={<AddGame />} />
            <Route path="/add/:id" element={<AddGame />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}