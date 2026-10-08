import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Filter out upstream THREE.Clock deprecation warning from @react-three/fiber
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) {
    return;
  }
  originalWarn(...args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
