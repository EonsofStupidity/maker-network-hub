
import React from 'react';

export function BasicPage() {
  return (
    <div className="container mx-auto p-4 mt-16">
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">MakersIMPULSE</h1>
        <p className="text-lg mb-4">
          Welcome to the platform. The app is currently loading resources.
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
}

export default BasicPage;
