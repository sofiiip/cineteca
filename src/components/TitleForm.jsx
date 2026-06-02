import { useState } from 'react'

const EMPTY = {
  title: '',
  type: 'pelicula',
  year: '',
  status: 'pendiente',
  rating: 0,
  review: '',
}

/**
 * Formulario reutilizable para crear o editar un título.
 * Si recibe `initial`, funciona en modo edición.
 */
export default function TitleForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const isEdit = Boolean(initial)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('El título es obligatorio.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        year: form.year ? Number(form.year) : null,
        rating: Number(form.rating),
      })
      if (!isEdit) setForm(EMPTY)
    } catch (err) {
      setError(err.message ?? 'No se pudo guardar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="title-form card" onSubmit={handleSubmit}>
      <h3 className="title-form__heading">
        {isEdit ? 'Editar título' : 'Agregar título'}
      </h3>

      <div className="field">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          type="text"
          placeholder="Ej: Dune: Parte Dos"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          autoFocus
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="type">Tipo</label>
          <select
            id="type"
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
          >
            <option value="pelicula">Película</option>
            <option value="serie">Serie</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="year">Año</label>
          <input
            id="year"
            type="number"
            min="1900"
            max="2100"
            placeholder="2024"
            value={form.year ?? ''}
            onChange={(e) => update('year', e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
          >
            <option value="pendiente">Pendiente</option>
            <option value="viendo">Viendo</option>
            <option value="vista">Vista</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>Puntaje</label>
        <div className="star-input" role="radiogroup" aria-label="Puntaje">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              className={'star' + (n <= form.rating ? ' star--on' : '')}
              onClick={() => update('rating', n === form.rating ? 0 : n)}
              aria-label={`${n} estrellas`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="review">Reseña</label>
        <textarea
          id="review"
          rows="3"
          placeholder="¿Qué te pareció?"
          value={form.review ?? ''}
          onChange={(e) => update('review', e.target.value)}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="title-form__actions">
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Agregar'}
        </button>
      </div>
    </form>
  )
}
