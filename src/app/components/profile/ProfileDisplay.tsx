import React from 'react';
import { UserProfile } from '@/shared/types/shared.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Edit, Mail, User } from 'lucide-react';

interface ProfileDisplayProps {
  profile: UserProfile;
  onEditClick?: () => void;
  canEdit?: boolean;
}

export function ProfileDisplay({ profile, onEditClick, canEdit = true }: ProfileDisplayProps) {
  const {
    name = '',
    email = '',
    avatarUrl,
    bio = '',
    createdAt,
    lastSignIn,
  } = profile;

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Profile</CardTitle>
        {canEdit && (
          <Button variant="outline" size="sm" onClick={onEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Avatar className="h-24 w-24">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name || 'User'} />
            ) : (
              <AvatarFallback className="text-xl">{getInitials(name || '')}</AvatarFallback>
            )}
          </Avatar>
          
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold">{name || 'No name provided'}</h2>
            <div className="flex items-center justify-center md:justify-start gap-1">
              <Mail className="h-4 w-4 opacity-70" />
              <span>{email}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Bio</h3>
            <p className="text-muted-foreground">
              {bio || 'No bio provided.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Member since</h4>
              <p>{formatDate(createdAt)}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Last login</h4>
              <p>{formatDate(lastSignIn)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
