import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Save, Upload, RefreshCw } from 'lucide-react';
import { BrandingSettings as BrandingSettingsType } from '../../types';
import api from '../../services/api';

const BrandingSettings: React.FC = () => {
  const [settings, setSettings] = useState<BrandingSettingsType>({
    id: '',
    tenantId: '',
    companyName: 'iMix CRM by IPROD',
    colors: {
      primary: '#1a56db',
      secondary: '#9061f9',
      accent: '#e74694',
      background: '#ffffff',
      text: '#111827'
    },
    fontFamily: 'Inter, system-ui, sans-serif',
    createdAt: '',
    updatedAt: ''
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const mockSettings: BrandingSettingsType = {
      id: '1',
      tenantId: 'tenant1',
      companyName: 'iMix CRM by IPROD',
      logoUrl: undefined,
      faviconUrl: undefined,
      colors: {
        primary: '#1a56db',
        secondary: '#9061f9',
        accent: '#e74694',
        background: '#ffffff',
        text: '#111827'
      },
      fontFamily: 'Inter, system-ui, sans-serif',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setSettings(mockSettings);
    
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleColorChange = (colorName: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorName]: value
      }
    }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaviconFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFaviconPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = async () => {
    setSaving(true);
    
    setTimeout(() => {
      setSaving(false);
      alert('Branding settings saved successfully!');
    }, 1000);
    
    //   
    //   
    //   
    //   
  };
  
  const resetToDefaults = () => {
    setSettings({
      ...settings,
      colors: {
        primary: '#1a56db',
        secondary: '#9061f9',
        accent: '#e74694',
        background: '#ffffff',
        text: '#111827'
      },
      fontFamily: 'Inter, system-ui, sans-serif'
    });
    setLogoFile(null);
    setFaviconFile(null);
    setLogoPreview(null);
    setFaviconPreview(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Branding Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw size={16} className="mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save size={16} className="mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
          <TabsTrigger value="colors" className="flex-1">Colors</TabsTrigger>
          <TabsTrigger value="typography" className="flex-1">Typography</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your company name and logo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  name="companyName"
                  value={settings.companyName} 
                  onChange={handleInputChange} 
                  placeholder="Enter company name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <div className="w-32 h-32 border rounded-md flex items-center justify-center overflow-hidden">
                      <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full" />
                    </div>
                  )}
                  <div>
                    <Input 
                      id="logo" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <Button variant="outline" onClick={() => document.getElementById('logo')?.click()}>
                      <Upload size={16} className="mr-2" />
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 200x200px. PNG or SVG format.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-center gap-4">
                  {faviconPreview && (
                    <div className="w-16 h-16 border rounded-md flex items-center justify-center overflow-hidden">
                      <img src={faviconPreview} alt="Favicon preview" className="max-w-full max-h-full" />
                    </div>
                  )}
                  <div>
                    <Input 
                      id="favicon" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFaviconChange}
                      className="hidden"
                    />
                    <Button variant="outline" onClick={() => document.getElementById('favicon')?.click()}>
                      <Upload size={16} className="mr-2" />
                      {faviconPreview ? 'Change Favicon' : 'Upload Favicon'}
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 32x32px. PNG or ICO format.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Settings</CardTitle>
              <CardDescription>Customize the colors of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded-md border" 
                      style={{ backgroundColor: settings.colors.primary }}
                    ></div>
                    <Input 
                      id="primaryColor" 
                      type="text" 
                      value={settings.colors.primary} 
                      onChange={(e) => handleColorChange('primary', e.target.value)} 
                      placeholder="#1a56db"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded-md border" 
                      style={{ backgroundColor: settings.colors.secondary }}
                    ></div>
                    <Input 
                      id="secondaryColor" 
                      type="text" 
                      value={settings.colors.secondary} 
                      onChange={(e) => handleColorChange('secondary', e.target.value)} 
                      placeholder="#9061f9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded-md border" 
                      style={{ backgroundColor: settings.colors.accent }}
                    ></div>
                    <Input 
                      id="accentColor" 
                      type="text" 
                      value={settings.colors.accent} 
                      onChange={(e) => handleColorChange('accent', e.target.value)} 
                      placeholder="#e74694"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded-md border" 
                      style={{ backgroundColor: settings.colors.background }}
                    ></div>
                    <Input 
                      id="backgroundColor" 
                      type="text" 
                      value={settings.colors.background} 
                      onChange={(e) => handleColorChange('background', e.target.value)} 
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded-md border" 
                      style={{ backgroundColor: settings.colors.text }}
                    ></div>
                    <Input 
                      id="textColor" 
                      type="text" 
                      value={settings.colors.text} 
                      onChange={(e) => handleColorChange('text', e.target.value)} 
                      placeholder="#111827"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography Settings</CardTitle>
              <CardDescription>Customize the fonts used in your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Input 
                  id="fontFamily" 
                  name="fontFamily"
                  value={settings.fontFamily} 
                  onChange={handleInputChange} 
                  placeholder="Inter, system-ui, sans-serif"
                />
                <p className="text-xs text-gray-500">
                  Enter a comma-separated list of font families. The first available font will be used.
                </p>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-semibold mb-2">Preview</h3>
                <div style={{ fontFamily: settings.fontFamily }}>
                  <p className="text-2xl font-bold">Heading Text</p>
                  <p className="text-base">This is how your body text will look with the selected font family.</p>
                  <p className="text-sm">Smaller text for captions and labels.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandingSettings;
