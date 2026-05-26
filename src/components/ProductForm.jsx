import { useEffect, useState } from 'react';
import { uploadImage } from '../services/cloudinaryService';
import { isVisible } from '../utils/formatters';
import { hasErrors, validateProduct } from '../utils/validators';
import ErrorMessage from './ErrorMessage';
import Loader from './Loader';

const emptyProduct = {
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: '',
  imagenUrl: '',
  whatsapp: '',
  instagram: '',
  visible: true,
  orden: '',
};

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyProduct);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    setForm(product ? { ...emptyProduct, ...product, visible: isVisible(product.visible) } : emptyProduct);
    setErrors({});
    setUploadError('');
  }, [product]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadImage(file);
      updateField('imagenUrl', url);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateProduct(form);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;
    onSubmit({ ...form, visible: form.visible ? 'SI' : 'NO' });
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="section-title">
        <h2>{product ? 'Editar vehiculo' : 'Nuevo vehiculo'}</h2>
        {product && (
          <button type="button" className="button button-ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>

      <label className="field">
        <span>Nombre</span>
        <input value={form.nombre} onChange={(event) => updateField('nombre', event.target.value)} />
        {errors.nombre && <small>{errors.nombre}</small>}
      </label>

      <label className="field">
        <span>Categoria</span>
        <input value={form.categoria} onChange={(event) => updateField('categoria', event.target.value)} />
        {errors.categoria && <small>{errors.categoria}</small>}
      </label>

      <label className="field field-wide">
        <span>Descripcion</span>
        <textarea rows="4" value={form.descripcion} onChange={(event) => updateField('descripcion', event.target.value)} />
        {errors.descripcion && <small>{errors.descripcion}</small>}
      </label>

      <label className="field">
        <span>Precio</span>
        <input value={form.precio} onChange={(event) => updateField('precio', event.target.value)} placeholder="Opcional" />
      </label>

      <label className="field">
        <span>Orden</span>
        <input type="number" value={form.orden} onChange={(event) => updateField('orden', event.target.value)} />
      </label>

      <label className="field">
        <span>WhatsApp</span>
        <input value={form.whatsapp} onChange={(event) => updateField('whatsapp', event.target.value)} placeholder="Opcional" />
      </label>

      <label className="field">
        <span>Instagram</span>
        <input value={form.instagram} onChange={(event) => updateField('instagram', event.target.value)} placeholder="Opcional" />
      </label>

      <label className="field field-wide">
        <span>Imagen</span>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input value={form.imagenUrl} onChange={(event) => updateField('imagenUrl', event.target.value)} placeholder="URL de imagen" />
      </label>

      {form.imagenUrl && (
        <div className="image-preview field-wide">
          <img src={form.imagenUrl} alt="Vista previa" />
        </div>
      )}

      {uploading && <Loader text="Subiendo imagen..." />}
      <ErrorMessage message={uploadError} />

      <label className="switch field-wide">
        <input type="checkbox" checked={Boolean(form.visible)} onChange={(event) => updateField('visible', event.target.checked)} />
        <span>Vehiculo visible en la galeria</span>
      </label>

      <div className="form-actions field-wide">
        <button className="button button-primary" type="submit">
          {product ? 'Guardar cambios' : 'Crear vehiculo'}
        </button>
      </div>
    </form>
  );
}
