import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
    <div className="flex min-h-screen items-center justify-center bg-[#0f1117] px-4 text-white">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold tracking-tight">
          🎯 Backlog Tracker
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#1a1d27] p-6"
        >
          <h2 className="text-lg font-semibold">Create an account</h2>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          <label className="flex flex-col gap-1 text-sm text-gray-400">
            Display name
            <input
              type="text"
              required
              maxLength={50}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="rounded-lg border border-white/10 bg-[#0f1117] px-3 py-2 text-white outline-none focus:border-indigo-500"
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
              className="rounded-lg border border-white/10 bg-[#0f1117] px-3 py-2 text-white outline-none focus:border-indigo-500"
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
              className="rounded-lg border border-white/10 bg-[#0f1117] px-3 py-2 text-white outline-none focus:border-indigo-500"
              autoComplete="new-password"
            />
            <span className="text-xs text-gray-500">At least 8 characters.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
