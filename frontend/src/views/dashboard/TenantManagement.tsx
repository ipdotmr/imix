import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Tenant } from "../../types";

const TenantManagement: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    businessId: '',
    businessName: '',
    phoneNumber: ''
  });
  
  useEffect(() => {
    const mockTenants = [
      {
        id: '1',
        name: 'Acme Corp',
        businessId: 'acme123',
        whatsappAccounts: [
          {
            phoneNumberId: 'phone123',
            displayPhoneNumber: '+1234567890',
            businessName: 'Acme Corporation',
            verified: true
          }
        ],
        createdAt: '2023-01-15T12:00:00Z',
        updatedAt: '2023-05-10T15:30:00Z',
        active: true,
        usageLimits: {
          maxMessagesPerDay: 1000,
          maxMediaPerDay: 100,
          maxTemplates: 10,
          maxAgents: 5
        }
      },
      {
        id: '2',
        name: 'Globex Inc',
        businessId: 'globex456',
        whatsappAccounts: [
          {
            phoneNumberId: 'phone456',
            displayPhoneNumber: '+0987654321',
            businessName: 'Globex International',
            verified: true
          }
        ],
        createdAt: '2023-02-20T10:15:00Z',
        updatedAt: '2023-05-12T09:45:00Z',
        active: true,
        usageLimits: {
          maxMessagesPerDay: 2000,
          maxMediaPerDay: 200,
          maxTemplates: 20,
          maxAgents: 10
        }
      }
    ];
    
    setTenants(mockTenants);
    setLoading(false);
    
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddTenant = () => {
    setEditingTenant(null);
    setFormData({
      name: '',
      businessId: '',
      businessName: '',
      phoneNumber: ''
    });
    setDialogOpen(true);
  };
  
  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      name: tenant.name,
      businessId: tenant.businessId,
      businessName: tenant.whatsappAccounts[0]?.businessName || '',
      phoneNumber: tenant.whatsappAccounts[0]?.displayPhoneNumber || ''
    });
    setDialogOpen(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTenant) {
      const updatedTenants = tenants.map(tenant => 
        tenant.id === editingTenant.id 
          ? {
              ...tenant,
              name: formData.name,
              businessId: formData.businessId,
              whatsappAccounts: [
                {
                  ...tenant.whatsappAccounts[0],
                  businessName: formData.businessName,
                  displayPhoneNumber: formData.phoneNumber
                }
              ]
            }
          : tenant
      );
      setTenants(updatedTenants);
    } else {
      const newTenant: Tenant = {
        id: Date.now().toString(),
        name: formData.name,
        businessId: formData.businessId,
        whatsappAccounts: [
          {
            phoneNumberId: `phone-${Date.now()}`,
            displayPhoneNumber: formData.phoneNumber,
            businessName: formData.businessName,
            verified: false
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        active: true,
        usageLimits: {
          maxMessagesPerDay: 1000,
          maxMediaPerDay: 100,
          maxTemplates: 10,
          maxAgents: 5
        }
      };
      setTenants([...tenants, newTenant]);
    }
    
    
    setDialogOpen(false);
  };
  
  const handleDeleteTenant = (id: string) => {
    setTenants(tenants.filter(tenant => tenant.id !== id));
    
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tenant Management</h1>
        <Button onClick={handleAddTenant}>
          <Plus size={16} className="mr-2" />
          Add Tenant
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tenants</CardTitle>
          <CardDescription>Manage your WhatsApp Business tenants</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Business ID</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map(tenant => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.businessId}</TableCell>
                  <TableCell>{tenant.whatsappAccounts[0]?.displayPhoneNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${tenant.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {tenant.active ? 'Active' : 'Inactive'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTenant(tenant)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteTenant(tenant.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</DialogTitle>
            <DialogDescription>
              {editingTenant 
                ? 'Update the tenant details below.' 
                : 'Fill in the details to create a new tenant.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="businessId" className="text-right">Business ID</Label>
                <Input
                  id="businessId"
                  name="businessId"
                  value={formData.businessId}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="businessName" className="text-right">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTenant ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenantManagement;
