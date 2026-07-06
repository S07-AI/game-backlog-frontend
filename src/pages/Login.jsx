import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { resendConfirmationRequest } from '../api/auth'
import { IconMark } from '../components/icons'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [resendState, setResendState] = useState('idle') // 'idle' | 'sending' | 'sent'

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNeedsConfirmation(false)
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      if (err.response?.data?.emailNotConfirmed) {
        setNeedsConfirmation(true)
      }
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendState('sending')
    try {
      await resendConfirmationRequest(email)
    } finally {
      setResendState('sent')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-white">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <IconMark className="h-7 w-6 text-scarlet" />
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Backlog<span className="text-scarlet">.</span>
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        >
          <h2 className="font-display text-lg font-semibold">Log in</h2>

          {error && (
            <div className="rounded-lg bg-scarlet/10 border border-scarlet/30 px-3 py-2 text-sm text-scarlet">
              <p>{error}</p>
              {needsConfirmation && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendState !== 'idle'}
                  className="mt-1 text-scarlet underline hover:text-ember disabled:opacity-60"
                >
                  {resendState === 'sent' ? 'Confirmation email sent — check your inbox' : resendState === 'sending' ? 'Sending…' : 'Resend confirmation email'}
                </button>
              )}
            </div>
          )}

          <label className="flex flex-col gap-1 text-sm text-gray-400">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-line bg-ink px-3 py-2 text-white outline-none focus:border-scarlet"
              autoComplete="email"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-gray-400">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-line bg-ink px-3 py-2 text-white outline-none focus:border-scarlet"
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-scarlet px-4 py-2 text-sm font-medium text-white shadow-[0_4px_16px_-4px_rgba(224,38,63,0.6)] transition-colors hover:bg-ember disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-scarlet hover:text-ember hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
