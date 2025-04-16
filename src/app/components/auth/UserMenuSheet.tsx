
import React from "react";
import { UserRole } from "@/shared/types/core/rbac.types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { LogOut, User } from "lucide-react";

interface UserMenuSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userDisplayName: string;
  userEmail: string;
  userAvatar?: string;
  onShowProfile: () => void;
  onLogout: () => void;
  roles: UserRole[];
}

export const UserMenuSheet: React.FC<UserMenuSheetProps> = ({
  isOpen,
  onOpenChange,
  userDisplayName,
  userEmail,
  userAvatar,
  onShowProfile,
  onLogout,
  roles,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
        </SheetHeader>
        
        <div className="py-4 flex flex-col items-center text-center">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2 bg-primary flex items-center justify-center text-white text-xl">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userDisplayName}
                className="w-full h-full object-cover"
              />
            ) : (
              userDisplayName.charAt(0).toUpperCase()
            )}
          </div>
          
          <h3 className="font-medium text-lg">{userDisplayName}</h3>
          <p className="text-muted-foreground text-sm">{userEmail}</p>
          
          {roles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              {roles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-3 mt-4">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={onShowProfile}
          >
            <User className="mr-2 h-4 w-4" />
            Your Profile
          </Button>
        </div>
        
        <SheetFooter className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="outline" 
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
