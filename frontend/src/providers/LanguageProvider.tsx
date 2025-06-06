import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { getCurrentUser } from '../services/auth';

const translations = {
  en: {
    'app.name': 'iMix CRM by IPROD',
    'common.search': 'Search...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Information',
    
    'nav.dashboard': 'Dashboard',
    'nav.tenants': 'Tenants',
    'nav.agent': 'Agent Workspace',
    'nav.flows': 'Flow Designer',
    'nav.forms': 'Forms',
    'nav.tasks': 'Tasks',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    
    'settings.branding': 'Branding',
    'settings.ai': 'AI Assistant',
    'settings.notifications': 'Notifications',
    'settings.costs': 'Costs',
    'settings.users': 'Users',
    'settings.localization': 'Localization',
    'settings.systemUpdate': 'System Update',
    
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    'auth.profile': 'Profile',
    'auth.myAccount': 'My Account',
    
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.totalMessages': 'Total Messages',
    'dashboard.activeChats': 'Active Chats',
    'dashboard.pendingTasks': 'Pending Tasks',
    'dashboard.recentActivity': 'Recent Activity',
    
    'agent.title': 'Agent Workspace',
    'agent.contacts': 'Contacts',
    'agent.chats': 'Chats',
    'agent.typeMessage': 'Type a message...',
    'agent.send': 'Send',
    'agent.quickReplies': 'Quick Replies',
    'agent.voiceNote': 'Voice Note',
    'agent.recording': 'Recording...',
    'agent.maxDuration': 'Max duration: 3 minutes',
    
    'tasks.title': 'Task Management',
    'tasks.addTask': 'Add Task',
    'tasks.editTask': 'Edit Task',
    'tasks.taskTitle': 'Title',
    'tasks.description': 'Description',
    'tasks.priority': 'Priority',
    'tasks.status': 'Status',
    'tasks.dueDate': 'Due Date',
    'tasks.assignTo': 'Assign To',
    'tasks.createTask': 'Create Task',
    'tasks.updateTask': 'Update Task',
    'tasks.noDueDate': 'No due date',
    'tasks.unassigned': 'Unassigned',
    'tasks.filterByStatus': 'Filter by Status',
    'tasks.allTasks': 'All Tasks',
    
    'notifications.title': 'Notification Settings',
    'notifications.sound': 'Sound Notifications',
    'notifications.browser': 'Browser Notifications',
    'notifications.email': 'Email Notifications',
    'notifications.enable': 'Enable',
    'notifications.volume': 'Volume',
    
    'language.title': 'Language',
    'language.english': 'English',
    'language.french': 'French',
    'language.arabic': 'Arabic',
    'language.select': 'Select Language',
    
    'systemUpdate.title': 'System Update',
    'systemUpdate.currentVersion': 'Current Version',
    'systemUpdate.latestVersion': 'Latest Version',
    'systemUpdate.updateAvailable': 'Update Available',
    'systemUpdate.noUpdateAvailable': 'No Update Available',
    'systemUpdate.checkForUpdates': 'Check for Updates',
    'systemUpdate.installUpdate': 'Install Update',
    'systemUpdate.releaseNotes': 'Release Notes',
    'systemUpdate.backups': 'System Backups',
    'systemUpdate.createBackup': 'Create Backup',
    'systemUpdate.restoreBackup': 'Restore from Backup',
    'systemUpdate.backupCreated': 'Backup Created',
    'systemUpdate.updateStarted': 'Update Started',
    'systemUpdate.updateComplete': 'Update Complete',
    'systemUpdate.updateFailed': 'Update Failed',
    'systemUpdate.confirmUpdate': 'Are you sure you want to update the system?',
    'systemUpdate.confirmRestore': 'Are you sure you want to restore from this backup?',
    
    'tenants.title': 'Tenants',
    'tenants.addTenant': 'Add Tenant',
    'tenants.editTenant': 'Edit Tenant',
    'tenants.addTenantDescription': 'Add a new tenant to the platform',
    'tenants.editTenantDescription': 'Edit existing tenant information',
    'tenants.viewTenantDescription': 'View tenant details',
    'tenants.generalInfo': 'General Information',
    'tenants.whatsappAccounts': 'WhatsApp Accounts',
    'tenants.webhookSettings': 'Webhook Settings',
    'tenants.basicInfo': 'Basic Information',
    'tenants.name': 'Name',
    'tenants.businessId': 'Business ID',
    'tenants.organization': 'Organization',
    'tenants.email': 'Email',
    'tenants.phone': 'Phone',
    'tenants.mobile': 'Mobile',
    'tenants.privateNotes': 'Private Notes',
    'tenants.businessName': 'Business Name',
    'tenants.phoneNumber': 'Phone Number',
    'tenants.status': 'Status',
    'tenants.verified': 'Verified',
    'tenants.pending': 'Pending',
    'tenants.noAccounts': 'No WhatsApp accounts found',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.status': 'Status'
  },
  fr: {
    'app.name': 'iMix CRM par IPROD',
    'common.search': 'Rechercher...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.ok': 'OK',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.warning': 'Avertissement',
    'common.info': 'Information',
    
    'nav.dashboard': 'Tableau de bord',
    'nav.tenants': 'Locataires',
    'nav.agent': 'Espace Agent',
    'nav.flows': 'Concepteur de flux',
    'nav.forms': 'Formulaires',
    'nav.tasks': 'Tâches',
    'nav.analytics': 'Analytique',
    'nav.settings': 'Paramètres',
    
    'settings.branding': 'Marque',
    'settings.ai': 'Assistant IA',
    'settings.notifications': 'Notifications',
    'settings.costs': 'Coûts',
    'settings.users': 'Utilisateurs',
    'settings.localization': 'Localisation',
    'settings.systemUpdate': 'Mise à jour du système',
    
    'auth.login': 'Connexion',
    'auth.logout': 'Déconnexion',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.forgotPassword': 'Mot de passe oublié?',
    'auth.rememberMe': 'Se souvenir de moi',
    'auth.profile': 'Profil',
    'auth.myAccount': 'Mon compte',
    
    'dashboard.title': 'Tableau de bord',
    'dashboard.welcome': 'Bienvenue',
    'dashboard.totalMessages': 'Total des messages',
    'dashboard.activeChats': 'Discussions actives',
    'dashboard.pendingTasks': 'Tâches en attente',
    'dashboard.recentActivity': 'Activité récente',
    
    'agent.title': 'Espace Agent',
    'agent.contacts': 'Contacts',
    'agent.chats': 'Discussions',
    'agent.typeMessage': 'Tapez un message...',
    'agent.send': 'Envoyer',
    'agent.quickReplies': 'Réponses rapides',
    'agent.voiceNote': 'Note vocale',
    'agent.recording': 'Enregistrement...',
    'agent.maxDuration': 'Durée maximale: 3 minutes',
    
    'tasks.title': 'Gestion des tâches',
    'tasks.addTask': 'Ajouter une tâche',
    'tasks.editTask': 'Modifier la tâche',
    'tasks.taskTitle': 'Titre',
    'tasks.description': 'Description',
    'tasks.priority': 'Priorité',
    'tasks.status': 'Statut',
    'tasks.dueDate': 'Date d\'échéance',
    'tasks.assignTo': 'Assigner à',
    'tasks.createTask': 'Créer une tâche',
    'tasks.updateTask': 'Mettre à jour la tâche',
    'tasks.noDueDate': 'Pas de date d\'échéance',
    'tasks.unassigned': 'Non assigné',
    'tasks.filterByStatus': 'Filtrer par statut',
    'tasks.allTasks': 'Toutes les tâches',
    
    'notifications.title': 'Paramètres de notification',
    'notifications.sound': 'Notifications sonores',
    'notifications.browser': 'Notifications du navigateur',
    'notifications.email': 'Notifications par email',
    'notifications.enable': 'Activer',
    'notifications.volume': 'Volume',
    
    'language.title': 'Langue',
    'language.english': 'Anglais',
    'language.french': 'Français',
    'language.arabic': 'Arabe',
    'language.select': 'Sélectionner la langue',
    
    'systemUpdate.title': 'Mise à jour du système',
    'systemUpdate.currentVersion': 'Version actuelle',
    'systemUpdate.latestVersion': 'Dernière version',
    'systemUpdate.updateAvailable': 'Mise à jour disponible',
    'systemUpdate.noUpdateAvailable': 'Aucune mise à jour disponible',
    'systemUpdate.checkForUpdates': 'Vérifier les mises à jour',
    'systemUpdate.installUpdate': 'Installer la mise à jour',
    'systemUpdate.releaseNotes': 'Notes de version',
    'systemUpdate.backups': 'Sauvegardes du système',
    'systemUpdate.createBackup': 'Créer une sauvegarde',
    'systemUpdate.restoreBackup': 'Restaurer à partir d\'une sauvegarde',
    'systemUpdate.backupCreated': 'Sauvegarde créée',
    'systemUpdate.updateStarted': 'Mise à jour démarrée',
    'systemUpdate.updateComplete': 'Mise à jour terminée',
    'systemUpdate.updateFailed': 'Échec de la mise à jour',
    'systemUpdate.confirmUpdate': 'Êtes-vous sûr de vouloir mettre à jour le système?',
    'systemUpdate.confirmRestore': 'Êtes-vous sûr de vouloir restaurer à partir de cette sauvegarde?',
    
    'tenants.title': 'Locataires',
    'tenants.addTenant': 'Ajouter un locataire',
    'tenants.editTenant': 'Modifier le locataire',
    'tenants.addTenantDescription': 'Ajouter un nouveau locataire à la plateforme',
    'tenants.editTenantDescription': 'Modifier les informations du locataire existant',
    'tenants.viewTenantDescription': 'Voir les détails du locataire',
    'tenants.generalInfo': 'Informations générales',
    'tenants.whatsappAccounts': 'Comptes WhatsApp',
    'tenants.webhookSettings': 'Paramètres Webhook',
    'tenants.basicInfo': 'Informations de base',
    'tenants.name': 'Nom',
    'tenants.businessId': 'ID d\'entreprise',
    'tenants.organization': 'Organisation',
    'tenants.email': 'Email',
    'tenants.phone': 'Téléphone',
    'tenants.mobile': 'Mobile',
    'tenants.privateNotes': 'Notes privées',
    'tenants.businessName': 'Nom de l\'entreprise',
    'tenants.phoneNumber': 'Numéro de téléphone',
    'tenants.status': 'Statut',
    'tenants.verified': 'Vérifié',
    'tenants.pending': 'En attente',
    'tenants.noAccounts': 'Aucun compte WhatsApp trouvé',
    'common.active': 'Actif',
    'common.inactive': 'Inactif',
    'common.status': 'Statut'
  },
  ar: {
    'app.name': 'آي ميكس CRM بواسطة IPROD',
    'common.search': 'بحث...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.ok': 'موافق',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    'common.warning': 'تحذير',
    'common.info': 'معلومات',
    
    'nav.dashboard': 'لوحة التحكم',
    'nav.tenants': 'المستأجرين',
    'nav.agent': 'مساحة الوكيل',
    'nav.flows': 'مصمم التدفق',
    'nav.forms': 'النماذج',
    'nav.tasks': 'المهام',
    'nav.analytics': 'التحليلات',
    'nav.settings': 'الإعدادات',
    
    'settings.branding': 'العلامة التجارية',
    'settings.ai': 'مساعد الذكاء الاصطناعي',
    'settings.notifications': 'الإشعارات',
    'settings.costs': 'التكاليف',
    'settings.users': 'المستخدمين',
    'settings.localization': 'التوطين',
    'settings.systemUpdate': 'تحديث النظام',
    
    'auth.login': 'تسجيل الدخول',
    'auth.logout': 'تسجيل الخروج',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.rememberMe': 'تذكرني',
    'auth.profile': 'الملف الشخصي',
    'auth.myAccount': 'حسابي',
    
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcome': 'مرحبًا',
    'dashboard.totalMessages': 'إجمالي الرسائل',
    'dashboard.activeChats': 'المحادثات النشطة',
    'dashboard.pendingTasks': 'المهام المعلقة',
    'dashboard.recentActivity': 'النشاط الأخير',
    
    'agent.title': 'مساحة الوكيل',
    'agent.contacts': 'جهات الاتصال',
    'agent.chats': 'المحادثات',
    'agent.typeMessage': 'اكتب رسالة...',
    'agent.send': 'إرسال',
    'agent.quickReplies': 'ردود سريعة',
    'agent.voiceNote': 'ملاحظة صوتية',
    'agent.recording': 'جاري التسجيل...',
    'agent.maxDuration': 'المدة القصوى: 3 دقائق',
    
    'tasks.title': 'إدارة المهام',
    'tasks.addTask': 'إضافة مهمة',
    'tasks.editTask': 'تعديل المهمة',
    'tasks.taskTitle': 'العنوان',
    'tasks.description': 'الوصف',
    'tasks.priority': 'الأولوية',
    'tasks.status': 'الحالة',
    'tasks.dueDate': 'تاريخ الاستحقاق',
    'tasks.assignTo': 'تعيين إلى',
    'tasks.createTask': 'إنشاء مهمة',
    'tasks.updateTask': 'تحديث المهمة',
    'tasks.noDueDate': 'لا يوجد تاريخ استحقاق',
    'tasks.unassigned': 'غير معين',
    'tasks.filterByStatus': 'تصفية حسب الحالة',
    'tasks.allTasks': 'جميع المهام',
    
    'notifications.title': 'إعدادات الإشعارات',
    'notifications.sound': 'إشعارات صوتية',
    'notifications.browser': 'إشعارات المتصفح',
    'notifications.email': 'إشعارات البريد الإلكتروني',
    'notifications.enable': 'تمكين',
    'notifications.volume': 'الصوت',
    
    'language.title': 'اللغة',
    'language.english': 'الإنجليزية',
    'language.french': 'الفرنسية',
    'language.arabic': 'العربية',
    'language.select': 'اختر اللغة',
    
    'systemUpdate.title': 'تحديث النظام',
    'systemUpdate.currentVersion': 'الإصدار الحالي',
    'systemUpdate.latestVersion': 'أحدث إصدار',
    'systemUpdate.updateAvailable': 'تحديث متاح',
    'systemUpdate.noUpdateAvailable': 'لا يوجد تحديث متاح',
    'systemUpdate.checkForUpdates': 'التحقق من التحديثات',
    'systemUpdate.installUpdate': 'تثبيت التحديث',
    'systemUpdate.releaseNotes': 'ملاحظات الإصدار',
    'systemUpdate.backups': 'نسخ احتياطية للنظام',
    'systemUpdate.createBackup': 'إنشاء نسخة احتياطية',
    'systemUpdate.restoreBackup': 'استعادة من نسخة احتياطية',
    'systemUpdate.backupCreated': 'تم إنشاء نسخة احتياطية',
    'systemUpdate.updateStarted': 'بدأ التحديث',
    'systemUpdate.updateComplete': 'اكتمل التحديث',
    'systemUpdate.updateFailed': 'فشل التحديث',
    'systemUpdate.confirmUpdate': 'هل أنت متأكد أنك تريد تحديث النظام؟',
    'systemUpdate.confirmRestore': 'هل أنت متأكد أنك تريد الاستعادة من هذه النسخة الاحتياطية؟',
    
    'tenants.title': 'المستأجرين',
    'tenants.addTenant': 'إضافة مستأجر',
    'tenants.editTenant': 'تعديل المستأجر',
    'tenants.addTenantDescription': 'إضافة مستأجر جديد إلى المنصة',
    'tenants.editTenantDescription': 'تعديل معلومات المستأجر الحالي',
    'tenants.viewTenantDescription': 'عرض تفاصيل المستأجر',
    'tenants.generalInfo': 'معلومات عامة',
    'tenants.whatsappAccounts': 'حسابات واتساب',
    'tenants.webhookSettings': 'إعدادات Webhook',
    'tenants.basicInfo': 'معلومات أساسية',
    'tenants.name': 'الاسم',
    'tenants.businessId': 'معرف الأعمال',
    'tenants.organization': 'المؤسسة',
    'tenants.email': 'البريد الإلكتروني',
    'tenants.phone': 'الهاتف',
    'tenants.mobile': 'الجوال',
    'tenants.privateNotes': 'ملاحظات خاصة',
    'tenants.businessName': 'اسم العمل',
    'tenants.phoneNumber': 'رقم الهاتف',
    'tenants.status': 'الحالة',
    'tenants.verified': 'تم التحقق',
    'tenants.pending': 'قيد الانتظار',
    'tenants.noAccounts': 'لم يتم العثور على حسابات واتساب',
    'common.active': 'نشط',
    'common.inactive': 'غير نشط',
    'common.status': 'الحالة'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  dir: string;
  languages: Language[];
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  dir: 'ltr',
  languages: ['en', 'fr', 'ar'],
  isRTL: false
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const fetchUserLanguage = async () => {
      try {
        const storedLanguage = localStorage.getItem('language') as Language;
        
        if (storedLanguage && ['en', 'fr', 'ar'].includes(storedLanguage)) {
          setLanguage(storedLanguage);
          setIsLoaded(true);
          return;
        }
        
        const user = await getCurrentUser();
        
        if (user?.languagePreference) {
          setLanguage(user.languagePreference);
        }
        
      } catch (error) {
        console.error('Failed to fetch user language preference', error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    fetchUserLanguage();
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('language', language);
      
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      
      document.documentElement.classList.remove('lang-en', 'lang-fr', 'lang-ar');
      document.documentElement.classList.add(`lang-${language}`);
    }
  }, [isLoaded, language]);
  
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';
  const languages: Language[] = ['en', 'fr', 'ar'];
  
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };
  
  const t = (key: string): string => {
    const langTranslations = translations[language] as Record<string, string>;
    return langTranslations[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      t, 
      dir, 
      languages, 
      isRTL 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
