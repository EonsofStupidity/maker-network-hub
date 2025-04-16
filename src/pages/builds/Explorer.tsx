
import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';

const BuildsExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  
  React.useEffect(() => {
    logBridge.info(LogCategory.UI, 'Builds explorer viewed', {
      details: {
        initialFilters: { category: filterCategory, sort: sortBy },
        timestamp: new Date().toISOString()
      }
    });
  }, [filterCategory, sortBy]);
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Builds</h1>
        <p className="text-muted-foreground">
          Discover amazing 3D printer builds and modifications from the community
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search builds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="voron">Voron</SelectItem>
              <SelectItem value="prusa">Prusa</SelectItem>
              <SelectItem value="ender">Ender</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="complexity">Complexity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sample build cards - in a real app these would be from API */}
        <BuildCard 
          title="Voron 2.4 Build"
          description="CoreXY precision printer with full enclosure"
          image="/images/placeholder-1.jpg"
          author="John Maker"
          complexity={4}
          category="voron"
        />
        
        <BuildCard 
          title="Ender 3 Modifications"
          description="Upgraded firmware and custom parts for improved performance"
          image="/images/placeholder-2.jpg"
          author="Jane Builder"
          complexity={2}
          category="ender"
        />
        
        <BuildCard 
          title="Custom Resin Printer"
          description="DIY SLA printer with 4K resolution"
          image="/images/placeholder-3.jpg"
          author="Alex Designer"
          complexity={5}
          category="custom"
        />
        
        <BuildCard 
          title="Prusa i3 MK3S+"
          description="Fully upgraded with custom parts and auto-bed leveling"
          image="/images/placeholder-3.jpg"
          author="Sam Innovator"
          complexity={3}
          category="prusa"
        />
        
        <BuildCard 
          title="Compact CoreXY Build"
          description="Small footprint, high precision CoreXY design"
          image="/images/placeholder-1.jpg"
          author="Chris Engineer"
          complexity={4}
          category="custom"
        />
        
        <BuildCard 
          title="Ender 5 Pro Enclosure"
          description="Custom-built enclosure with temperature control"
          image="/images/placeholder-2.jpg"
          author="Pat Maker"
          complexity={3}
          category="ender"
        />
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
};

interface BuildCardProps {
  title: string;
  description: string;
  image: string;
  author: string;
  complexity: number;
  category: string;
}

const BuildCard: React.FC<BuildCardProps> = ({ 
  title, 
  description, 
  image, 
  author, 
  complexity, 
  category 
}) => {
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url(${image})` }}
      />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <div className="flex justify-between text-xs">
          <span>By {author}</span>
          <div className="flex items-center">
            <span className="mr-1">Complexity:</span>
            <ComplexityRating value={complexity} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">Details</Button>
        <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
          {category}
        </span>
      </CardFooter>
    </Card>
  );
};

const ComplexityRating: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className={`w-2 h-2 rounded-full mx-0.5 ${
            i < value ? 'bg-primary' : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );
};

export default BuildsExplorer;
