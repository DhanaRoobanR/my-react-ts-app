// src/App.tsx
import React, { useState } from 'react';
import { Button } from '@mui/material';
import Header from './components/Header';

function App() {
  const [count, setCount] = useState(0);

  return (
                         <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Hello React + TypeScript!</h1>
          <p className="text-xl mb-4">Count: {count}</p>
          <Button
            variant="contained"
            onClick={() => setCount(count + 1)}
            className="!bg-blue-500 hover:!bg-blue-600 !text-white font-bold py-2 px-4 rounded"
          >
            Click Me
          </Button>
        </div>
      </main>
    </div>
  );
}

export default App;
