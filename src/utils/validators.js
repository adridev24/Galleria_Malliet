export function validateProduct(product) {
  const errors = {};
  if (!product.nombre?.trim()) errors.nombre = 'El nombre es obligatorio.';
  if (!product.descripcion?.trim()) errors.descripcion = 'La descripcion es obligatoria.';
  if (!product.categoria?.trim()) errors.categoria = 'La categoria es obligatoria.';
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
