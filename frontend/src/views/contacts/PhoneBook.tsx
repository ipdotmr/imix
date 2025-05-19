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
import { Checkbox } from "../../components/ui/checkbox";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Tag,
  Settings,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "../../providers/LanguageProvider";
import {
  ContactGroup,
  Contact,
  Role,
  ContactGroupPermission,
  ContactVariantField
} from "../../types";

const PhoneBook: React.FC = () => {
  const { t, language } = useLanguage();
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ContactGroup | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<ContactGroup[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ContactGroup | null>(null);
  const [variantFieldsDialogOpen, setVariantFieldsDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [isAddingContacts, setIsAddingContacts] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  
  const [rolePermissions, setRolePermissions] = useState([
    { role: 'agent' as Role, permissions: ['view'] as ContactGroupPermission[] },
    { role: 'manager' as Role, permissions: ['view', 'edit', 'message'] as ContactGroupPermission[] },
    { role: 'supervisor' as Role, permissions: ['view', 'edit', 'message', 'assign'] as ContactGroupPermission[] },
    { role: 'readonly' as Role, permissions: ['view'] as ContactGroupPermission[] },
  ]);
  
  const [variantFields, setVariantFields] = useState<Record<string, ContactVariantField>>({});
  const [newVariantField, setNewVariantField] = useState({
    name: '',
    description: '',
    isVisibleToAgent: false,
    isAvailableInFlows: false
  });
  
  useEffect(() => {
    const mockGroups: ContactGroup[] = [
      {
        id: '1',
        tenantId: 'tenant1',
        name: 'Customers',
        description: 'All customers',
        contacts: ['1', '2'],
        rolePermissions: [
          { role: 'agent', permissions: ['view'] },
          { role: 'manager', permissions: ['view', 'edit', 'message'] },
        ],
        variantFields: {
          'customerType': {
            name: 'Customer Type',
            description: 'Type of customer (VIP, Regular, etc.)',
            isVisibleToAgent: true,
            isAvailableInFlows: true
          },
          'accountManager': {
            name: 'Account Manager',
            description: 'Assigned account manager',
            isVisibleToAgent: true,
            isAvailableInFlows: false
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        tenantId: 'tenant1',
        name: 'Leads',
        description: 'Potential customers',
        contacts: ['3'],
        rolePermissions: [
          { role: 'agent', permissions: ['view'] },
          { role: 'manager', permissions: ['view', 'edit', 'message'] },
        ],
        variantFields: {
          'leadSource': {
            name: 'Lead Source',
            description: 'Where the lead came from',
            isVisibleToAgent: true,
            isAvailableInFlows: true
          },
          'leadScore': {
            name: 'Lead Score',
            description: 'Score from 1-10',
            isVisibleToAgent: false,
            isAvailableInFlows: true
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    const mockContacts: Contact[] = [
      {
        id: '1',
        tenantId: 'tenant1',
        whatsappAccountId: 'account1',
        phoneNumber: '+1234567890',
        name: 'John Doe',
        profileName: 'John',
        labels: [{ name: 'Customer', color: '#4CAF50' }],
        customFields: {},
        variantFieldValues: {
          'customerType': 'VIP',
          'accountManager': 'Sarah Johnson'
        },
        groupIds: ['1'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        tenantId: 'tenant1',
        whatsappAccountId: 'account1',
        phoneNumber: '+0987654321',
        name: 'Jane Smith',
        profileName: 'Jane',
        labels: [{ name: 'Customer', color: '#2196F3' }],
        customFields: {},
        variantFieldValues: {
          'customerType': 'Regular',
          'accountManager': 'Mike Wilson'
        },
        groupIds: ['1'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        tenantId: 'tenant1',
        whatsappAccountId: 'account1',
        phoneNumber: '+1122334455',
        name: 'Alice Brown',
        profileName: 'Alice',
        labels: [{ name: 'Lead', color: '#FFC107' }],
        customFields: {},
        variantFieldValues: {
          'leadSource': 'Website',
          'leadScore': '8'
        },
        groupIds: ['2'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    setGroups(mockGroups);
    setContacts(mockContacts);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectGroup = (group: ContactGroup) => {
    setSelectedGroup(group);
    setBreadcrumbs([...breadcrumbs, group]);
    setVariantFields(group.variantFields);
  };
  
  const handleNavigateToBreadcrumb = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setSelectedGroup(newBreadcrumbs[newBreadcrumbs.length - 1]);
  };
  
  const handleEditGroup = (group: ContactGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
    });
    setRolePermissions(group.rolePermissions);
    setVariantFields(group.variantFields);
    setDialogOpen(true);
  };
  
  const handleAddGroup = () => {
    setEditingGroup(null);
    setFormData({
      name: '',
      description: '',
    });
    setRolePermissions([
      { role: 'agent', permissions: ['view'] },
      { role: 'manager', permissions: ['view', 'edit', 'message'] },
    ]);
    setVariantFields({});
    setDialogOpen(true);
  };
  
  const handleSubmit = () => {
    if (editingGroup) {
      const updatedGroups = groups.map(group => 
        group.id === editingGroup.id 
          ? {
              ...group,
              name: formData.name,
              description: formData.description,
              rolePermissions,
              variantFields,
              updatedAt: new Date().toISOString()
            }
          : group
      );
      setGroups(updatedGroups);
      
      
      if (selectedGroup?.id === editingGroup.id) {
        setSelectedGroup({
          ...selectedGroup,
          name: formData.name,
          description: formData.description,
          rolePermissions,
          variantFields,
          updatedAt: new Date().toISOString()
        });
        
        const updatedBreadcrumbs = breadcrumbs.map(crumb => 
          crumb.id === editingGroup.id
            ? {
                ...crumb,
                name: formData.name,
                description: formData.description,
                rolePermissions,
                variantFields,
                updatedAt: new Date().toISOString()
              }
            : crumb
        );
        setBreadcrumbs(updatedBreadcrumbs);
      }
    } else {
      const newGroup: ContactGroup = {
        id: Date.now().toString(),
        tenantId: 'tenant1', // Replace with actual tenant ID
        name: formData.name,
        description: formData.description,
        contacts: [],
        parentGroupId: selectedGroup?.id,
        rolePermissions,
        variantFields,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setGroups([...groups, newGroup]);
    }
    
    setDialogOpen(false);
  };
  
  const handleDeleteGroup = (groupId: string) => {
    const groupToDelete = groups.find(g => g.id === groupId);
    if (groupToDelete && groupToDelete.contacts.length > 0) {
      alert(t('phonebook.cannotDeleteGroupWithContacts'));
      return;
    }
    
    const childGroups = groups.filter(g => g.parentGroupId === groupId);
    if (childGroups.length > 0) {
      alert(t('phonebook.cannotDeleteGroupWithChildren'));
      return;
    }
    
    setGroups(groups.filter(g => g.id !== groupId));
    
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(null);
      setBreadcrumbs([]);
    }
  };
  
  const handleAddVariantField = () => {
    if (!newVariantField.name) return;
    
    const visibleFieldsCount = Object.values(variantFields).filter(f => f.isVisibleToAgent).length;
    if (newVariantField.isVisibleToAgent && visibleFieldsCount >= 3) {
      alert(t('phonebook.maxVisibleFieldsReached'));
      return;
    }
    
    const fieldKey = newVariantField.name.toLowerCase().replace(/\s+/g, '_');
    setVariantFields({
      ...variantFields,
      [fieldKey]: {
        name: newVariantField.name,
        description: newVariantField.description,
        isVisibleToAgent: newVariantField.isVisibleToAgent,
        isAvailableInFlows: newVariantField.isAvailableInFlows
      }
    });
    
    setNewVariantField({
      name: '',
      description: '',
      isVisibleToAgent: false,
      isAvailableInFlows: false
    });
  };
  
  const handleDeleteVariantField = (fieldKey: string) => {
    const newFields = { ...variantFields };
    delete newFields[fieldKey];
    setVariantFields(newFields);
  };
  
  const handleTogglePermission = (roleIndex: number, permission: ContactGroupPermission) => {
    const newRolePermissions = [...rolePermissions];
    const currentPermissions = newRolePermissions[roleIndex].permissions;
    
    if (currentPermissions.includes(permission)) {
      newRolePermissions[roleIndex].permissions = currentPermissions.filter(p => p !== permission);
    } else {
      newRolePermissions[roleIndex].permissions = [...currentPermissions, permission];
    }
    
    setRolePermissions(newRolePermissions);
  };
  
  const handleToggleVariantFieldVisibility = (fieldKey: string) => {
    const visibleFieldsCount = Object.values(variantFields).filter(f => f.isVisibleToAgent).length;
    if (!variantFields[fieldKey].isVisibleToAgent && visibleFieldsCount >= 3) {
      alert(t('phonebook.maxVisibleFieldsReached'));
      return;
    }
    
    setVariantFields({
      ...variantFields,
      [fieldKey]: {
        ...variantFields[fieldKey],
        isVisibleToAgent: !variantFields[fieldKey].isVisibleToAgent
      }
    });
  };
  
  const handleToggleVariantFieldFlowAvailability = (fieldKey: string) => {
    setVariantFields({
      ...variantFields,
      [fieldKey]: {
        ...variantFields[fieldKey],
        isAvailableInFlows: !variantFields[fieldKey].isAvailableInFlows
      }
    });
  };
  
  const getGroupContacts = () => {
    if (!selectedGroup) return [];
    return contacts.filter(contact => selectedGroup.contacts.includes(contact.id));
  };
  
  const getAvailableContacts = () => {
    if (!selectedGroup) return [];
    return contacts.filter(contact => !selectedGroup.contacts.includes(contact.id));
  };
  
  const handleAddContactsToGroup = (contactIds: string[]) => {
    if (!selectedGroup) return;
    
    const updatedGroup = {
      ...selectedGroup,
      contacts: [...selectedGroup.contacts, ...contactIds],
      updatedAt: new Date().toISOString()
    };
    
    setSelectedGroup(updatedGroup);
    
    const updatedGroups = groups.map(group => 
      group.id === selectedGroup.id ? updatedGroup : group
    );
    setGroups(updatedGroups);
    
    const updatedBreadcrumbs = breadcrumbs.map(crumb => 
      crumb.id === selectedGroup.id ? updatedGroup : crumb
    );
    setBreadcrumbs(updatedBreadcrumbs);
    
    const updatedContacts = contacts.map(contact => 
      contactIds.includes(contact.id)
        ? {
            ...contact,
            groupIds: [...contact.groupIds, selectedGroup.id],
            updatedAt: new Date().toISOString()
          }
        : contact
    );
    setContacts(updatedContacts);
    
    setIsAddingContacts(false);
  };
  
  const handleRemoveContactFromGroup = (contactId: string) => {
    if (!selectedGroup) return;
    
    const updatedGroup = {
      ...selectedGroup,
      contacts: selectedGroup.contacts.filter(id => id !== contactId),
      updatedAt: new Date().toISOString()
    };
    
    setSelectedGroup(updatedGroup);
    
    const updatedGroups = groups.map(group => 
      group.id === selectedGroup.id ? updatedGroup : group
    );
    setGroups(updatedGroups);
    
    const updatedBreadcrumbs = breadcrumbs.map(crumb => 
      crumb.id === selectedGroup.id ? updatedGroup : crumb
    );
    setBreadcrumbs(updatedBreadcrumbs);
    
    const updatedContacts = contacts.map(contact => 
      contact.id === contactId
        ? {
            ...contact,
            groupIds: contact.groupIds.filter(id => id !== selectedGroup.id),
            updatedAt: new Date().toISOString()
          }
        : contact
    );
    setContacts(updatedContacts);
  };
  
  const filteredGroups = selectedGroup
    ? groups.filter(group => group.parentGroupId === selectedGroup.id)
    : groups.filter(group => !group.parentGroupId);
  
  return (
    <div className={`container mx-auto py-6 ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('phonebook.title')}</h1>
          <p className="text-gray-500">{t('phonebook.description')}</p>
        </div>
        <Button onClick={handleAddGroup}>
          <Plus size={16} className="mr-2" />
          {t('phonebook.addGroup')}
        </Button>
      </div>
      
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center mb-4 overflow-x-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setBreadcrumbs([]);
              setSelectedGroup(null);
            }}
          >
            {t('phonebook.allGroups')}
          </Button>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight size={16} className="mx-1 text-gray-400" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigateToBreadcrumb(index)}
                className={index === breadcrumbs.length - 1 ? 'font-bold' : ''}
              >
                {crumb.name}
              </Button>
            </React.Fragment>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Groups list */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('phonebook.groups')}</CardTitle>
              <CardDescription>
                {selectedGroup 
                  ? `${t('phonebook.subgroupsOf')} ${selectedGroup.name}`
                  : t('phonebook.topLevelGroups')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredGroups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {t('phonebook.noGroups')}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredGroups.map(group => (
                    <Card key={group.id} className="cursor-pointer hover:bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div 
                            className="flex-1"
                            onClick={() => handleSelectGroup(group)}
                          >
                            <div className="font-medium">{group.name}</div>
                            {group.description && (
                              <div className="text-sm text-gray-500">{group.description}</div>
                            )}
                            <div className="text-xs text-gray-400 mt-1">
                              {`${t('phonebook.contactsCount')}: ${group.contacts.length}`}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditGroup(group)}>
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteGroup(group.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Group details */}
        <div className="md:col-span-2">
          {selectedGroup ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{selectedGroup.name}</CardTitle>
                  {selectedGroup.description && (
                    <CardDescription>{selectedGroup.description}</CardDescription>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setVariantFieldsDialogOpen(true)}>
                    <Tag size={16} className="mr-2" />
                    {t('phonebook.variantFields')}
                  </Button>
                  <Button variant="outline" onClick={() => setPermissionsDialogOpen(true)}>
                    <Settings size={16} className="mr-2" />
                    {t('phonebook.permissions')}
                  </Button>
                  <Button onClick={() => setIsAddingContacts(true)}>
                    <Plus size={16} className="mr-2" />
                    {t('phonebook.addContacts')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="contacts">
                  <TabsList className="mb-4">
                    <TabsTrigger value="contacts">
                      <Users size={16} className="mr-2" />
                      {t('phonebook.contacts')}
                    </TabsTrigger>
                    <TabsTrigger value="subgroups">
                      <Users size={16} className="mr-2" />
                      {t('phonebook.subgroups')}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="contacts">
                    {getGroupContacts().length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {t('phonebook.noContacts')}
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('phonebook.name')}</TableHead>
                            <TableHead>{t('phonebook.phone')}</TableHead>
                            {Object.values(selectedGroup.variantFields)
                              .filter(field => field.isVisibleToAgent)
                              .map(field => (
                                <TableHead key={field.name}>{field.name}</TableHead>
                              ))
                            }
                            <TableHead>{t('common.actions')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getGroupContacts().map(contact => (
                            <TableRow key={contact.id}>
                              <TableCell className="font-medium">{contact.name}</TableCell>
                              <TableCell>{contact.phoneNumber}</TableCell>
                              {Object.entries(selectedGroup.variantFields)
                                .filter(([_, fieldValue]) => fieldValue.isVisibleToAgent)
                                .map(([key, _]) => (
                                  <TableCell key={key}>
                                    {contact.variantFieldValues[key] || '-'}
                                  </TableCell>
                                ))
                              }
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRemoveContactFromGroup(contact.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="subgroups">
                    {filteredGroups.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {t('phonebook.noSubgroups')}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredGroups.map(group => (
                          <Card key={group.id} className="cursor-pointer hover:bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div 
                                  className="flex-1"
                                  onClick={() => handleSelectGroup(group)}
                                >
                                  <div className="font-medium">{group.name}</div>
                                  {group.description && (
                                    <div className="text-sm text-gray-500">{group.description}</div>
                                  )}
                                  <div className="text-xs text-gray-400 mt-1">
                                    {`${t('phonebook.contactsCount')}: ${group.contacts.length}`}
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditGroup(group)}>
                                    <Edit size={16} />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleDeleteGroup(group.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">{t('phonebook.selectGroup')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add/Edit Group Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? t('phonebook.editGroup') : t('phonebook.addGroup')}
            </DialogTitle>
            <DialogDescription>
              {editingGroup 
                ? t('phonebook.editGroupDescription')
                : t('phonebook.addGroupDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('phonebook.groupName')}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{t('phonebook.groupDescription')}</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmit}>
              {editingGroup ? t('common.update') : t('common.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Variant Fields Dialog */}
      <Dialog open={variantFieldsDialogOpen} onOpenChange={setVariantFieldsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('phonebook.variantFields')}</DialogTitle>
            <DialogDescription>
              {t('phonebook.variantFieldsDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-end gap-4 mb-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="fieldName">{t('phonebook.fieldName')}</Label>
                <Input
                  id="fieldName"
                  value={newVariantField.name}
                  onChange={(e) => setNewVariantField({ ...newVariantField, name: e.target.value })}
                  placeholder={t('phonebook.fieldNamePlaceholder')}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="fieldDescription">{t('phonebook.fieldDescription')}</Label>
                <Input
                  id="fieldDescription"
                  value={newVariantField.description}
                  onChange={(e) => setNewVariantField({ ...newVariantField, description: e.target.value })}
                  placeholder={t('phonebook.fieldDescriptionPlaceholder')}
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="isVisibleToAgent"
                  checked={newVariantField.isVisibleToAgent}
                  onCheckedChange={(checked) => 
                    setNewVariantField({ ...newVariantField, isVisibleToAgent: checked as boolean })
                  }
                />
                <Label htmlFor="isVisibleToAgent">{t('phonebook.visibleToAgent')}</Label>
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="isAvailableInFlows"
                  checked={newVariantField.isAvailableInFlows}
                  onCheckedChange={(checked) => 
                    setNewVariantField({ ...newVariantField, isAvailableInFlows: checked as boolean })
                  }
                />
                <Label htmlFor="isAvailableInFlows">{t('phonebook.availableInFlows')}</Label>
              </div>
              <Button onClick={handleAddVariantField} disabled={!newVariantField.name}>
                {t('phonebook.addField')}
              </Button>
            </div>
            
            {Object.keys(variantFields).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t('phonebook.noVariantFields')}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('phonebook.fieldName')}</TableHead>
                    <TableHead>{t('phonebook.fieldDescription')}</TableHead>
                    <TableHead>{t('phonebook.visibleToAgent')}</TableHead>
                    <TableHead>{t('phonebook.availableInFlows')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(variantFields).map(([key, field]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{field.name}</TableCell>
                      <TableCell>{field.description || '-'}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={field.isVisibleToAgent}
                          onCheckedChange={() => handleToggleVariantFieldVisibility(key)}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={field.isAvailableInFlows}
                          onCheckedChange={() => handleToggleVariantFieldFlowAvailability(key)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteVariantField(key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            <div className="text-sm text-gray-500 mt-2">
              {`${t('phonebook.visibleFieldsCount')}: ${Object.values(variantFields).filter(f => f.isVisibleToAgent).length}/3`}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setVariantFieldsDialogOpen(false)}>
              {t('common.done')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Permissions Dialog */}
      <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('phonebook.permissions')}</DialogTitle>
            <DialogDescription>
              {t('phonebook.permissionsDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('phonebook.role')}</TableHead>
                  <TableHead>{t('phonebook.viewPermission')}</TableHead>
                  <TableHead>{t('phonebook.editPermission')}</TableHead>
                  <TableHead>{t('phonebook.deletePermission')}</TableHead>
                  <TableHead>{t('phonebook.messagePermission')}</TableHead>
                  <TableHead>{t('phonebook.assignPermission')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolePermissions.map((rolePerm, index) => (
                  <TableRow key={rolePerm.role}>
                    <TableCell className="font-medium">
                      {t(`roles.${rolePerm.role}`)}
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={rolePerm.permissions.includes('view')}
                        onCheckedChange={() => handleTogglePermission(index, 'view')}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={rolePerm.permissions.includes('edit')}
                        onCheckedChange={() => handleTogglePermission(index, 'edit')}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={rolePerm.permissions.includes('delete')}
                        onCheckedChange={() => handleTogglePermission(index, 'delete')}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={rolePerm.permissions.includes('message')}
                        onCheckedChange={() => handleTogglePermission(index, 'message')}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={rolePerm.permissions.includes('assign')}
                        onCheckedChange={() => handleTogglePermission(index, 'assign')}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setPermissionsDialogOpen(false)}>
              {t('common.done')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Contacts Dialog */}
      <Dialog open={isAddingContacts} onOpenChange={setIsAddingContacts}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('phonebook.addContacts')}</DialogTitle>
            <DialogDescription>
              {t('phonebook.addContactsDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="mb-4">
              <Input
                placeholder={t('phonebook.searchContacts')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="mb-4"
              />
              
              {getAvailableContacts().length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {t('phonebook.noAvailableContacts')}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('phonebook.select')}</TableHead>
                      <TableHead>{t('phonebook.name')}</TableHead>
                      <TableHead>{t('phonebook.phone')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getAvailableContacts()
                      .filter(contact => 
                        !searchText || 
                        contact.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                        contact.phoneNumber.includes(searchText)
                      )
                      .map(contact => (
                        <TableRow key={contact.id}>
                          <TableCell>
                            <Checkbox
                              id={`contact-${contact.id}`}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleAddContactsToGroup([contact.id]);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.phoneNumber}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingContacts(false)}>
              {t('common.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhoneBook;
