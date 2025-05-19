import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../../components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { User, Role, Permission } from '../../types';
import api from '../../services/api';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'agent' as Role,
    password: '',
    confirmPassword: '',
    active: true
  });
  
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        tenantId: 'tenant1',
        role: 'admin',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'manager@example.com',
        firstName: 'Manager',
        lastName: 'User',
        tenantId: 'tenant1',
        role: 'manager',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        email: 'agent@example.com',
        firstName: 'Agent',
        lastName: 'User',
        tenantId: 'tenant1',
        role: 'agent',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        email: 'supervisor@example.com',
        firstName: 'Supervisor',
        lastName: 'User',
        tenantId: 'tenant1',
        role: 'supervisor',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        email: 'readonly@example.com',
        firstName: 'ReadOnly',
        lastName: 'User',
        tenantId: 'tenant1',
        role: 'readonly',
        active: false,
        createdAt: new Date().toISOString()
      }
    ];
    
    setUsers(mockUsers);
    setLoading(false);
    
    // 
  }, []);
  
  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'agent',
      password: '',
      confirmPassword: '',
      active: true
    });
    setDialogOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      password: '',
      confirmPassword: '',
      active: user.active
    });
    setDialogOpen(true);
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    
  };
  
  const handleToggleActive = (userId: string, active: boolean) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active } : user
    ));
    
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (editingUser) {
      const updatedUser = {
        ...editingUser,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        active: formData.active
      };
      
      setUsers(users.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        tenantId: 'tenant1', // Current tenant ID
        role: formData.role,
        active: formData.active,
        createdAt: new Date().toISOString()
      };
      
      setUsers([...users, newUser]);
    }
    
    setDialogOpen(false);
    
  };
  
  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-purple-100 text-purple-800';
      case 'supervisor':
        return 'bg-orange-100 text-orange-800';
      case 'agent':
        return 'bg-blue-100 text-blue-800';
      case 'readonly':
        return 'bg-gray-100 text-gray-800';
      case 'billing':
        return 'bg-green-100 text-green-800';
      case 'custom':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={handleAddUser}>
          <UserPlus size={16} className="mr-2" />
          Add User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage users and their access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found. Create a new user to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail size={14} className="mr-2 text-gray-500" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Shield size={14} className="mr-2 text-gray-500" />
                        <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.active ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle size={14} className="mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500">
                          <XCircle size={14} className="mr-1" />
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit size={14} />
                        </Button>
                        
                        {user.active ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-gray-600"
                            onClick={() => handleToggleActive(user.id, false)}
                          >
                            <XCircle size={14} />
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600"
                            onClick={() => handleToggleActive(user.id, true)}
                          >
                            <CheckCircle size={14} />
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Update user details and permissions.' 
                : 'Fill in the details to create a new user.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({ ...formData, role: value as Role })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="readonly">Read Only</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {!editingUser && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      required={!editingUser}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      required={!editingUser}
                    />
                  </div>
                </>
              )}
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
