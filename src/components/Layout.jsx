import { assetPath, appPath, navigateTo } from '../config/appConfig';
import { safeUrl } from '../utils/formatters';

export default function Layout({ siteConfig, children }) {
  const businessName = siteConfig.businessName || 'MALLIET Automotores';
  const logoUrl = assetPath(siteConfig.logoUrl);

  function handleInternalNavigation(event, path) {
    event.preventDefault();
    navigateTo(path);
  }

  return (
    <div
      className="app-shell"
      style={{
        '--color-primary': siteConfig.primaryColor || '#0b0b0d',
        '--color-secondary': siteConfig.secondaryColor || '#d7b46a',
      }}
    >
      <header className="site-header">
        <a href={appPath('/')} className="brand" onClick={(event) => handleInternalNavigation(event, '/')}>
          {logoUrl ? <img src={logoUrl} alt={businessName} /> : <span className="brand-mark">{businessName.slice(0, 1)}</span>}
          <strong>{businessName}</strong>
        </a>
        <nav>
          {siteConfig.instagram && (
            <a href={safeUrl(siteConfig.instagram)} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
          <a href={appPath('/admin')} onClick={(event) => handleInternalNavigation(event, '/admin')}>Admin</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <span>{businessName}</span>
        <span>Desarrollado por <a className="footer-link" href="mailto:puntocolonadmin@gmail.com">PuntoColon</a></span>
      </footer>
    </div>
  );
}