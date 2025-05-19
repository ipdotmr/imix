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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { Save } from 'lucide-react';
import { CostSettings as CostSettingsType, Currency } from '../../types';
import api from '../../services/api';

const CostSettings: React.FC = () => {
  const [settings, setSettings] = useState<CostSettingsType>({
    platformFeePerMessage: 0.01,
    metaBusinessFeePerMessage: 0.005,
    maintenanceHostingFeePerMonth: 50.0,
    currency: 'usd',
    voiceNoteRetentionDays: 30
  });
  
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const mockSettings: CostSettingsType = {
      platformFeePerMessage: 0.01,
      metaBusinessFeePerMessage: 0.005,
      maintenanceHostingFeePerMonth: 50.0,
      currency: 'usd',
      voiceNoteRetentionDays: 30
    };
    
    setSettings(mockSettings);
    
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === 'voiceNoteRetentionDays' ? parseInt(value) : parseFloat(value)
    }));
  };
  
  const handleCurrencyChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      currency: value as Currency
    }));
  };
  
  const handleSave = async () => {
    setSaving(true);
    
    setTimeout(() => {
      setSaving(false);
      alert('Cost settings saved successfully!');
    }, 1000);
    
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cost Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save size={16} className="mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Message Costs</CardTitle>
          <CardDescription>Configure the costs for business-initiated messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={settings.currency} 
                onValueChange={handleCurrencyChange}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mru">MRU - Mauritanian Ouguiya</SelectItem>
                  <SelectItem value="usd">USD - US Dollar</SelectItem>
                  <SelectItem value="eur">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="platformFeePerMessage">Platform Fee (per message)</Label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                  {settings.currency === 'mru' ? 'MRU' : settings.currency === 'usd' ? '$' : '€'}
                </span>
                <Input
                  id="platformFeePerMessage"
                  name="platformFeePerMessage"
                  type="number"
                  step="0.001"
                  min="0"
                  value={settings.platformFeePerMessage}
                  onChange={handleInputChange}
                  className="rounded-l-none"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metaBusinessFeePerMessage">Meta Business Fee (per message)</Label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                  {settings.currency === 'mru' ? 'MRU' : settings.currency === 'usd' ? '$' : '€'}
                </span>
                <Input
                  id="metaBusinessFeePerMessage"
                  name="metaBusinessFeePerMessage"
                  type="number"
                  step="0.001"
                  min="0"
                  value={settings.metaBusinessFeePerMessage}
                  onChange={handleInputChange}
                  className="rounded-l-none"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maintenanceHostingFeePerMonth">Maintenance & Hosting Fee (per month)</Label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                  {settings.currency === 'mru' ? 'MRU' : settings.currency === 'usd' ? '$' : '€'}
                </span>
                <Input
                  id="maintenanceHostingFeePerMonth"
                  name="maintenanceHostingFeePerMonth"
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.maintenanceHostingFeePerMonth}
                  onChange={handleInputChange}
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Voice Note Settings</CardTitle>
          <CardDescription>Configure settings for voice notes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="voiceNoteRetentionDays">Voice Note Retention Period (days)</Label>
            <Input
              id="voiceNoteRetentionDays"
              name="voiceNoteRetentionDays"
              type="number"
              min="1"
              max="365"
              value={settings.voiceNoteRetentionDays}
              onChange={handleInputChange}
            />
            <p className="text-sm text-gray-500">
              Voice notes will be automatically deleted after this many days. Maximum recording duration is 3 minutes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostSettings;
