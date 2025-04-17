
import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-primary hover:underline">Return Home</Link>
    </div>
  );
}

export default NotFound;
