import React from 'react';
import ClientManager from './containers/ClientManager';

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <ClientManager />
    </div>
  );
};

export default App;