import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// The static <title>/description/canonical/OG tags in index.html exist so
// non-JS crawlers and link-preview bots (WhatsApp, Facebook) always see
// something. Once React mounts, react-helmet-async takes over per-route —
// strip the static ones first so it doesn't just append duplicates next to
// them (react-helmet-async only manages tags it rendered itself, it won't
// clean up markup that was already in the static HTML).
document.querySelector('title')?.remove();
document.querySelector('meta[name="description"]')?.remove();
document.querySelector('link[rel="canonical"]')?.remove();
document.querySelectorAll('meta[property^="og:"]').forEach((el) => el.remove());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
