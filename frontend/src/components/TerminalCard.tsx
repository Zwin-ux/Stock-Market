import React from 'react';
import './TerminalCard.css';

type CardProps = {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
};

export default function TerminalCard({ title, children }: CardProps) {
  return (
    <div className="terminal-card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}
