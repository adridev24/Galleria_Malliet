import { formatKm, formatPrice, getVehicleTitle, isVisible } from '../utils/formatters';
import EmptyState from './EmptyState';

export default function ProductTable({ products, onEdit, onToggleVisible, onDelete }) {
  if (!products.length) {
    return <EmptyState title="Todavia no hay vehiculos" text="Carga el primero desde el formulario." />;
  }

  return (
    <div className="panel table-panel">
      <div className="section-title">
        <h2>Vehiculos</h2>
        <span>{products.length} items</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Vehiculo</th>
              <th>Año</th>
              <th>Km</th>
              <th>Precio</th>
              <th>Visible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{getVehicleTitle(product)}</td>
                <td>{product.anio}</td>
                <td>{formatKm(product.km)}</td>
                <td>{formatPrice(product)}</td>
                <td>{isVisible(product.visible) ? 'SI' : 'NO'}</td>
                <td className="row-actions">
                  <button className="button button-ghost button-small" onClick={() => onEdit(product)}>
                    Editar
                  </button>
                  <button className="button button-secondary button-small" onClick={() => onToggleVisible(product)}>
                    {isVisible(product.visible) ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <button className="button button-danger button-small" onClick={() => onDelete(product.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}