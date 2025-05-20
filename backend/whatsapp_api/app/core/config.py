from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "iMix CRM by IPROD"
    mongodb_uri: str = "mongodb://localhost:27017"
    db_name: str = "imix_crm"  # Changed to match the actual database name
    secret_key: str = "your-secret-key-here"
    token_url: str = "/auth/token"
    access_token_expire_minutes: int = 60 * 24  # 1 day
    update_server_url: str = "https://updates.imix.ip.mr"  # URL for update server
    whatsapp_api_base_url: str = "https://graph.facebook.com/v16.0"
    api_url: str = "https://apimix.ip.mr"
    frontend_url: str = "https://imix.ip.mr"
    
    class Config:
        env_file = ".env"
        extra = "allow"  # Allow extra fields from .env file

app_settings = Settings()
