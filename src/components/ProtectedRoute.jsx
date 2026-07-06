import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-gray-400">
        Loading…
      </div>
    )
  }

  if (status === 'guest') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
