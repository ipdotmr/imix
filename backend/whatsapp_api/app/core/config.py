from pydantic import BaseSettings

class Settings(BaseSettings):
    app_name: str = "iMix CRM by IPROD"
    mongodb_uri: str = "mongodb://localhost:27017"
    db_name: str = "whatsapp_api"
    secret_key: str = "your-secret-key-here"
    token_url: str = "/auth/token"
    access_token_expire_minutes: int = 60 * 24  # 1 day
    update_server_url: str = "https://updates.imix.ip.mr"  # URL for update server
    
    class Config:
        env_file = ".env"

app_settings = Settings()
