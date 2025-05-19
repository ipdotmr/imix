import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Palette, 
  DollarSign, 
  Users, 
  Bell, 
  Globe,
  Cpu,
  RefreshCw
} from 'lucide-react';

const SettingsLayout: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const settingsMenuItems = [
    { icon: Palette, label: 'Branding', path: '/settings/branding' },
    { icon: DollarSign, label: 'Cost Settings', path: '/settings/costs' },
    { icon: Users, label: 'User Management', path: '/settings/users' },
    { icon: Cpu, label: 'AI Assistant', path: '/settings/ai' },
    { icon: Bell, label: 'Notifications', path: '/settings/notifications' },
    { icon: Globe, label: 'Localization', path: '/settings/localization' },
    { icon: RefreshCw, label: 'System Update', path: '/settings/system-update' },
  ];
  
  return (
    <div className="flex h-full">
      <div className="w-64 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Settings</h2>
        </div>
        <nav className="p-4 space-y-1">
          {settingsMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} className="mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;
