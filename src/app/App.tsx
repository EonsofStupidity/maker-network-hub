
import React, { Suspense } from 'react';
import { AppInitializer } from './initializer/AppInitializer';
import { ThemeProvider } from '@/shared/ui/theme-provider';
import { ImpulsivityInit } from './theme/ImpulsivityInit';
import { Routes } from '@/router/Routes';
import { BrowserRouter } from 'react-router-dom';

export function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <ImpulsivityInit>
        <AppInitializer>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </AppInitializer>
      </ImpulsivityInit>
    </ThemeProvider>
  );
}

export default App;
