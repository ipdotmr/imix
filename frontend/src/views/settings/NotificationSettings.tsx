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
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Slider } from "../../components/ui/slider";
import { Save, Bell, Volume2, Mail } from 'lucide-react';
import { 
  getNotificationPreferences, 
  saveNotificationPreferences, 
  requestNotificationPermission 
} from '../../services/notification';
import api from '../../services/api';

const NotificationSettings: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.5);
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "",
    useTls: true,
    notificationEnabled: true
  });
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const preferences = getNotificationPreferences();
    setSoundEnabled(preferences.soundEnabled);
    setBrowserNotificationsEnabled(preferences.browserNotificationsEnabled);
    setSoundVolume(preferences.soundVolume);
    
  }, []);
  
  const handleSaveNotificationSettings = () => {
    saveNotificationPreferences({
      soundEnabled,
      browserNotificationsEnabled,
      soundVolume
    });
    
    if (browserNotificationsEnabled) {
      requestNotificationPermission();
    }
    
    
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Notification settings saved successfully!');
    }, 1000);
  };
  
  const handleEmailSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <Button onClick={handleSaveNotificationSettings} disabled={saving}>
          <Save size={16} className="mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      
      <Tabs defaultValue="sound">
        <TabsList className="w-full">
          <TabsTrigger value="sound" className="flex-1">
            <Volume2 size={16} className="mr-2" />
            Sound Notifications
          </TabsTrigger>
          <TabsTrigger value="browser" className="flex-1">
            <Bell size={16} className="mr-2" />
            Browser Notifications
          </TabsTrigger>
          <TabsTrigger value="email" className="flex-1">
            <Mail size={16} className="mr-2" />
            Email Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sound" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sound Notification Settings</CardTitle>
              <CardDescription>Configure sound notifications for new messages and events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound-enabled">Enable Sound Notifications</Label>
                  <p className="text-sm text-gray-500">Play sounds when new messages arrive</p>
                </div>
                <Switch
                  id="sound-enabled"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="sound-volume">Sound Volume: {Math.round(soundVolume * 100)}%</Label>
                </div>
                <Slider
                  id="sound-volume"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[soundVolume]}
                  onValueChange={(value) => setSoundVolume(value[0])}
                  disabled={!soundEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="browser" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Browser Notification Settings</CardTitle>
              <CardDescription>Configure browser notifications for new messages and events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-enabled">Enable Browser Notifications</Label>
                  <p className="text-sm text-gray-500">Show desktop notifications when new messages arrive</p>
                </div>
                <Switch
                  id="browser-enabled"
                  checked={browserNotificationsEnabled}
                  onCheckedChange={setBrowserNotificationsEnabled}
                />
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm">
                  Browser notifications require permission from your browser. 
                  When enabled, you'll be prompted to allow notifications.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notification Settings</CardTitle>
              <CardDescription>Configure email notifications for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-enabled">Enable Email Notifications</Label>
                  <p className="text-sm text-gray-500">Send email notifications for important events</p>
                </div>
                <Switch
                  id="email-enabled"
                  name="notificationEnabled"
                  checked={emailSettings.notificationEnabled}
                  onCheckedChange={(checked) => setEmailSettings(prev => ({
                    ...prev,
                    notificationEnabled: checked
                  }))}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input
                    id="smtpServer"
                    name="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={handleEmailSettingChange}
                    placeholder="smtp.example.com"
                    disabled={!emailSettings.notificationEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    name="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings(prev => ({
                      ...prev,
                      smtpPort: parseInt(e.target.value)
                    }))}
                    placeholder="587"
                    disabled={!emailSettings.notificationEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    name="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={handleEmailSettingChange}
                    placeholder="username@example.com"
                    disabled={!emailSettings.notificationEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    name="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={handleEmailSettingChange}
                    placeholder="••••••••"
                    disabled={!emailSettings.notificationEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    name="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={handleEmailSettingChange}
                    placeholder="notifications@example.com"
                    disabled={!emailSettings.notificationEnabled}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="useTls"
                    name="useTls"
                    checked={emailSettings.useTls}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({
                      ...prev,
                      useTls: checked
                    }))}
                    disabled={!emailSettings.notificationEnabled}
                  />
                  <Label htmlFor="useTls">Use TLS</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationSettings;
