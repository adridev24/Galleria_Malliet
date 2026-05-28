export function validateProduct(product) {
  const errors = {};
  if (!product.marca?.trim()) errors.marca = 'La marca es obligatoria.';
  if (!product.modelo?.trim()) errors.modelo = 'El modelo es obligatorio.';
  if (!product.anio?.trim()) errors.anio = 'El año es obligatorio.';
  if (!product.descripcion?.trim()) errors.descripcion = 'La descripcion es obligatoria.';
  if (!product.categoria?.trim()) errors.categoria = 'La categoria es obligatoria.';
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}