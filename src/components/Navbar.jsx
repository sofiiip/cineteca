import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo" aria-hidden="true">🎬</span>
        <span className="navbar__name">Cineteca</span>
      </div>

      {user && (
        <div className="navbar__right">
          <span className="navbar__user" title={user.email}>{user.email}</span>
          <button className="btn btn--ghost" onClick={signOut}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  )
}
