import { formatKm, formatPrice, getVehicleTitle, placeholderImage } from '../utils/formatters';
import { appPath } from '../config/appConfig';

export default function ProductCard({ product }) {
  const title = getVehicleTitle(product);
  const detailUrl = appPath(`/producto/${encodeURIComponent(product.id)}`);
  const specs = [product.anio, formatKm(product.km), product.combustible, product.transmision].filter(Boolean);

  return (
    <article className="product-card">
      <a href={detailUrl} className="product-media">
        <img
          src={product.imagenUrl || placeholderImage}
          alt={title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = placeholderImage;
          }}
        />
      </a>
      <div className="product-card-body">
        <span className="pill">{product.categoria}</span>
        <h3>{title}</h3>
        {specs.length > 0 && (
          <div className="spec-row">
            {specs.map((spec) => (
              <span key={spec}>{spec}</span>
            ))}
          </div>
        )}
        <p>{product.descripcion}</p>
        <div className="product-card-footer">
          <strong>{formatPrice(product)}</strong>
          <a className="button button-secondary" href={detailUrl}>
            Ver detalle
          </a>
        </div>
      </div>
    </article>
  );
}