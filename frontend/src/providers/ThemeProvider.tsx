import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrandingSettings } from '../types';
import api from '../services/api';

interface ThemeContextType {
  branding: BrandingSettings;
  isLoaded: boolean;
}

const defaultBranding: BrandingSettings = {
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
};

const ThemeContext = createContext<ThemeContextType>({
  branding: defaultBranding,
  isLoaded: false
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        setBranding(defaultBranding);
        
      } catch (error) {
        console.error('Failed to fetch branding settings', error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    fetchBranding();
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.style.setProperty('--color-primary', branding.colors.primary);
      document.documentElement.style.setProperty('--color-secondary', branding.colors.secondary);
      document.documentElement.style.setProperty('--color-accent', branding.colors.accent);
      document.documentElement.style.setProperty('--color-background', branding.colors.background);
      document.documentElement.style.setProperty('--color-text', branding.colors.text);
      document.documentElement.style.setProperty('--font-family', branding.fontFamily);
      
      document.title = branding.companyName;
      
      if (branding.faviconUrl) {
        const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (link) {
          link.href = branding.faviconUrl;
        } else {
          const newLink = document.createElement('link');
          newLink.rel = 'icon';
          newLink.href = branding.faviconUrl;
          document.head.appendChild(newLink);
        }
      }
    }
  }, [isLoaded, branding]);
  
  return (
    <ThemeContext.Provider value={{ branding, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};
