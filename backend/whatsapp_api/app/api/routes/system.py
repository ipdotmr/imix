from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import Dict, List, Optional

from app.api.deps import get_current_admin_user
from app.models.user import User
from app.core.config import app_settings
from app.services.app_updater import AppUpdater

router = APIRouter()

@router.get("/update/check", response_model=Dict)
async def check_for_updates(
    current_user: User = Depends(get_current_admin_user)
):
    """
    Check if a newer version of the application is available.
    Only accessible to admin users.
    """
    app_updater = AppUpdater(app_settings)
    return await app_updater.check_for_updates()

@router.post("/update/install", response_model=Dict)
async def install_update(
    background_tasks: BackgroundTasks,
    download_url: str,
    checksum: str,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Download and install a new version of the application.
    Creates a backup before installing the update.
    Only accessible to admin users.
    """
    app_updater = AppUpdater(app_settings)
    
    backup_path = await app_updater.create_backup()
    
    zip_path = await app_updater.download_update(download_url, checksum)
    
    background_tasks.add_task(app_updater.install_update, zip_path, backup_path)
    
    return {
        "success": True,
        "message": "Update installation started in the background",
        "backup_path": backup_path
    }

@router.get("/update/backups", response_model=List[Dict])
async def list_backups(
    current_user: User = Depends(get_current_admin_user)
):
    """
    List all available backups.
    Only accessible to admin users.
    """
    import os
    
    app_updater = AppUpdater(app_settings)
    backups = []
    
    if os.path.exists(app_updater.backup_dir):
        for filename in os.listdir(app_updater.backup_dir):
            if filename.startswith("backup_") and filename.endswith(".zip"):
                try:
                    parts = filename.split('_')
                    if len(parts) >= 3:
                        version = parts[1]
                        timestamp_parts = parts[2].split('.')
                        timestamp = timestamp_parts[0]
                        
                        formatted_timestamp = f"{timestamp[:4]}-{timestamp[4:6]}-{timestamp[6:8]} {timestamp[9:11]}:{timestamp[11:13]}:{timestamp[13:15]}"
                        
                        backups.append({
                            "filename": filename,
                            "version": version,
                            "timestamp": formatted_timestamp,
                            "path": os.path.join(app_updater.backup_dir, filename),
                            "size_mb": round(os.path.getsize(os.path.join(app_updater.backup_dir, filename)) / (1024 * 1024), 2)
                        })
                except Exception as e:
                    continue
    
    backups.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return backups

@router.post("/update/restore", response_model=Dict)
async def restore_from_backup(
    backup_filename: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Restore the application from a backup.
    Only accessible to admin users.
    """
    import os
    
    app_updater = AppUpdater(app_settings)
    backup_path = os.path.join(app_updater.backup_dir, backup_filename)
    
    if not os.path.exists(backup_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup file not found"
        )
    
    background_tasks.add_task(app_updater.restore_from_backup, backup_path)
    
    return {
        "success": True,
        "message": "Restoration started in the background",
        "backup_path": backup_path
    }
