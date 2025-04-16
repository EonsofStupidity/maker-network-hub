
import React from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { LogCategory, LogLevel } from '@/shared/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { logger } from '@/logging/logger.service';

interface ProfileDisplayProps {
  onEdit?: () => void;
}

export const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ onEdit }) => {
  const { user } = useAuthStore();
  
  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  // Generate initials from name or email
  const getInitials = (): string => {
    if (user.name) {
      return user.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
    }
    
    return user.email.substring(0, 2).toUpperCase();
  };
  
  // Handle edit button click
  const handleEditClick = () => {
    if (onEdit) {
      logger.log(LogLevel.INFO, LogCategory.UI, 'User clicked edit profile', {
        userId: user.id
      });
      onEdit();
    }
  };

  // Format date string for display
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return 'Not available';
    
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={user.name || 'User'} />
          ) : (
            <AvatarFallback>{getInitials()}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{user.name || 'User'}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <h3 className="font-medium">About</h3>
          <p className="text-sm text-muted-foreground">
            {user.bio || 'No bio provided.'}
          </p>
        </div>
        
        <div className="grid gap-2">
          <h3 className="font-medium">Account Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Member since:</span>
            <span>{formatDate(user.createdAt)}</span>
            
            <span className="text-muted-foreground">Last updated:</span>
            <span>{formatDate(user.updatedAt)}</span>
            
            <span className="text-muted-foreground">Last sign in:</span>
            <span>{formatDate(user.lastSignInAt)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button onClick={handleEditClick}>Edit Profile</Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileDisplay;
