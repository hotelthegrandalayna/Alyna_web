import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// The static <title>/description/canonical in index.html exist so non-JS
// crawlers and link-preview bots (WhatsApp, Facebook) always see something.
// Once React mounts, react-helmet-async takes over per-route — strip the
// static ones first so it doesn't just append duplicates next to them.
document.querySelector('title')?.remove();
document.querySelector('meta[name="description"]')?.remove();
document.querySelector('link[rel="canonical"]')?.remove();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
