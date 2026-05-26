import { safeUrl } from '../utils/formatters';

export default function Layout({ siteConfig, children }) {
  const businessName = siteConfig.businessName || 'MALLIET Automotores';

  return (
    <div
      className="app-shell"
      style={{
        '--color-primary': siteConfig.primaryColor || '#0b0b0d',
        '--color-secondary': siteConfig.secondaryColor || '#d7b46a',
      }}
    >
      <header className="site-header">
        <a href="/" className="brand">
          {siteConfig.logoUrl ? <img src={siteConfig.logoUrl} alt={businessName} /> : <span className="brand-mark">{businessName.slice(0, 1)}</span>}
          <strong>{businessName}</strong>
        </a>
        <nav>
          {siteConfig.instagram && (
            <a href={safeUrl(siteConfig.instagram)} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
          <a href="/admin">Admin</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <span>{businessName}</span>
        <span>Vehiculos seleccionados, consultas directas y gestion simple.</span>
      </footer>
    </div>
  );
}
