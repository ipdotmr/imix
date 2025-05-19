import os
import shutil
import zipfile
import requests
import logging
import tempfile
import hashlib
import datetime
from typing import Dict, Optional, Tuple
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)

class AppUpdater:
    """
    Service for handling application updates from a remote zip file.
    Includes version checking, downloading, backup creation, and update installation.
    """
    
    def __init__(self, app_settings):
        self.app_settings = app_settings
        self.app_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
        self.backup_dir = os.path.join(self.app_root, "backups")
        
        if not os.path.exists(self.backup_dir):
            os.makedirs(self.backup_dir)
    
    async def check_for_updates(self) -> Dict:
        """
        Check if a newer version is available from the update server.
        Returns information about the available update.
        """
        try:
            current_version = self._get_current_version()
            
            response = requests.get(f"{self.app_settings.update_server_url}/version.json")
            response.raise_for_status()
            
            version_info = response.json()
            latest_version = version_info.get("version")
            
            update_available = self._compare_versions(current_version, latest_version)
            
            return {
                "current_version": current_version,
                "latest_version": latest_version,
                "update_available": update_available,
                "release_notes": version_info.get("release_notes", ""),
                "release_date": version_info.get("release_date", ""),
                "download_url": version_info.get("download_url", ""),
                "checksum": version_info.get("checksum", "")
            }
        except Exception as e:
            logger.error(f"Error checking for updates: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to check for updates: {str(e)}"
            )
    
    async def download_update(self, download_url: str, checksum: str) -> str:
        """
        Download the update zip file and verify its checksum.
        Returns the path to the downloaded file.
        """
        try:
            temp_dir = tempfile.mkdtemp()
            zip_path = os.path.join(temp_dir, "update.zip")
            
            logger.info(f"Downloading update from {download_url}")
            response = requests.get(download_url, stream=True)
            response.raise_for_status()
            
            with open(zip_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            if not self._verify_checksum(zip_path, checksum):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Update file checksum verification failed"
                )
            
            return zip_path
        except Exception as e:
            logger.error(f"Error downloading update: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to download update: {str(e)}"
            )
    
    async def create_backup(self) -> str:
        """
        Create a backup of the current application.
        Returns the path to the backup file.
        """
        try:
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            current_version = self._get_current_version()
            backup_filename = f"backup_{current_version}_{timestamp}.zip"
            backup_path = os.path.join(self.backup_dir, backup_filename)
            
            logger.info(f"Creating backup at {backup_path}")
            
            with zipfile.ZipFile(backup_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for directory in ['frontend', 'backend']:
                    dir_path = os.path.join(self.app_root, directory)
                    if os.path.exists(dir_path):
                        for root, _, files in os.walk(dir_path):
                            for file in files:
                                file_path = os.path.join(root, file)
                                arcname = os.path.relpath(file_path, self.app_root)
                                zipf.write(file_path, arcname)
            
            return backup_path
        except Exception as e:
            logger.error(f"Error creating backup: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create backup: {str(e)}"
            )
    
    async def install_update(self, zip_path: str, backup_path: str) -> Dict:
        """
        Install the update from the downloaded zip file.
        Returns information about the update installation.
        """
        try:
            logger.info(f"Installing update from {zip_path}")
            
            with zipfile.ZipFile(zip_path, 'r') as zipf:
                temp_extract_dir = tempfile.mkdtemp()
                zipf.extractall(temp_extract_dir)
                
                for item in os.listdir(temp_extract_dir):
                    item_path = os.path.join(temp_extract_dir, item)
                    dest_path = os.path.join(self.app_root, item)
                    
                    if os.path.isdir(item_path):
                        if os.path.exists(dest_path):
                            shutil.rmtree(dest_path)
                        shutil.copytree(item_path, dest_path)
                    else:
                        shutil.copy2(item_path, dest_path)
            
            shutil.rmtree(temp_extract_dir)
            os.remove(zip_path)
            
            new_version = self._get_current_version()
            
            return {
                "success": True,
                "previous_version": self._get_version_from_backup_path(backup_path),
                "new_version": new_version,
                "backup_path": backup_path,
                "update_time": datetime.datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error installing update: {str(e)}")
            
            try:
                await self.restore_from_backup(backup_path)
                detail = f"Update failed and system was restored from backup: {str(e)}"
            except Exception as restore_error:
                detail = f"Update failed and backup restoration also failed: {str(e)}. Restoration error: {str(restore_error)}"
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=detail
            )
    
    async def restore_from_backup(self, backup_path: str) -> Dict:
        """
        Restore the application from a backup file.
        Returns information about the restoration.
        """
        try:
            logger.info(f"Restoring from backup {backup_path}")
            
            with zipfile.ZipFile(backup_path, 'r') as zipf:
                zipf.extractall(self.app_root)
            
            return {
                "success": True,
                "restored_version": self._get_version_from_backup_path(backup_path),
                "restore_time": datetime.datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error restoring from backup: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to restore from backup: {str(e)}"
            )
    
    def _get_current_version(self) -> str:
        """
        Get the current application version from the version file.
        """
        version_file = os.path.join(self.app_root, "version.txt")
        
        if os.path.exists(version_file):
            with open(version_file, 'r') as f:
                return f.read().strip()
        
        return "0.0.0"  # Default version if version file doesn't exist
    
    def _compare_versions(self, current: str, latest: str) -> bool:
        """
        Compare version strings to determine if an update is available.
        Returns True if the latest version is newer than the current version.
        """
        current_parts = [int(x) for x in current.split('.')]
        latest_parts = [int(x) for x in latest.split('.')]
        
        while len(current_parts) < 3:
            current_parts.append(0)
        while len(latest_parts) < 3:
            latest_parts.append(0)
        
        for i in range(3):
            if latest_parts[i] > current_parts[i]:
                return True
            elif latest_parts[i] < current_parts[i]:
                return False
        
        return False  # Versions are equal
    
    def _verify_checksum(self, file_path: str, expected_checksum: str) -> bool:
        """
        Verify the SHA-256 checksum of a file.
        """
        sha256_hash = hashlib.sha256()
        
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        
        calculated_checksum = sha256_hash.hexdigest()
        return calculated_checksum.lower() == expected_checksum.lower()
    
    def _get_version_from_backup_path(self, backup_path: str) -> str:
        """
        Extract version information from a backup filename.
        """
        try:
            filename = os.path.basename(backup_path)
            parts = filename.split('_')
            if len(parts) >= 2:
                return parts[1]
        except Exception:
            pass
        
        return "unknown"
