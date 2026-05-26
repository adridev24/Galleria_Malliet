import { useMemo, useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import { isVisible, sortByOrder } from '../utils/formatters';

export default function Home({ products, siteConfig, loading, error }) {
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');

  const visibleProducts = useMemo(() => sortByOrder(products.filter((product) => isVisible(product.visible))), [products]);
  const categories = useMemo(
    () => [...new Set(visibleProducts.map((product) => product.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')),
    [visibleProducts],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return visibleProducts.filter((product) => {
      const matchesCategory = !category || product.categoria === category;
      const text = `${product.nombre} ${product.descripcion}`.toLowerCase();
      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query, visibleProducts]);

  return (
    <>
      <section className="hero">
        {siteConfig.heroImageUrl && <img src={siteConfig.heroImageUrl} alt="" />}
        <div className="hero-content">
          <span className="eyebrow">Vehiculos seleccionados</span>
          <h1>{siteConfig.businessName}</h1>
          <p>{siteConfig.welcomeText}</p>
        </div>
      </section>

      <section className="toolbar">
        <SearchBar value={query} onChange={setQuery} />
        <CategoryFilter categories={categories} value={category} onChange={setCategory} />
      </section>

      {loading && <Loader text="Cargando vehiculos..." />}
      <ErrorMessage message={error} />
      {!loading && !error && (visibleProducts.length ? <ProductGrid products={filteredProducts} /> : <EmptyState title="Inventario en preparacion" text="Pronto vas a ver vehiculos publicados." />)}
    </>
  );
}
