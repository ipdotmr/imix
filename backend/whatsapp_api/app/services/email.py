import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional, Dict, Any

from app.models.tenant import Tenant, EmailSettings

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self, tenant: Tenant):
        if not tenant.email_settings:
            raise ValueError("Tenant does not have email settings configured")
        
        self.settings = tenant.email_settings
        self.tenant = tenant
    
    async def send_email(
        self, 
        to_email: str, 
        subject: str, 
        html_content: str, 
        text_content: Optional[str] = None,
        cc: Optional[List[str]] = None,
        bcc: Optional[List[str]] = None
    ) -> bool:
        """
        Send an email using the tenant's SMTP settings
        """
        if not self.settings.notification_enabled:
            logger.info(f"Email notifications disabled for tenant {self.tenant.id}")
            return False
        
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.settings.from_email
            msg['To'] = to_email
            
            if cc:
                msg['Cc'] = ", ".join(cc)
            
            if bcc:
                msg['Bcc'] = ", ".join(bcc)
            
            if text_content:
                msg.attach(MIMEText(text_content, 'plain'))
            
            msg.attach(MIMEText(html_content, 'html'))
            
            with smtplib.SMTP(self.settings.smtp_server, self.settings.smtp_port) as server:
                if self.settings.use_tls:
                    server.starttls()
                
                server.login(self.settings.smtp_username, self.settings.smtp_password)
                
                recipients = [to_email]
                if cc:
                    recipients.extend(cc)
                if bcc:
                    recipients.extend(bcc)
                
                server.sendmail(self.settings.from_email, recipients, msg.as_string())
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False
    
    async def send_welcome_email(self, user_email: str, user_name: str, password: str) -> bool:
        """
        Send a welcome email to a new user
        """
        subject = f"Welcome to {self.tenant.name} on iMix CRM by IPROD"
        
        if self.settings.welcome_template:
            html_content = self.settings.welcome_template.format(
                user_name=user_name,
                tenant_name=self.tenant.name,
                password=password
            )
        else:
            html_content = f"""
            <html>
                <body>
                    <h1>Welcome to {self.tenant.name} on iMix CRM by IPROD</h1>
                    <p>Hello {user_name},</p>
                    <p>Your account has been created on the iMix CRM platform.</p>
                    <p>Your temporary password is: <strong>{password}</strong></p>
                    <p>Please login and change your password as soon as possible.</p>
                    <p>Best regards,<br>{self.tenant.name} Team</p>
                </body>
            </html>
            """
        
        text_content = f"""
        Welcome to {self.tenant.name} on iMix CRM by IPROD
        
        Hello {user_name},
        
        Your account has been created on the iMix CRM platform.
        Your temporary password is: {password}
        
        Please login and change your password as soon as possible.
        
        Best regards,
        {self.tenant.name} Team
        """
        
        return await self.send_email(user_email, subject, html_content, text_content)
    
    async def send_message_notification(
        self, 
        user_email: str, 
        user_name: str, 
        contact_name: str,
        message_preview: str
    ) -> bool:
        """
        Send a notification about a new message
        """
        subject = f"New Message from {contact_name} - iMix CRM by IPROD"
        
        if self.settings.message_notification_template:
            html_content = self.settings.message_notification_template.format(
                user_name=user_name,
                tenant_name=self.tenant.name,
                contact_name=contact_name,
                message_preview=message_preview
            )
        else:
            html_content = f"""
            <html>
                <body>
                    <h1>New Message Received</h1>
                    <p>Hello {user_name},</p>
                    <p>You have received a new message from <strong>{contact_name}</strong>:</p>
                    <p style="padding: 10px; background-color: #f5f5f5; border-left: 4px solid #007bff;">
                        {message_preview}
                    </p>
                    <p>Login to iMix CRM to respond.</p>
                    <p>Best regards,<br>{self.tenant.name} Team</p>
                </body>
            </html>
            """
        
        text_content = f"""
        New Message Received
        
        Hello {user_name},
        
        You have received a new message from {contact_name}:
        
        "{message_preview}"
        
        Login to iMix CRM to respond.
        
        Best regards,
        {self.tenant.name} Team
        """
        
        return await self.send_email(user_email, subject, html_content, text_content)
    
    async def send_task_assignment_notification(
        self,
        user_email: str,
        user_name: str,
        task_title: str,
        task_description: str,
        due_date: Optional[str] = None
    ) -> bool:
        """
        Send a notification about a new task assignment
        """
        subject = f"New Task Assigned - iMix CRM by IPROD"
        
        due_date_html = f"<p><strong>Due Date:</strong> {due_date}</p>" if due_date else ""
        due_date_text = f"Due Date: {due_date}\n" if due_date else ""
        
        html_content = f"""
        <html>
            <body>
                <h1>New Task Assigned</h1>
                <p>Hello {user_name},</p>
                <p>You have been assigned a new task:</p>
                <div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #28a745;">
                    <h3>{task_title}</h3>
                    <p>{task_description}</p>
                    {due_date_html}
                </div>
                <p>Login to iMix CRM to view and manage this task.</p>
                <p>Best regards,<br>{self.tenant.name} Team</p>
            </body>
        </html>
        """
        
        text_content = f"""
        New Task Assigned
        
        Hello {user_name},
        
        You have been assigned a new task:
        
        {task_title}
        {task_description}
        {due_date_text}
        
        Login to iMix CRM to view and manage this task.
        
        Best regards,
        {self.tenant.name} Team
        """
        
        return await self.send_email(user_email, subject, html_content, text_content)

async def get_email_service(tenant_id: str) -> Optional[EmailService]:
    """
    Get an EmailService instance for a tenant
    """
    tenant = await Tenant.find_one({"_id": tenant_id})
    
    if not tenant or not tenant.email_settings:
        logger.warning(f"Tenant {tenant_id} does not have email settings configured")
        return None
    
    return EmailService(tenant)
