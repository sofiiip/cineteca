import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError('Email o contraseña incorrectos.')
      return
    }
    navigate('/')
  }

  return (
    <div className="auth-layout">
      <div className="auth-card card">
        <div className="auth-brand">
          <span aria-hidden="true">🎬</span> Cineteca
        </div>
        <h1 className="auth-title">Iniciá sesión</h1>
        <p className="auth-subtitle">Tu watchlist personal de películas y series.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  )
}
