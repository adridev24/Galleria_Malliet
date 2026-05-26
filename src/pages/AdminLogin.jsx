import { useState } from 'react';
import { appConfig } from '../config/appConfig';
import ErrorMessage from '../components/ErrorMessage';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!appConfig.adminPassword) {
      setError('Falta configurar VITE_ADMIN_PASSWORD.');
      return;
    }
    if (password === appConfig.adminPassword) {
      sessionStorage.setItem('admin-authenticated', 'true');
      onLogin();
      return;
    }
    setError('Contraseña incorrecta.');
  }

  return (
    <section className="auth-page">
      <form className="panel auth-card" onSubmit={handleSubmit}>
        <h1>Panel de administración</h1>
        <p>Ingresá la contraseña configurada para editar vehiculos y apariencia.</p>
        <label className="field">
          <span>Contraseña</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <ErrorMessage message={error} />
        <button className="button button-primary" type="submit">
          Entrar
        </button>
      </form>
    </section>
  );
}
