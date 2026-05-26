export default function Loader({ text = 'Cargando...' }) {
  return (
    <div className="state state-inline" role="status">
      <span className="spinner" />
      <span>{text}</span>
    </div>
  );
}
