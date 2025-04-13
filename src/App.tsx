import * as React from 'react';
import CommandBuilder from './components/CommandBuilder';

const App: React.FC = () => {
  const handleExecute = (cmd: string) => {
    console.log('Executing:', cmd);
  };

  return (
    <div className="app">
      <h1>Gödel Terminal</h1>
      <CommandBuilder onExecute={handleExecute} />
    </div>
  );
};

export default App;
