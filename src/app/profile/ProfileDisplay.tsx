
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { useAuthStore } from '@/auth/store/auth.store';
import { useRbac } from '@/hooks/use-rbac';
import { ROLE_LABELS } from '@/shared/types/core/rbac.types';

interface ProfileDisplayProps {
  className?: string;
}

export const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ className = '' }) => {
  const user = useAuthStore(state => state.user);
  const { getHighestRole } = useRbac();
  
  if (!user) {
    return (
      <Card className={`${className} w-full max-w-md mx-auto`}>
        <CardHeader>
          <CardTitle>Not Logged In</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to view your profile</p>
        </CardContent>
      </Card>
    );
  }
  
  const highestRole = getHighestRole();
  const roleLabel = ROLE_LABELS[highestRole];
  
  return (
    <Card className={`${className} w-full max-w-md mx-auto`}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={user.avatarUrl || ''} alt={user.name || 'User'} />
          <AvatarFallback>{(user.name || 'U').slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.name || 'User'}</CardTitle>
          <p className="text-sm text-gray-500">{user.email || 'No email provided'}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Role</h3>
            <Badge variant="outline" className="text-sm">{roleLabel}</Badge>
          </div>
          
          {user.lastSignIn && (
            <div>
              <h3 className="font-medium mb-1">Last Login</h3>
              <p className="text-sm text-gray-500">
                {new Date(user.lastSignIn).toLocaleString()}
              </p>
            </div>
          )}
          
          {user.createdAt && (
            <div>
              <h3 className="font-medium mb-1">Member Since</h3>
              <p className="text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
