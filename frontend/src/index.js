import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import GodelCLI from './components/CLIInterface.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GodelCLI />
  </React.StrictMode>
);
