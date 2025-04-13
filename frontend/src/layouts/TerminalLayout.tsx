import React from 'react';
import { Outlet } from 'react-router-dom';

export default function TerminalLayout() {
  return (
    <div className="terminal-grid">
      <header className="top-bar">
        {/* Branding + Plugin Status */}
      </header>
      
      <aside className="sidebar">
        {/* Collapsible Plugin Browser */}
      </aside>
      
      <main className="main-panel">
        <Outlet /> {/* Command Output Area */}
      </main>
      
      <div className="input-bar">
        {/* Enhanced CLI Input */}
      </div>
    </div>
  );
}
