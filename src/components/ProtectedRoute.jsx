import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Envuelve las rutas privadas: si no hay sesión, redirige al login.
 */
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return <div className="page-loading">Cargando…</div>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}
