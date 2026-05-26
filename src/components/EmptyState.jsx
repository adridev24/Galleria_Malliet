export default function EmptyState({ title = 'No hay resultados', text = 'Probá ajustar los filtros.' }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
