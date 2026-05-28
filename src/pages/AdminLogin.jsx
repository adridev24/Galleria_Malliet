import { useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import { loginAdmin } from '../services/productService';

export default function AdminLogin({ onLogin }) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await loginAdmin(user, password);
      if (success) {
        sessionStorage.setItem('adminLogged', 'true');
        onLogin();
        return;
      }
      setError('Usuario o contraseña incorrectos');
    } catch {
      setError('No se pudo validar el acceso. Revisá la configuración de Google Apps Script.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="panel auth-card" onSubmit={handleSubmit}>
        <h1>Panel de administración</h1>
        <p>Ingresá tus credenciales para editar vehículos y apariencia.</p>
        <label className="field">
          <span>Usuario</span>
          <input value={user} onChange={(event) => setUser(event.target.value)} autoComplete="username" />
        </label>
        <label className="field">
          <span>Contraseña</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
        </label>
        <ErrorMessage message={error} />
        {loading && <Loader text="Validando acceso..." />}
        <button className="button button-primary" type="submit" disabled={loading}>
          Entrar
        </button>
      </form>
    </section>
  );
}