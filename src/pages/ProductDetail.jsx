import EmptyState from '../components/EmptyState';
import { buildWhatsappUrl, formatCurrency, placeholderImage, safeUrl } from '../utils/formatters';

export default function ProductDetail({ product, siteConfig }) {
  if (!product) {
    return <EmptyState title="Vehiculo no encontrado" text="Puede que haya sido eliminado o que el enlace no exista." />;
  }

  const whatsapp = product.whatsapp || siteConfig.whatsapp;
  const instagram = product.instagram || siteConfig.instagram;
  const whatsappUrl = buildWhatsappUrl(whatsapp, product.nombre);

  return (
    <section className="detail-page">
      <div className="detail-media">
        <img
          src={product.imagenUrl || placeholderImage}
          alt={product.nombre}
          onError={(event) => {
            event.currentTarget.src = placeholderImage;
          }}
        />
      </div>
      <article className="detail-content">
        <span className="pill">{product.categoria}</span>
        <h1>{product.nombre}</h1>
        {product.precio && <strong className="price">{formatCurrency(product.precio)}</strong>}
        <p>{product.descripcion}</p>
        <div className="detail-actions">
          {whatsappUrl && (
            <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              Consultar por WhatsApp
            </a>
          )}
          {instagram && (
            <a className="button button-secondary" href={safeUrl(instagram)} target="_blank" rel="noreferrer">
              Ver en Instagram
            </a>
          )}
        </div>
      </article>
    </section>
  );
}
