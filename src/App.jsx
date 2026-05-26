import { useEffect, useMemo, useState } from 'react';
import Layout from './components/Layout';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import { defaultSiteConfig } from './config/appConfig';
import { getSiteConfig, listProducts } from './services/productService';

export default function App() {
  const [products, setProducts] = useState([]);
  const [siteConfig, setSiteConfig] = useState(defaultSiteConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(sessionStorage.getItem('admin-authenticated') === 'true');
  const path = window.location.pathname;

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [productsData, configData] = await Promise.all([listProducts(), getSiteConfig()]);
      setProducts(productsData);
      setSiteConfig(configData);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const detailProduct = useMemo(() => {
    if (!path.startsWith('/producto/')) return null;
    const id = decodeURIComponent(path.replace('/producto/', ''));
    return products.find((product) => String(product.id) === id);
  }, [path, products]);

  if (path.startsWith('/admin') && !authenticated) {
    return (
      <Layout siteConfig={siteConfig}>
        <AdminLogin onLogin={() => setAuthenticated(true)} />
      </Layout>
    );
  }

  return (
    <Layout siteConfig={siteConfig}>
      {path.startsWith('/admin') ? (
        <Admin products={products} setProducts={setProducts} siteConfig={siteConfig} setSiteConfig={setSiteConfig} reloadProducts={loadData} />
      ) : path.startsWith('/producto/') ? (
        <ProductDetail product={detailProduct} siteConfig={siteConfig} />
      ) : (
        <Home products={products} siteConfig={siteConfig} loading={loading} error={error} />
      )}
    </Layout>
  );
}
