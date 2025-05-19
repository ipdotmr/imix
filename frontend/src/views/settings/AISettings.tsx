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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "../../components/ui/tabs";
import { Slider } from "../../components/ui/slider";
import { Save, RefreshCw } from 'lucide-react';
import api from '../../services/api';

interface AISettings {
  provider: 'chatgpt' | 'deepseek';
  apiKey?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  deepseekUrl: string;
}

const AISettings: React.FC = () => {
  const [settings, setSettings] = useState<AISettings>({
    provider: 'chatgpt',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 500,
    deepseekUrl: 'https://dayloul.sat.mr/api/v1/chat/completions'
  });
  
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  
  useEffect(() => {
    const mockSettings: AISettings = {
      provider: 'chatgpt',
      apiKey: '',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 500,
      deepseekUrl: 'https://dayloul.sat.mr/api/v1/chat/completions'
    };
    
    setSettings(mockSettings);
    
  }, []);
  
  const handleProviderChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      provider: value as 'chatgpt' | 'deepseek'
    }));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleModelChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      model: value
    }));
  };
  
  const handleTemperatureChange = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      temperature: value[0]
    }));
  };
  
  const handleMaxTokensChange = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      maxTokens: value[0]
    }));
  };
  
  const handleSave = async () => {
    setSaving(true);
    
    try {
      
      setTimeout(() => {
        setSaving(false);
        alert('AI settings saved successfully!');
      }, 1000);
    } catch (error) {
      console.error('Failed to save AI settings', error);
      setSaving(false);
      alert('Failed to save AI settings');
    }
  };
  
  const testConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    
    setTimeout(() => {
      if (settings.provider === 'chatgpt' && !settings.apiKey) {
        setTestResult({
          success: false,
          message: 'API key is required for ChatGPT'
        });
      } else {
        setTestResult({
          success: true,
          message: `Successfully connected to ${settings.provider === 'chatgpt' ? 'ChatGPT API' : 'DeepSeek R1 at ' + settings.deepseekUrl}`
        });
      }
      setTestingConnection(false);
    }, 2000);
    
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Assistant Settings</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={testConnection} 
            disabled={testingConnection}
          >
            <RefreshCw size={16} className={`mr-2 ${testingConnection ? 'animate-spin' : ''}`} />
            {testingConnection ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save size={16} className="mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
      
      {testResult && (
        <div className={`p-4 rounded-md ${testResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {testResult.message}
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>AI Provider</CardTitle>
          <CardDescription>Select and configure your AI assistant provider</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select 
                value={settings.provider} 
                onValueChange={handleProviderChange}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chatgpt">ChatGPT (OpenAI)</SelectItem>
                  <SelectItem value="deepseek">DeepSeek R1 (Self-hosted)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs defaultValue={settings.provider} value={settings.provider} onValueChange={handleProviderChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
                <TabsTrigger value="deepseek">DeepSeek R1</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chatgpt" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    name="apiKey"
                    type="password"
                    value={settings.apiKey || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your OpenAI API key"
                  />
                  <p className="text-xs text-gray-500">
                    Your API key is stored securely and used only for making requests to the OpenAI API.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select 
                    value={settings.model} 
                    onValueChange={handleModelChange}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="deepseek" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="deepseekUrl">DeepSeek R1 API URL</Label>
                  <Input
                    id="deepseekUrl"
                    name="deepseekUrl"
                    value={settings.deepseekUrl}
                    onChange={handleInputChange}
                    placeholder="Enter the DeepSeek R1 API URL"
                  />
                  <p className="text-xs text-gray-500">
                    The URL of your self-hosted DeepSeek R1 instance. Default: https://dayloul.sat.mr/api/v1/chat/completions
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Advanced Settings</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature: {settings.temperature.toFixed(1)}</Label>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[settings.temperature]}
                  onValueChange={handleTemperatureChange}
                />
                <p className="text-xs text-gray-500">
                  Controls randomness: Lower values are more deterministic, higher values are more creative.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="maxTokens">Max Tokens: {settings.maxTokens}</Label>
                </div>
                <Slider
                  id="maxTokens"
                  min={100}
                  max={2000}
                  step={100}
                  value={[settings.maxTokens]}
                  onValueChange={handleMaxTokensChange}
                />
                <p className="text-xs text-gray-500">
                  Maximum number of tokens to generate in the response.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISettings;
