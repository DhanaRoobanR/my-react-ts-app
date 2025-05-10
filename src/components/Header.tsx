// src/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static" className="bg-gray-800 text-white shadow-md fixed top-0 left-0 right-0 z-50">
      <Toolbar>
        <Typography variant="h6">My React App</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;