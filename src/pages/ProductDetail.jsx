import EmptyState from '../components/EmptyState';
import { buildWhatsappUrl, formatPrice, getVehicleSpecs, getVehicleTitle, placeholderImage, safeUrl } from '../utils/formatters';

export default function ProductDetail({ product, siteConfig }) {
  if (!product) {
    return <EmptyState title="Vehiculo no encontrado" text="Puede que haya sido eliminado o que el enlace no exista." />;
  }

  const title = getVehicleTitle(product);
  const whatsapp = product.whatsapp || siteConfig.whatsapp;
  const instagram = product.instagram || siteConfig.instagram;
  const whatsappUrl = buildWhatsappUrl(whatsapp, title);
  const specs = getVehicleSpecs(product);

  return (
    <section className="detail-page">
      <div className="detail-media">
        <img
          src={product.imagenUrl || placeholderImage}
          alt={title}
          onError={(event) => {
            event.currentTarget.src = placeholderImage;
          }}
        />
      </div>
      <article className="detail-content">
        <span className="pill">{product.categoria}</span>
        <h1>{title}</h1>
        {product.precio && <strong className="price">{formatPrice(product)}</strong>}
        {specs.length > 0 && (
          <dl className="vehicle-specs">
            {specs.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
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