import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './layout.tsx';
import './index.css';
import { AppProvider } from './store/appcontext.tsx';
import { UiProvider } from './store/uicontext.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <UiProvider>
        <Layout />
      </UiProvider>
    </AppProvider>
  </React.StrictMode>
);
