
import React from 'react';
import { Dialog } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { useThemeStore } from '@/shared/store/theme/store';
import { Theme } from '@/shared/types/core/theme.types';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

interface ThemeInfoPopupProps {
  open: boolean;
  onClose: () => void;
  activeTheme?: Theme;
}

export function ThemeInfoPopup({ open, onClose, activeTheme }: ThemeInfoPopupProps) {
  const theme = useThemeStore(state => state.theme) || activeTheme;
  
  if (!theme) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{theme.name} Theme</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-2 mt-4">
              <p><strong>ID:</strong> {theme.id}</p>
              <p><strong>Mode:</strong> {theme.isDark ? 'Dark' : 'Light'}</p>
              <p><strong>Description:</strong> {theme.description || 'No description'}</p>
            </TabsContent>
            <TabsContent value="tokens" className="space-y-2 mt-4">
              {theme.designTokens && (
                <div>
                  <h4 className="font-medium mb-2">Design Tokens</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(theme.designTokens.colors || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <div 
                          className="h-4 w-4 rounded-full" 
                          style={{ backgroundColor: value as string }} 
                        />
                        <span className="text-sm">{key}: {value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="components" className="space-y-2 mt-4">
              {theme.componentTokens && (
                <div>
                  <h4 className="font-medium mb-2">Component Tokens</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(theme.componentTokens).map(([key, values]) => (
                      <div key={key} className="border p-2 rounded">
                        <h5 className="font-medium">{key}</h5>
                        <div className="text-sm">
                          {Object.entries(values as Record<string, string>).map(([prop, val]) => (
                            <div key={prop}>{prop}: {val}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
