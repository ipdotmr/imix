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
import { Textarea } from "../../components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Plus, Edit, Trash2, Globe, Webhook, Lock, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useLanguage } from "../../providers/LanguageProvider";
import { Tenant, WhatsAppBusinessAccount, Language } from "../../types";

const TenantManagement: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingTenant, setViewingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    businessId: '',
    businessName: '',
    phoneNumber: '',
    organization: '',
    address: '',
    phone: '',
    mobile: '',
    email: '',
    privateNotes: '',
    webhookUri: '',
    webhookToken: '',
    defaultLanguage: 'en' as Language,
    phoneNumberId: '',
    businessAccountId: '',
    metaAccessToken: '',
    whatsappPhoneId: '',
    appId: ''
  });
  
  const [whatsappAccounts, setWhatsappAccounts] = useState<WhatsAppBusinessAccount[]>([]);
  const [editingAccountIndex, setEditingAccountIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const { t, language } = useLanguage();
  
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
      phoneNumber: tenant.whatsappAccounts[0]?.displayPhoneNumber || '',
      organization: tenant.organization || '',
      address: tenant.address || '',
      phone: tenant.phone || '',
      mobile: tenant.mobile || '',
      email: tenant.email || '',
      privateNotes: tenant.privateNotes || '',
      webhookUri: tenant.webhookUri || '',
      webhookToken: tenant.webhookToken || '',
      defaultLanguage: tenant.defaultLanguage || 'en',
      phoneNumberId: '',
      businessAccountId: '',
      metaAccessToken: '',
      whatsappPhoneId: '',
      appId: ''
    });
    setWhatsappAccounts(tenant.whatsappAccounts || []);
    setActiveTab('general');
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
              organization: formData.organization,
              address: formData.address,
              phone: formData.phone,
              mobile: formData.mobile,
              email: formData.email,
              privateNotes: formData.privateNotes,
              webhookUri: formData.webhookUri,
              webhookToken: formData.webhookToken,
              defaultLanguage: formData.defaultLanguage,
              whatsappAccounts: whatsappAccounts
            }
          : tenant
      );
      setTenants(updatedTenants);
    } else {
      const newTenant: Tenant = {
        id: Date.now().toString(),
        name: formData.name,
        businessId: formData.businessId,
        organization: formData.organization || '',
        address: formData.address || '',
        phone: formData.phone || '',
        mobile: formData.mobile || '',
        email: formData.email || '',
        privateNotes: formData.privateNotes || '',
        webhookUri: formData.webhookUri || '',
        webhookToken: formData.webhookToken || '',
        defaultLanguage: formData.defaultLanguage,
        whatsappAccounts: whatsappAccounts.length > 0 ? whatsappAccounts : [
          {
            phoneNumberId: `phone-${Date.now()}`,
            displayPhoneNumber: formData.phoneNumber,
            businessName: formData.businessName,
            verified: false,
            businessAccountId: '',
            metaAccessToken: '',
            appId: ''
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
  
  const handleAddWhatsAppAccount = () => {
    setEditingAccountIndex(null);
    setFormData({
      ...formData,
      phoneNumberId: '',
      businessAccountId: '',
      metaAccessToken: '',
      whatsappPhoneId: '',
      appId: '',
      phoneNumber: '',
      businessName: ''
    });
    setActiveTab('whatsapp');
  };
  
  const handleEditWhatsAppAccount = (index: number) => {
    const account = whatsappAccounts[index];
    setEditingAccountIndex(index);
    setFormData({
      ...formData,
      phoneNumberId: account.phoneNumberId,
      businessAccountId: account.businessAccountId || '',
      metaAccessToken: account.metaAccessToken || '',
      whatsappPhoneId: account.phoneNumberId,
      appId: account.appId || '',
      phoneNumber: account.displayPhoneNumber,
      businessName: account.businessName
    });
    setActiveTab('whatsapp');
  };
  
  const handleDeleteWhatsAppAccount = (index: number) => {
    const newAccounts = [...whatsappAccounts];
    newAccounts.splice(index, 1);
    setWhatsappAccounts(newAccounts);
  };
  
  const handleSaveWhatsAppAccount = () => {
    const account: WhatsAppBusinessAccount = {
      phoneNumberId: formData.phoneNumberId || `phone-${Date.now()}`,
      displayPhoneNumber: formData.phoneNumber,
      businessName: formData.businessName,
      verified: false,
      businessAccountId: formData.businessAccountId,
      metaAccessToken: formData.metaAccessToken,
      appId: formData.appId
    };
    
    if (editingAccountIndex !== null) {
      const newAccounts = [...whatsappAccounts];
      newAccounts[editingAccountIndex] = account;
      setWhatsappAccounts(newAccounts);
    } else {
      setWhatsappAccounts([...whatsappAccounts, account]);
    }
    
    setActiveTab('accounts');
  };
  
  const handleViewTenant = (tenant: Tenant) => {
    setViewingTenant(tenant);
    setWhatsappAccounts(tenant.whatsappAccounts || []);
    setViewDialogOpen(true);
  };

  const handleDeleteTenant = (id: string) => {
    setTenants(tenants.filter(tenant => tenant.id !== id));
    
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-64">{t('common.loading')}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('tenants.title')}</h1>
        <Button onClick={handleAddTenant}>
          <Plus size={16} className="mr-2" />
          {t('tenants.addTenant')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('tenants.title')}</CardTitle>
          <CardDescription>{t('tenants.addTenantDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('tenants.name')}</TableHead>
                <TableHead>{t('tenants.businessId')}</TableHead>
                <TableHead>{t('tenants.phoneNumber')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
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
                      {tenant.active ? t('common.active') : t('common.inactive')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewTenant(tenant)}>
                        <Eye size={16} />
                      </Button>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingTenant ? t('tenants.editTenant') : t('tenants.addTenant')}</DialogTitle>
            <DialogDescription>
              {editingTenant 
                ? t('tenants.editTenantDescription')
                : t('tenants.addTenantDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="general">{t('tenants.generalInfo')}</TabsTrigger>
              <TabsTrigger value="accounts">{t('tenants.whatsappAccounts')}</TabsTrigger>
              <TabsTrigger value="webhook">{t('tenants.webhookSettings')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <form onSubmit={(e) => { e.preventDefault(); setActiveTab('accounts'); }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('tenants.name')}</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessId">{t('tenants.businessId')}</Label>
                      <Input
                        id="businessId"
                        name="businessId"
                        value={formData.businessId}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organization">{t('tenants.organization')}</Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">{t('tenants.address')}</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('tenants.phone')}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mobile">{t('tenants.mobile')}</Label>
                      <Input
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('tenants.email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">{t('tenants.defaultLanguage')}</Label>
                    <Select 
                      value={formData.defaultLanguage} 
                      onValueChange={(value) => setFormData({ ...formData, defaultLanguage: value as Language })}
                    >
                      <SelectTrigger id="defaultLanguage">
                        <SelectValue placeholder={t('tenants.selectLanguage')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">
                          <div className="flex items-center">
                            <Globe size={16} className="mr-2" />
                            {t('language.english')}
                          </div>
                        </SelectItem>
                        <SelectItem value="fr">
                          <div className="flex items-center">
                            <Globe size={16} className="mr-2" />
                            {t('language.french')}
                          </div>
                        </SelectItem>
                        <SelectItem value="ar">
                          <div className="flex items-center">
                            <Globe size={16} className="mr-2" />
                            {t('language.arabic')}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="privateNotes">{t('tenants.privateNotes')}</Label>
                    <Textarea
                      id="privateNotes"
                      name="privateNotes"
                      value={formData.privateNotes}
                      onChange={(e) => setFormData({ ...formData, privateNotes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button type="submit">
                    {t('common.next')}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="accounts">
              <div className="grid gap-4 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{t('tenants.whatsappAccounts')}</h3>
                  <Button onClick={handleAddWhatsAppAccount}>
                    <Plus size={16} className="mr-2" />
                    {t('tenants.addAccount')}
                  </Button>
                </div>
                
                {whatsappAccounts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {t('tenants.noAccounts')}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('tenants.businessName')}</TableHead>
                        <TableHead>{t('tenants.phoneNumber')}</TableHead>
                        <TableHead>{t('tenants.status')}</TableHead>
                        <TableHead>{t('common.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {whatsappAccounts.map((account, index) => (
                        <TableRow key={account.phoneNumberId}>
                          <TableCell className="font-medium">{account.businessName}</TableCell>
                          <TableCell>{account.displayPhoneNumber}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${account.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                              {account.verified ? t('tenants.verified') : t('tenants.pending')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditWhatsAppAccount(index)}>
                                <Edit size={16} />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteWhatsAppAccount(index)}>
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              
              <div className="flex justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab('general')}>
                  {t('common.back')}
                </Button>
                <Button type="button" onClick={() => setActiveTab('webhook')}>
                  {t('common.next')}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="whatsapp">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveWhatsAppAccount(); }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">{t('tenants.businessName')}</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">{t('tenants.phoneNumber')}</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessAccountId">{t('tenants.businessAccountId')}</Label>
                    <Input
                      id="businessAccountId"
                      name="businessAccountId"
                      value={formData.businessAccountId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaAccessToken">{t('tenants.metaAccessToken')}</Label>
                    <Input
                      id="metaAccessToken"
                      name="metaAccessToken"
                      value={formData.metaAccessToken}
                      onChange={handleInputChange}
                      required
                      type="password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsappPhoneId">{t('tenants.whatsappPhoneId')}</Label>
                    <Input
                      id="whatsappPhoneId"
                      name="whatsappPhoneId"
                      value={formData.whatsappPhoneId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="appId">{t('tenants.appId')}</Label>
                    <Input
                      id="appId"
                      name="appId"
                      value={formData.appId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('accounts')}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit">
                    {editingAccountIndex !== null ? t('common.update') : t('common.add')}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="webhook">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookUri">{t('tenants.webhookUri')}</Label>
                  <div className="flex">
                    <Input
                      id="webhookUri"
                      name="webhookUri"
                      value={formData.webhookUri}
                      onChange={handleInputChange}
                      className="flex-1"
                      placeholder="https://imix.ip.mr/api/webhook/your-unique-id"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {t('tenants.webhookUriDescription')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookToken">{t('tenants.webhookToken')}</Label>
                  <div className="flex">
                    <Input
                      id="webhookToken"
                      name="webhookToken"
                      value={formData.webhookToken}
                      onChange={handleInputChange}
                      type="password"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => setFormData({ ...formData, webhookToken: Math.random().toString(36).substring(2, 15) })}
                    >
                      {t('tenants.generateToken')}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {t('tenants.webhookTokenDescription')}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab('accounts')}>
                  {t('common.back')}
                </Button>
                <Button type="button" onClick={handleSubmit}>
                  {editingTenant ? t('common.update') : t('common.create')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* View Tenant Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewingTenant?.name}</DialogTitle>
            <DialogDescription>
              {t('tenants.viewTenantDescription')}
            </DialogDescription>
          </DialogHeader>
          
          {viewingTenant && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">{t('tenants.basicInfo')}</h3>
                  <div className="text-sm space-y-2">
                    <div><span className="font-medium">{t('tenants.name')}:</span> {viewingTenant.name}</div>
                    <div><span className="font-medium">{t('tenants.businessId')}:</span> {viewingTenant.businessId}</div>
                    <div><span className="font-medium">{t('tenants.organization')}:</span> {viewingTenant.organization || '-'}</div>
                    <div><span className="font-medium">{t('tenants.email')}:</span> {viewingTenant.email || '-'}</div>
                    <div><span className="font-medium">{t('tenants.phone')}:</span> {viewingTenant.phone || '-'}</div>
                    <div><span className="font-medium">{t('tenants.mobile')}:</span> {viewingTenant.mobile || '-'}</div>
                    <div><span className="font-medium">{t('common.status')}:</span> 
                      <span className={viewingTenant.active ? 'text-green-600' : 'text-red-600'}>
                        {viewingTenant.active ? t('common.active') : t('common.inactive')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">{t('tenants.whatsappAccounts')}</h3>
                  {whatsappAccounts.length === 0 ? (
                    <div className="text-sm text-gray-500">{t('tenants.noAccounts')}</div>
                  ) : (
                    <div className="text-sm space-y-4">
                      {whatsappAccounts.map((account, index) => (
                        <div key={index} className="p-3 border rounded-md">
                          <div><span className="font-medium">{t('tenants.businessName')}:</span> {account.businessName}</div>
                          <div><span className="font-medium">{t('tenants.phoneNumber')}:</span> {account.displayPhoneNumber}</div>
                          <div><span className="font-medium">{t('tenants.status')}:</span> 
                            <span className={account.verified ? 'text-green-600' : 'text-yellow-600'}>
                              {account.verified ? t('tenants.verified') : t('tenants.pending')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {viewingTenant.privateNotes && (
                <div>
                  <h3 className="font-medium mb-2">{t('tenants.privateNotes')}</h3>
                  <div className="text-sm p-3 border rounded-md whitespace-pre-wrap">
                    {viewingTenant.privateNotes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenantManagement;
