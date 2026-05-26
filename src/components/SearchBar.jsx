export default function SearchBar({ value, onChange }) {
  return (
    <label className="field search-field">
      <span>Buscar</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nombre o descripcion"
      />
    </label>
  );
}
