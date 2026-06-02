import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import TitleForm from '../components/TitleForm'
import TitleCard from '../components/TitleCard'

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'viendo', label: 'Viendo' },
  { key: 'vista', label: 'Vistas' },
]

export default function Watchlist() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null) // item en edición o null
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('todos')

  // --- Leer (READ) ---
  async function fetchTitles() {
    setLoading(true)
    const { data, error } = await supabase
      .from('titles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTitles()
  }, [])

  // --- Crear (CREATE) ---
  async function handleCreate(payload) {
    const { data, error } = await supabase
      .from('titles')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single()
    if (error) throw error
    setItems((prev) => [data, ...prev])
    setShowForm(false)
  }

  // --- Editar (UPDATE) ---
  async function handleUpdate(payload) {
    const { data, error } = await supabase
      .from('titles')
      .update(payload)
      .eq('id', editing.id)
      .select()
      .single()
    if (error) throw error
    setItems((prev) => prev.map((it) => (it.id === data.id ? data : it)))
    setEditing(null)
  }

  // --- Eliminar (DELETE) ---
  async function handleDelete(item) {
    if (!confirm(`¿Eliminar "${item.title}"?`)) return
    const { error } = await supabase.from('titles').delete().eq('id', item.id)
    if (error) {
      setError(error.message)
      return
    }
    setItems((prev) => prev.filter((it) => it.id !== item.id))
  }

  const filtered = useMemo(() => {
    if (filter === 'todos') return items
    return items.filter((it) => it.status === filter)
  }, [items, filter])

  const stats = useMemo(
    () => ({
      total: items.length,
      vistas: items.filter((it) => it.status === 'vista').length,
      pendientes: items.filter((it) => it.status === 'pendiente').length,
    }),
    [items]
  )

  return (
    <>
      <Navbar />
      <main className="container">
        <section className="dashboard-head">
          <div>
            <h1 className="dashboard-title">Mi Watchlist</h1>
            <p className="dashboard-stats">
              {stats.total} títulos · {stats.vistas} vistas · {stats.pendientes} pendientes
            </p>
          </div>
          {!showForm && !editing && (
            <button className="btn btn--primary" onClick={() => setShowForm(true)}>
              + Agregar título
            </button>
          )}
        </section>

        {showForm && (
          <TitleForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        )}
        {editing && (
          <TitleForm
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}

        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={'chip' + (filter === f.key ? ' chip--active' : '')}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p className="empty-state">Cargando tu watchlist…</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__emoji">🍿</p>
            <p>
              {items.length === 0
                ? 'Todavía no agregaste ningún título. ¡Empezá con el primero!'
                : 'No hay títulos con este filtro.'}
            </p>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((item) => (
              <TitleCard
                key={item.id}
                item={item}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
