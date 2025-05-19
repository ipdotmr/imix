import React, { useState, useEffect } from 'react';
import { Bell, Search, User, LogOut, Settings, Globe, Check, Menu } from 'lucide-react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { getCurrentUser } from '../../services/auth';
import { User as UserType, Language } from '../../types';
import { useLanguage } from '../../providers/LanguageProvider';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();
  const { language, setLanguage, t, languages } = useLanguage();
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New message from John Doe', read: false },
    { id: '2', title: 'Task assigned to you', read: true },
    { id: '3', title: 'Your account has been verified', read: false }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };
    
    fetchUser();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
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
    <header className="border-b bg-white dark:bg-gray-950 sticky top-0 z-30">
      <div className="flex h-16 items-center px-4">
        {toggleSidebar && (
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
        )}
        
        <div className="mx-6 flex-1">
          <h1 className="text-lg font-semibold">iMix CRM by IPROD</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="md:flex items-center relative hidden">
            <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={t('header.search')}
              className="w-[200px] md:w-[300px] pl-8"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>{t('header.notifications')}</span>
                <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                  {t('header.markAllRead')}
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  {t('header.noNotifications')}
                </div>
              ) : (
                notifications.map(notification => (
                  <DropdownMenuItem key={notification.id} className={`py-2 px-4 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{notification.title}</span>
                        {!notification.read && (
                          <Badge variant="secondary" className="ml-2">
                            {t('header.new')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('header.selectLanguage')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  className="flex justify-between items-center"
                  onClick={() => setLanguage(lang as Language)}
                >
                  <span>{getLanguageLabel(lang as Language)}</span>
                  {language === lang && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/img/avatar.png" alt="Avatar" />
                  <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('header.myAccount')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>{t('header.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings/branding')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('header.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('header.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
