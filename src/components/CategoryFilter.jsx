export default function CategoryFilter({ categories, value, onChange }) {
  return (
    <label className="field">
      <span>Categoria</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Todas</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  );
}
