import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const el = document.getElementById('root');

if (!el) {
  document.body.innerHTML = '<pre style="padding:1rem;font-family:monospace;color:#333">Error: Missing <div id="root"></div> in index.html</pre>';
} else {
  createRoot(el).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
