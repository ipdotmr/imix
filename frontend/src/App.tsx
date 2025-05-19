import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { LanguageProvider } from './providers/LanguageProvider';
import DashboardLayout from './components/layout/DashboardLayout';
import SettingsLayout from './components/layout/SettingsLayout';
import Login from './views/auth/Login';
import DashboardHome from './views/dashboard/Home';
import TenantManagement from './views/dashboard/TenantManagement';
import AgentWorkspace from './views/agent/AgentWorkspace';
import FlowDesigner from './views/flows/FlowDesigner';
import TaskManagement from './views/tasks/TaskManagement';
import PhoneBook from './views/contacts/PhoneBook';
import BrandingSettings from './views/settings/BrandingSettings';
import AISettings from './views/settings/AISettings';
import NotificationSettings from './views/settings/NotificationSettings';
import CostSettings from './views/settings/CostSettings';
import UserManagement from './views/settings/UserManagement';
import LocalizationSettings from './views/settings/LocalizationSettings';
import { getCurrentUser, isAuthenticated } from './services/auth';
import { User } from './types';
import './App.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-gray-200 border-r-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={setUser} />} />
          
          <Route element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/tenants" element={<TenantManagement />} />
            <Route path="/agent" element={<AgentWorkspace />} />
            <Route path="/flows" element={<FlowDesigner />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/contacts/phonebook" element={<PhoneBook />} />
          </Route>
          
          <Route path="/settings" element={user ? <SettingsLayout /> : <Navigate to="/login" />}>
            <Route path="branding" element={<BrandingSettings />} />
            <Route path="ai" element={<AISettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="costs" element={<CostSettings />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="localization" element={<LocalizationSettings />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
