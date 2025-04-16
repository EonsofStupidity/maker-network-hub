
import React from 'react';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { useRbac } from '@/hooks/use-rbac';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

const AdminDashboard: React.FC = () => {
  const { hasRole, isSuperAdmin } = useRbac();
  
  React.useEffect(() => {
    logBridge.info(LogCategory.ADMIN, 'Admin dashboard accessed', {
      details: {
        isSuperAdmin: isSuperAdmin(),
        timestamp: new Date().toISOString()
      }
    });
  }, [isSuperAdmin]);
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your site content, users, and settings.
        </p>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          {isSuperAdmin() && (
            <TabsTrigger value="settings">Settings</TabsTrigger>
          )}
          {isSuperAdmin() && (
            <TabsTrigger value="system">System</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Users" value="1,234" description="Total registered users" />
            <StatsCard title="Content" value="567" description="Published items" />
            <StatsCard title="Builds" value="342" description="Community builds" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest user activities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Activity log will appear here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">System metrics will appear here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management interface will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage site content and layouts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Content management interface will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isSuperAdmin() && (
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Configure application settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings interface will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {isSuperAdmin() && (
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Administration</CardTitle>
                <CardDescription>Advanced system configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">System administration interface will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
