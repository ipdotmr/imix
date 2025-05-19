import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../../components/ui/dialog";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowUpCircle,
  RotateCcw,
  Clock,
  Info
} from "lucide-react";
import { useLanguage } from "../../providers/LanguageProvider";
import api from "../../services/api";

interface UpdateInfo {
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  releaseNotes: string;
  releaseDate: string;
  downloadUrl: string;
  checksum: string;
}

interface BackupInfo {
  filename: string;
  version: string;
  timestamp: string;
  path: string;
  sizeMb: number;
}

const SystemUpdateSettings: React.FC = () => {
  const { t, language } = useLanguage();
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'downloading' | 'installing' | 'success' | 'error'>('idle');
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupInfo | null>(null);
  const [releaseNotesDialogOpen, setReleaseNotesDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchBackups();
  }, []);
  
  const fetchUpdateInfo = async () => {
    setIsChecking(true);
    setUpdateError(null);
    
    try {
      const response = await api.get('/api/system/update/check');
      setUpdateInfo(response.data);
    } catch (error) {
      console.error('Failed to check for updates', error);
      setUpdateError(t('systemUpdate.checkError'));
    } finally {
      setIsChecking(false);
    }
  };
  
  const fetchBackups = async () => {
    try {
      const response = await api.get('/api/system/update/backups');
      setBackups(response.data);
    } catch (error) {
      console.error('Failed to fetch backups', error);
    }
  };
  
  const handleInstallUpdate = async () => {
    if (!updateInfo) return;
    
    setIsUpdating(true);
    setUpdateStatus('downloading');
    setUpdateProgress(10);
    setUpdateError(null);
    setConfirmDialogOpen(false);
    
    try {
      await api.post('/api/system/update/install', {
        download_url: updateInfo.downloadUrl,
        checksum: updateInfo.checksum
      });
      
      setUpdateProgress(30);
      setUpdateStatus('installing');
      
      const checkInterval = setInterval(async () => {
        try {
          const healthCheck = await api.get('/healthz');
          
          if (healthCheck.status === 200) {
            setUpdateProgress(prev => Math.min(prev + 10, 90));
            
            if (updateProgress >= 90) {
              clearInterval(checkInterval);
              setUpdateProgress(100);
              setUpdateStatus('success');
              setIsUpdating(false);
              
              fetchUpdateInfo();
              fetchBackups();
            }
          }
        } catch (error) {
          setUpdateProgress(95);
        }
      }, 2000);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        if (updateStatus !== 'success') {
          setUpdateProgress(100);
          setUpdateStatus('success');
          setIsUpdating(false);
          
          fetchUpdateInfo();
          fetchBackups();
        }
      }, 30000);
      
    } catch (error) {
      console.error('Failed to install update', error);
      setUpdateError(t('systemUpdate.installError'));
      setUpdateStatus('error');
      setIsUpdating(false);
    }
  };
  
  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;
    
    setIsRestoring(true);
    setUpdateStatus('installing');
    setUpdateProgress(10);
    setUpdateError(null);
    setRestoreDialogOpen(false);
    
    try {
      await api.post('/api/system/update/restore', {
        backup_filename: selectedBackup.filename
      });
      
      setUpdateProgress(30);
      
      const checkInterval = setInterval(async () => {
        try {
          const healthCheck = await api.get('/healthz');
          
          if (healthCheck.status === 200) {
            setUpdateProgress(prev => Math.min(prev + 10, 90));
            
            if (updateProgress >= 90) {
              clearInterval(checkInterval);
              setUpdateProgress(100);
              setUpdateStatus('success');
              setIsRestoring(false);
              
              fetchUpdateInfo();
            }
          }
        } catch (error) {
          setUpdateProgress(95);
        }
      }, 2000);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        if (updateStatus !== 'success') {
          setUpdateProgress(100);
          setUpdateStatus('success');
          setIsRestoring(false);
          
          fetchUpdateInfo();
        }
      }, 30000);
      
    } catch (error) {
      console.error('Failed to restore backup', error);
      setUpdateError(t('systemUpdate.restoreError'));
      setUpdateStatus('error');
      setIsRestoring(false);
    }
  };
  
  const openConfirmDialog = () => {
    if (!updateInfo) return;
    setConfirmDialogOpen(true);
  };
  
  const openRestoreDialog = (backup: BackupInfo) => {
    setSelectedBackup(backup);
    setRestoreDialogOpen(true);
  };
  
  const renderUpdateStatus = () => {
    if (isUpdating || isRestoring) {
      return (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>
              {isUpdating 
                ? t('systemUpdate.updatingTitle') 
                : t('systemUpdate.restoringTitle')}
            </CardTitle>
            <CardDescription>
              {isUpdating 
                ? t('systemUpdate.updatingDescription') 
                : t('systemUpdate.restoringDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={updateProgress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  {updateStatus === 'downloading' && (
                    <>
                      <Download size={16} className="mr-2" />
                      {t('systemUpdate.downloading')}
                    </>
                  )}
                  {updateStatus === 'installing' && (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      {isUpdating 
                        ? t('systemUpdate.installing') 
                        : t('systemUpdate.restoring')}
                    </>
                  )}
                  {updateStatus === 'success' && (
                    <>
                      <CheckCircle2 size={16} className="mr-2 text-green-500" />
                      {isUpdating 
                        ? t('systemUpdate.installSuccess') 
                        : t('systemUpdate.restoreSuccess')}
                    </>
                  )}
                  {updateStatus === 'error' && (
                    <>
                      <XCircle size={16} className="mr-2 text-red-500" />
                      {t('systemUpdate.error')}
                    </>
                  )}
                </div>
                <div>{updateProgress}%</div>
              </div>
              
              {updateError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{t('systemUpdate.errorTitle')}</AlertTitle>
                  <AlertDescription>{updateError}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return null;
  };
  
  return (
    <div className={`container mx-auto py-6 ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('systemUpdate.title')}</h1>
          <p className="text-gray-500">{t('systemUpdate.description')}</p>
        </div>
        <Button 
          onClick={fetchUpdateInfo} 
          disabled={isChecking}
          className="flex items-center"
        >
          {isChecking ? (
            <RefreshCw size={16} className="mr-2 animate-spin" />
          ) : (
            <RefreshCw size={16} className="mr-2" />
          )}
          {t('systemUpdate.checkForUpdates')}
        </Button>
      </div>
      
      {renderUpdateStatus()}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('systemUpdate.currentVersion')}</CardTitle>
              <CardDescription>
                {updateInfo 
                  ? `${t('systemUpdate.versionInfo')}: ${updateInfo.currentVersion}` 
                  : t('systemUpdate.versionUnknown')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {updateInfo ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{t('systemUpdate.latestVersion')}</p>
                      <p className="text-2xl font-bold">{updateInfo.latestVersion}</p>
                      {updateInfo.releaseDate && (
                        <p className="text-sm text-gray-500">
                          {`${t('systemUpdate.releasedOn')}: ${updateInfo.releaseDate}`}
                        </p>
                      )}
                    </div>
                    <div>
                      {updateInfo.updateAvailable ? (
                        <Badge className="bg-green-500">
                          {t('systemUpdate.updateAvailable')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-500 border-green-500">
                          {t('systemUpdate.upToDate')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {updateInfo.releaseNotes && (
                    <div>
                      <Button 
                        variant="outline" 
                        onClick={() => setReleaseNotesDialogOpen(true)}
                        className="mt-2"
                      >
                        <Info size={16} className="mr-2" />
                        {t('systemUpdate.viewReleaseNotes')}
                      </Button>
                    </div>
                  )}
                  
                  {updateInfo.updateAvailable && (
                    <div className="pt-4">
                      <Button onClick={openConfirmDialog} className="w-full">
                        <ArrowUpCircle size={16} className="mr-2" />
                        {t('systemUpdate.installUpdate')}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {isChecking ? (
                    <div className="flex flex-col items-center">
                      <RefreshCw size={24} className="animate-spin mb-2" />
                      {t('systemUpdate.checking')}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Info size={24} className="mb-2" />
                      {t('systemUpdate.checkToSeeUpdates')}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('systemUpdate.backups')}</CardTitle>
              <CardDescription>
                {t('systemUpdate.backupsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {backups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock size={24} className="mx-auto mb-2" />
                  {t('systemUpdate.noBackups')}
                </div>
              ) : (
                <div className="space-y-4">
                  {backups.map((backup, index) => (
                    <div 
                      key={backup.filename} 
                      className={`p-3 rounded-lg border ${
                        index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {`${t('systemUpdate.version')}: ${backup.version}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {backup.timestamp}
                          </p>
                          <p className="text-xs text-gray-400">
                            {`${t('systemUpdate.size')}: ${backup.sizeMb} MB`}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openRestoreDialog(backup)}
                        >
                          <RotateCcw size={14} className="mr-1" />
                          {t('systemUpdate.restore')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Confirm Update Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('systemUpdate.confirmUpdateTitle')}</DialogTitle>
            <DialogDescription>
              {t('systemUpdate.confirmUpdateDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('systemUpdate.warning')}</AlertTitle>
              <AlertDescription>
                {t('systemUpdate.backupCreatedWarning')}
              </AlertDescription>
            </Alert>
            
            <div className="mt-4">
              <p className="text-sm font-medium">{t('systemUpdate.currentVersion')}</p>
              <p className="text-lg">{updateInfo?.currentVersion}</p>
              
              <div className="flex items-center my-2">
                <ArrowUpCircle size={16} className="mx-4 text-green-500" />
              </div>
              
              <p className="text-sm font-medium">{t('systemUpdate.newVersion')}</p>
              <p className="text-lg">{updateInfo?.latestVersion}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleInstallUpdate}>
              {t('systemUpdate.proceedWithUpdate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Restore Backup Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('systemUpdate.confirmRestoreTitle')}</DialogTitle>
            <DialogDescription>
              {t('systemUpdate.confirmRestoreDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('systemUpdate.warning')}</AlertTitle>
              <AlertDescription>
                {t('systemUpdate.restoreWarning')}
              </AlertDescription>
            </Alert>
            
            {selectedBackup && (
              <div className="mt-4">
                <p className="text-sm font-medium">{t('systemUpdate.currentVersion')}</p>
                <p className="text-lg">{updateInfo?.currentVersion || t('systemUpdate.unknown')}</p>
                
                <div className="flex items-center my-2">
                  <RotateCcw size={16} className="mx-4 text-amber-500" />
                </div>
                
                <p className="text-sm font-medium">{t('systemUpdate.restoreToVersion')}</p>
                <p className="text-lg">{selectedBackup.version}</p>
                <p className="text-sm text-gray-500">{selectedBackup.timestamp}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRestoreBackup}
            >
              {t('systemUpdate.proceedWithRestore')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Release Notes Dialog */}
      <Dialog open={releaseNotesDialogOpen} onOpenChange={setReleaseNotesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {`${t('systemUpdate.releaseNotesTitle')}: ${updateInfo?.latestVersion}`}
            </DialogTitle>
            <DialogDescription>
              {`${t('systemUpdate.releasedOn')}: ${updateInfo?.releaseDate}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {updateInfo?.releaseNotes ? (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: updateInfo.releaseNotes }} />
            ) : (
              <p className="text-gray-500">{t('systemUpdate.noReleaseNotes')}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setReleaseNotesDialogOpen(false)}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemUpdateSettings;
