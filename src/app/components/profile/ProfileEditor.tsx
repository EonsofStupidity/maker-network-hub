import React, { useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { LogCategory, LogLevel } from '@/shared/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { logger } from '@/logging/logger.service';

interface ProfileEditorProps {
  onCancel?: () => void;
  onSave?: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ 
  onCancel, 
  onSave 
}) => {
  const { user, updateProfile } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      await updateProfile({
        displayName: formData.displayName,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl
      });
      
      logger.log(LogLevel.INFO, LogCategory.UI, 'Profile updated');
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.UI, 'Profile update failed', {
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to edit your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Name</Label>
            <Input 
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="Your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input 
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Your bio"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input 
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
