import EmptyState from './EmptyState';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (!products.length) return <EmptyState />;

  return (
    <section className="product-grid" aria-label="Vehiculos">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
