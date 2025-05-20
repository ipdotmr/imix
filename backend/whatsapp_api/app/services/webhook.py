from uuid import uuid4
import secrets
import string
from typing import Dict

def generate_webhook_credentials() -> Dict[str, str]:
    """
    Generate secure webhook URI, token and secret.
    
    Returns:
        Dict containing webhook_uri, webhook_token, and webhook_secret
    """
    webhook_id = str(uuid4())
    
    webhook_uri = f"https://apimix.ip.mr/api/webhook/{webhook_id}"
    
    token_chars = string.ascii_letters + string.digits
    webhook_token = ''.join(secrets.choice(token_chars) for _ in range(32))
    
    webhook_secret = secrets.token_hex(16)
    
    return {
        "webhook_uri": webhook_uri,
        "webhook_token": webhook_token,
        "webhook_secret": webhook_secret
    }
