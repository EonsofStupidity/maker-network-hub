
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">MakersIMPULSE</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/app" className="hover:underline">App</a></li>
            <li><a href="/admin" className="hover:underline">Admin</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
