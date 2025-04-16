import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Checkbox } from "@/shared/ui/checkbox";
import { Badge } from "@/shared/ui/badge";
import { Search, UserPlus, Filter, MoreHorizontal, Trash2, UserCog, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/shared/ui/use-toast";
import { UserRole, ROLES } from "@/shared/types/core/rbac.types";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "pending" | "suspended";
  createdAt: string;
  lastLogin: string | null;
}

const mockUsers: UserData[] = [
  {
    id: "1",
    email: "john@example.com", 
    name: "John Doe",
    role: ROLES.ADMIN,
    status: "active",
    createdAt: "2023-04-15T10:30:00Z",
    lastLogin: "2023-05-10T08:45:00Z"
  },
  {
    id: "2", 
    email: "jane@example.com",
    name: "Jane Smith",
    role: ROLES.MAKER,
    status: "active",
    createdAt: "2023-03-22T14:20:00Z",
    lastLogin: "2023-05-09T16:30:00Z"
  },
  {
    id: "3",
    email: "sam@example.com", 
    name: "Sam Wilson",
    role: ROLES.SUPER_ADMIN,
    status: "active",
    createdAt: "2023-02-10T09:15:00Z",
    lastLogin: "2023-05-11T11:20:00Z"
  },
  {
    id: "4",
    email: "alex@example.com",
    name: "Alex Johnson", 
    role: ROLES.MAKER,
    status: "pending",
    createdAt: "2023-05-05T16:45:00Z",
    lastLogin: null
  },
  {
    id: "5",
    email: "taylor@example.com",
    name: "Taylor Brown",
    role: ROLES.MAKER,
    status: "suspended",
    createdAt: "2023-01-18T13:10:00Z",
    lastLogin: "2023-04-28T10:05:00Z"
  }
];

const getRoleBadgeStyle = (role: UserRole) => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
    case ROLES.ADMIN:  
      return "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30";
    default:
      return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30";
  }
};

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-500";
    case "pending":
      return "bg-yellow-500/20 text-yellow-500";
    case "suspended":
      return "bg-red-500/20 text-red-500";
    default:
      return "bg-gray-500/20 text-gray-500";
  }
};

export default function UsersManagement() {
  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: users, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return mockUsers;
    }
  });
  
  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };
  
  const handleSelectAll = () => {
    if (users) {
      if (selectedUsers.length === users.length) {
        setSelectedUsers([]);
      } else {
        setSelectedUsers(users.map(user => user.id));
      }
    }
  };
  
  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateUser = () => {
    toast({
      title: "Coming Soon",
      description: "The user creation feature is not yet implemented."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            View and manage user accounts for your platform.
          </p>
        </div>
        
        <Button onClick={handleCreateUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                {isLoading ? "Loading users..." : `${filteredUsers?.length || 0} users found`}
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="p-0 mt-4">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          <Checkbox 
                            checked={users?.length ? selectedUsers.length === users.length : false}
                            onCheckedChange={handleSelectAll}
                            disabled={isLoading}
                          />
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">User</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Last Login</th>
                        <th className="h-12 px-4 text-left align-middle font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td colSpan={7} className="p-4">
                              <div className="h-8 bg-primary/5 animate-pulse rounded"></div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        filteredUsers?.map(user => (
                          <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4">
                              <Checkbox 
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={() => handleUserSelect(user.id)}
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className={getRoleBadgeStyle(user.role)}>
                                {user.role === ROLES.SUPER_ADMIN && <Shield className="mr-1 h-3 w-3" />}
                                {user.role.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className={getStatusBadgeStyle(user.status)}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-xs text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-xs text-muted-foreground">
                              {user.lastLogin 
                                ? new Date(user.lastLogin).toLocaleDateString()
                                : "-"
                              }
                            </td>
                            <td className="p-4">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <UserCog className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-xs text-muted-foreground">
            {selectedUsers.length > 0 ? (
              <span>{selectedUsers.length} users selected</span>
            ) : (
              <span>No users selected</span>
            )}
          </div>
          
          {selectedUsers.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Not Implemented",
                    description: "This action is not yet implemented",
                    variant: "destructive"
                  });
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
