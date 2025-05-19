import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Save, Globe } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';
import { Language } from '../../types';
import api from '../../services/api';

const LocalizationSettings: React.FC = () => {
  const { language, setLanguage, t, languages } = useLanguage();
  const [tenantDefaultLanguage, setTenantDefaultLanguage] = useState<Language>(language as Language);
  const [rtlEnabled, setRtlEnabled] = useState(language === 'ar');
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
  }, []);
  
  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      
      setLanguage(tenantDefaultLanguage);
      
      setTimeout(() => {
        setSaving(false);
        alert(t('settings.localization.saveSuccess'));
      }, 1000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaving(false);
      alert(t('settings.localization.saveError'));
    }
  };
  
  const getLanguageLabel = (lang: Language) => {
    switch(lang) {
      case 'en': return 'English';
      case 'fr': return 'Français';
      case 'ar': return 'العربية';
      default: return 'Unknown';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('settings.localization.title')}</h1>
        <Button onClick={handleSaveSettings} disabled={saving}>
          <Save size={16} className="mr-2" />
          {saving ? t('common.saving') : t('common.saveChanges')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.localization.languageSettings')}</CardTitle>
          <CardDescription>{t('settings.localization.languageSettingsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="default-language">{t('settings.localization.tenantDefaultLanguage')}</Label>
            <Select value={tenantDefaultLanguage} onValueChange={(value) => setTenantDefaultLanguage(value as Language)}>
              <SelectTrigger id="default-language" className="w-full md:w-[300px]">
                <SelectValue placeholder={t('settings.localization.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    <div className="flex items-center">
                      <Globe size={16} className="mr-2" />
                      {getLanguageLabel(lang as Language)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              {t('settings.localization.tenantDefaultLanguageDesc')}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="rtl-support"
              checked={rtlEnabled}
              onCheckedChange={setRtlEnabled}
            />
            <Label htmlFor="rtl-support">
              {t('settings.localization.enableRTL')}
            </Label>
            <p className="text-sm text-gray-500 ml-2">
              {t('settings.localization.enableRTLDesc')}
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 text-blue-800 rounded-md">
            <p className="text-sm">
              <strong>{t('common.note')}:</strong> {t('settings.localization.changeNote')}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.localization.previewTitle')}</CardTitle>
          <CardDescription>{t('settings.localization.previewDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-2">{t('common.sampleContent')}</h3>
            <p>{t('settings.localization.sampleText')}</p>
            <p className="mt-2">{t('settings.localization.sampleDate', { date: new Date().toLocaleDateString(language) })}</p>
            <p>{t('settings.localization.sampleNumber', { number: '1234.56' })}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalizationSettings;
