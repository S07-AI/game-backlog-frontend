import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconMark } from '../components/icons'

export default function ConfirmEmail() {
  const { confirmEmail } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState('confirming') // 'confirming' | 'success' | 'error'
  const [error, setError] = useState('')
  const ranOnce = useRef(false)

  useEffect(() => {
    // Guards against React 18 StrictMode's double-invoke in dev, which would
    // otherwise fire this single-use token request twice.
    if (ranOnce.current) return
    ranOnce.current = true

    if (!token) {
      setStatus('error')
      setError('Missing confirmation token.')
      return
    }

    confirmEmail(token)
      .then(() => {
        setStatus('success')
        setTimeout(() => navigate('/', { replace: true }), 1200)
      })
      .catch((err) => {
        setStatus('error')
        setError(err.response?.data?.message || 'This confirmation link is invalid or has expired.')
      })
  }, [token, confirmEmail, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-white">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <IconMark className="h-7 w-6 text-scarlet" />
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Backlog<span className="text-scarlet">.</span>
          </h1>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
          {status === 'confirming' && (
            <>
              <h2 className="font-display text-lg font-semibold">Confirming your email…</h2>
              <p className="text-sm text-gray-400">Just a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <h2 className="font-display text-lg font-semibold text-white">Email confirmed</h2>
              <p className="text-sm text-gray-400">Taking you to your dashboard…</p>
            </>
          )}

          {status === 'error' && (
            <>
              <h2 className="font-display text-lg font-semibold">Couldn't confirm your email</h2>
              <p className="rounded-lg bg-scarlet/10 border border-scarlet/30 px-3 py-2 text-sm text-scarlet">
                {error}
              </p>
              <Link to="/login" className="mt-1 text-sm text-scarlet hover:text-ember hover:underline">
                Back to log in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
