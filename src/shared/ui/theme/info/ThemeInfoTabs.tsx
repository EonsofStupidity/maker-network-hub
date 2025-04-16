
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Theme } from '@/shared/types/theme.types';
import { BaseThemeEffect } from '@/shared/types/theme/effects.types';
import { ThemeColorSystem } from '../ThemeColorSystem';
import EffectsPreview from '../EffectsPreview';

interface ThemeInfoTabsProps {
  theme?: Theme;
  effects?: BaseThemeEffect[];
  className?: string;
}

export const ThemeInfoTabs: React.FC<ThemeInfoTabsProps> = ({ theme, effects, className }) => {
  return (
    <Tabs defaultValue="colors" className={`w-full ${className || ''}`}>
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="colors">Colors</TabsTrigger>
        <TabsTrigger value="effects">Effects</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
      </TabsList>
      
      <TabsContent value="colors" className="mt-4">
        <ThemeColorSystem>
          {/* Theme color content */}
        </ThemeColorSystem>
      </TabsContent>
      
      <TabsContent value="effects" className="mt-4">
        {effects && effects.length > 0 ? (
          <div className="space-y-4">
            {effects.filter(e => e.enabled).map((effect, index) => (
              <EffectsPreview key={`${effect.type}-${index}`} effect={effect} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No effects applied to this theme.</p>
        )}
      </TabsContent>
      
      <TabsContent value="tokens" className="mt-4">
        <h3 className="text-lg font-medium mb-2">Design Tokens</h3>
        <div className="border rounded-md p-3 bg-muted/20">
          <code className="text-xs">
            <pre>{theme ? JSON.stringify(theme.designTokens, null, 2) : 'No tokens available'}</pre>
          </code>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ThemeInfoTabs;
