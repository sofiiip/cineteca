import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setLoading(true)
    setError(null)
    const { data, error } = await signUp(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    // Si la confirmación por email está desactivada, ya hay sesión activa.
    if (data.session) {
      navigate('/')
    } else {
      setMessage('¡Listo! Revisá tu email para confirmar la cuenta y luego iniciá sesión.')
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-card card">
        <div className="auth-brand">
          <span aria-hidden="true">🎬</span> Cineteca
        </div>
        <h1 className="auth-title">Creá tu cuenta</h1>
        <p className="auth-subtitle">Empezá a armar tu watchlist en segundos.</p>

        {message ? (
          <p className="form-success">{message}</p>
        ) : (
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
              {loading ? 'Creando…' : 'Registrarme'}
            </button>
          </form>
        )}

        <p className="auth-switch">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  )
}
