import { formatCurrency, placeholderImage } from '../utils/formatters';

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <a href={`/producto/${encodeURIComponent(product.id)}`} className="product-media">
        <img
          src={product.imagenUrl || placeholderImage}
          alt={product.nombre}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = placeholderImage;
          }}
        />
      </a>
      <div className="product-card-body">
        <span className="pill">{product.categoria}</span>
        <h3>{product.nombre}</h3>
        <p>{product.descripcion}</p>
        <div className="product-card-footer">
          <strong>{formatCurrency(product.precio)}</strong>
          <a className="button button-secondary" href={`/producto/${encodeURIComponent(product.id)}`}>
            Ver detalle
          </a>
        </div>
      </div>
    </article>
  );
}
