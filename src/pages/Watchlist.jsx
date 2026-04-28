import { useAuth } from '../context/AuthContext'

export default function Watchlist() {
  const { user, signOut } = useAuth()
  return (
    <main className="scaffold">
      <h1>🎬 Mi Watchlist</h1>
      <p>Hola, {user?.email}</p>
      <p>Muy pronto vas a poder cargar tus películas y series acá.</p>
      <button onClick={signOut}>Cerrar sesión</button>
    </main>
  )
}
