
import React from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { LoginSheet } from '@/app/components/auth/LoginSheet';
import { useAuth } from '@/auth/hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to MakersIMPULSE</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Your hub for maker projects and 3D printing
        </p>
        {!isAuthenticated && <LoginSheet />}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Explore Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Discover amazing 3D printing projects from our community.</p>
            <Button variant="outline" asChild>
              <a href="/projects">Browse Projects</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parts Database</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Find compatible parts and upgrades for your printer.</p>
            <Button variant="outline" asChild>
              <a href="/parts">View Parts</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Join discussions and share your experiences.</p>
            <Button variant="outline" asChild>
              <a href="/community">Join Community</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
