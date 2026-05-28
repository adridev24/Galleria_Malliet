import { useEffect, useState } from 'react';
import { uploadImage } from '../services/cloudinaryService';
import { getVehicleTitle, isVisible } from '../utils/formatters';
import { hasErrors, validateProduct } from '../utils/validators';
import ErrorMessage from './ErrorMessage';
import Loader from './Loader';

const emptyProduct = {
  nombre: '',
  marca: '',
  modelo: '',
  anio: '',
  km: '',
  categoria: '',
  precio: '',
  moneda: 'USD',
  combustible: '',
  transmision: '',
  motor: '',
  color: '',
  puertas: '',
  ubicacion: '',
  descripcion: '',
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
    const nombre = form.nombre?.trim() || getVehicleTitle(form);
    onSubmit({ ...form, nombre, visible: form.visible ? 'SI' : 'NO' });
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="section-title field-wide">
        <h2>{product ? 'Editar vehiculo' : 'Nuevo vehiculo'}</h2>
        {product && (
          <button type="button" className="button button-ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>

      <label className="field">
        <span>Marca</span>
        <input value={form.marca} onChange={(event) => updateField('marca', event.target.value)} placeholder="Toyota" />
        {errors.marca && <small>{errors.marca}</small>}
      </label>

      <label className="field">
        <span>Modelo</span>
        <input value={form.modelo} onChange={(event) => updateField('modelo', event.target.value)} placeholder="Corolla XEI 2.0 CVT" />
        {errors.modelo && <small>{errors.modelo}</small>}
      </label>

      <label className="field">
        <span>Año</span>
        <input type="number" value={form.anio} onChange={(event) => updateField('anio', event.target.value)} placeholder="2021" />
        {errors.anio && <small>{errors.anio}</small>}
      </label>

      <label className="field">
        <span>Kilometraje</span>
        <input type="number" value={form.km} onChange={(event) => updateField('km', event.target.value)} placeholder="48000" />
      </label>

      <label className="field">
        <span>Categoria</span>
        <input value={form.categoria} onChange={(event) => updateField('categoria', event.target.value)} placeholder="Sedan, SUV, Pick-up" />
        {errors.categoria && <small>{errors.categoria}</small>}
      </label>

      <label className="field">
        <span>Precio</span>
        <input type="number" value={form.precio} onChange={(event) => updateField('precio', event.target.value)} placeholder="18500000" />
      </label>

      <label className="field">
        <span>Moneda</span>
        <select value={form.moneda} onChange={(event) => updateField('moneda', event.target.value)}>
          <option value="USD">Dolares</option>
          <option value="ARS">Pesos</option>
        </select>
      </label>

      <label className="field">
        <span>Combustible</span>
        <input value={form.combustible} onChange={(event) => updateField('combustible', event.target.value)} placeholder="Nafta, Diesel, Hibrido" />
      </label>

      <label className="field">
        <span>Transmision</span>
        <input value={form.transmision} onChange={(event) => updateField('transmision', event.target.value)} placeholder="Automatica, Manual" />
      </label>

      <label className="field">
        <span>Motor</span>
        <input value={form.motor} onChange={(event) => updateField('motor', event.target.value)} placeholder="2.0" />
      </label>

      <label className="field">
        <span>Color</span>
        <input value={form.color} onChange={(event) => updateField('color', event.target.value)} placeholder="Gris plata" />
      </label>

      <label className="field">
        <span>Puertas</span>
        <input type="number" value={form.puertas} onChange={(event) => updateField('puertas', event.target.value)} placeholder="4" />
      </label>

      <label className="field">
        <span>Ubicacion</span>
        <input value={form.ubicacion} onChange={(event) => updateField('ubicacion', event.target.value)} placeholder="Concepcion del Uruguay" />
      </label>

      <label className="field field-wide">
        <span>Titulo visible</span>
        <input value={form.nombre} onChange={(event) => updateField('nombre', event.target.value)} placeholder="Opcional, se arma con marca + modelo + año" />
      </label>

      <label className="field field-wide">
        <span>Descripcion</span>
        <textarea rows="4" value={form.descripcion} onChange={(event) => updateField('descripcion', event.target.value)} />
        {errors.descripcion && <small>{errors.descripcion}</small>}
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