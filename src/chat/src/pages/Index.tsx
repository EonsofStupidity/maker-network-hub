
import React from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Chat Module</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Choose a chat mode to continue:
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            onClick={() => navigate('/chat')} 
            className="w-full"
            variant="default"
          >
            Standard Chat
          </Button>
          <Button 
            onClick={() => navigate('/chat/dev')}
            className="w-full" 
            variant="outline"
          >
            Developer Chat
          </Button>
          <Button 
            onClick={() => navigate('/chat/debug')}
            className="w-full" 
            variant="outline"
          >
            Debug Chat
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
