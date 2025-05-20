import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Settings, 
  BarChart2, 
  Layers,
  LogOut,
  FileText,
  CheckSquare,
  Tag
} from 'lucide-react';
import { Button } from "../ui/button";
import { logout } from '../../services/auth';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Tenants', path: '/tenants' },
    { icon: MessageSquare, label: 'Agent Workspace', path: '/agent' },
    { icon: Layers, label: 'Flow Designer', path: '/flows' },
    { icon: FileText, label: 'Forms', path: '/forms' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Users, label: 'Phone Book', path: '/contacts/phonebook' },
    { icon: Tag, label: 'Labels', path: '/labels' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings/branding' },
  ];
  
  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">iMix CRM by IPROD</h1>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
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
      
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={logout}
        >
          <LogOut size={18} className="mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
