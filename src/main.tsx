import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './layout.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);
