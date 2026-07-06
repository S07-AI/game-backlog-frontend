import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconMark } from '../components/icons'

export default function Signup() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await register(email, displayName, password)
      navigate('/', { replace: true })
    } catch (err) {
      if (err.response?.status === 409) {
        setError('An account with that email already exists.')
      } else {
        setError(err.response?.data?.message || 'Could not create your account.')
      }
    } finally {
      setLoading(false)
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
          <h2 className="font-display text-lg font-semibold">Create an account</h2>

          {error && (
            <p className="rounded-lg bg-scarlet/10 border border-scarlet/30 px-3 py-2 text-sm text-scarlet">{error}</p>
          )}

          <label className="flex flex-col gap-1 text-sm text-gray-400">
            Display name
            <input
              type="text"
              required
              maxLength={50}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="rounded-lg border border-line bg-ink px-3 py-2 text-white outline-none focus:border-scarlet"
              autoComplete="nickname"
            />
          </label>

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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-line bg-ink px-3 py-2 text-white outline-none focus:border-scarlet"
              autoComplete="new-password"
            />
            <span className="text-xs text-gray-500">At least 8 characters.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-scarlet px-4 py-2 text-sm font-medium text-white shadow-[0_4px_16px_-4px_rgba(224,38,63,0.6)] transition-colors hover:bg-ember disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-scarlet hover:text-ember hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
