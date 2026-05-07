const STATUS_LABEL = {
  pendiente: 'Pendiente',
  viendo: 'Viendo',
  vista: 'Vista',
}

const TYPE_LABEL = {
  pelicula: 'Película',
  serie: 'Serie',
}

export default function TitleCard({ item, onEdit, onDelete }) {
  return (
    <article className={`title-card card status-${item.status}`}>
      <div className="title-card__head">
        <span className={`badge badge--${item.status}`}>
          {STATUS_LABEL[item.status]}
        </span>
        <span className="title-card__type">{TYPE_LABEL[item.type]}</span>
      </div>

      <h3 className="title-card__title">
        {item.title}
        {item.year ? <span className="title-card__year"> ({item.year})</span> : null}
      </h3>

      {item.rating > 0 && (
        <div className="title-card__stars" aria-label={`${item.rating} de 5`}>
          {'★'.repeat(item.rating)}
          <span className="title-card__stars-off">{'★'.repeat(5 - item.rating)}</span>
        </div>
      )}

      {item.review && <p className="title-card__review">{item.review}</p>}

      <div className="title-card__actions">
        <button className="btn btn--ghost btn--sm" onClick={() => onEdit(item)}>
          Editar
        </button>
        <button
          className="btn btn--danger btn--sm"
          onClick={() => onDelete(item)}
        >
          Eliminar
        </button>
      </div>
    </article>
  )
}
