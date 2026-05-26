import { useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import { createProduct, deleteProduct, updateProduct, updateSiteConfig } from '../services/productService';
import { uploadImage } from '../services/cloudinaryService';
import { isVisible, sortByOrder } from '../utils/formatters';

export default function Admin({ products, setProducts, siteConfig, setSiteConfig, reloadProducts }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [configForm, setConfigForm] = useState(siteConfig);
  const [uploadingField, setUploadingField] = useState('');

  async function saveProduct(product) {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const saved = product.id ? await updateProduct(product) : await createProduct(product);
      setProducts((current) => {
        const exists = current.some((item) => item.id === saved.id);
        return sortByOrder(exists ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current]);
      });
      setEditingProduct(null);
      setMessage('Vehiculo guardado correctamente.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(product) {
    await saveProduct({ ...product, visible: isVisible(product.visible) ? 'NO' : 'SI' });
  }

  async function removeProduct(id) {
    const confirmed = window.confirm('¿Eliminar este vehiculo?');
    if (!confirmed) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
      setMessage('Vehiculo eliminado.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  function updateConfigField(field, value) {
    setConfigForm((current) => ({ ...current, [field]: value }));
  }

  async function handleConfigImage(field, file) {
    if (!file) return;
    setUploadingField(field);
    setError('');
    try {
      const url = await uploadImage(file);
      updateConfigField(field, url);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploadingField('');
    }
  }

  async function saveConfig(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const saved = await updateSiteConfig(configForm);
      setSiteConfig(saved);
      setConfigForm(saved);
      setMessage('Configuración actualizada.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">Gestion del sitio</span>
          <h1>Panel de administración</h1>
        </div>
        <button className="button button-secondary" onClick={reloadProducts}>
          Recargar datos
        </button>
      </div>

      {saving && <Loader text="Guardando..." />}
      {uploadingField && <Loader text="Subiendo imagen..." />}
      {message && <div className="alert alert-success">{message}</div>}
      <ErrorMessage message={error} />

      <form className="panel form-grid" onSubmit={saveConfig}>
        <div className="section-title field-wide">
          <h2>Configuración del sitio</h2>
        </div>
        <label className="field">
          <span>Nombre del negocio</span>
          <input value={configForm.businessName || ''} onChange={(event) => updateConfigField('businessName', event.target.value)} />
        </label>
        <label className="field">
          <span>Texto de bienvenida</span>
          <input value={configForm.welcomeText || ''} onChange={(event) => updateConfigField('welcomeText', event.target.value)} />
        </label>
        <label className="field">
          <span>Color principal</span>
          <input type="color" value={configForm.primaryColor || '#0b0b0d'} onChange={(event) => updateConfigField('primaryColor', event.target.value)} />
        </label>
        <label className="field">
          <span>Color secundario</span>
          <input type="color" value={configForm.secondaryColor || '#d7b46a'} onChange={(event) => updateConfigField('secondaryColor', event.target.value)} />
        </label>
        <label className="field">
          <span>WhatsApp por defecto</span>
          <input value={configForm.whatsapp || ''} onChange={(event) => updateConfigField('whatsapp', event.target.value)} />
        </label>
        <label className="field">
          <span>Instagram por defecto</span>
          <input value={configForm.instagram || ''} onChange={(event) => updateConfigField('instagram', event.target.value)} />
        </label>
        <label className="field">
          <span>Logo</span>
          <input type="file" accept="image/*" onChange={(event) => handleConfigImage('logoUrl', event.target.files?.[0])} />
          <input value={configForm.logoUrl || ''} onChange={(event) => updateConfigField('logoUrl', event.target.value)} placeholder="URL del logo" />
        </label>
        <label className="field">
          <span>Imagen hero</span>
          <input type="file" accept="image/*" onChange={(event) => handleConfigImage('heroImageUrl', event.target.files?.[0])} />
          <input value={configForm.heroImageUrl || ''} onChange={(event) => updateConfigField('heroImageUrl', event.target.value)} placeholder="URL de imagen principal" />
        </label>
        <div className="form-actions field-wide">
          <button className="button button-primary" type="submit">
            Guardar configuración
          </button>
        </div>
      </form>

      <div className="admin-grid">
        <ProductForm product={editingProduct} onSubmit={saveProduct} onCancel={() => setEditingProduct(null)} />
        <ProductTable products={sortByOrder(products)} onEdit={setEditingProduct} onToggleVisible={toggleVisible} onDelete={removeProduct} />
      </div>
    </section>
  );
}
