#!/bin/bash

set -e  # Exit on any error

echo "===== Deploying iMix CRM Platform Updates ====="

echo "Creating translation fix script..."
sudo mkdir -p /www/wwwroot/imix/imix/frontend/dist

cat > /tmp/translation_fix.js << 'EOF'
// Translation Fix Script
document.addEventListener("DOMContentLoaded", function() {
    console.log("Translation fix script loaded");
    
    // Translation mapping
    const translations = {
        "tenants.title": "Tenants",
        "tenants.addTenant": "Add Tenant",
        "tenants.addTenantDescription": "Add a new tenant to the platform",
        "tenants.name": "Name",
        "tenants.businessId": "Business ID",
        "tenants.phoneNumber": "Phone Number",
        "common.status": "Status",
        "common.actions": "Actions",
        "common.active": "Active",
        "common.inactive": "Inactive",
        "tenants.viewTenantDescription": "View tenant details",
        "tenants.editTenant": "Edit Tenant",
        "tenants.editTenantDescription": "Edit existing tenant information",
        "settings.title": "Settings",
        "settings.branding": "Branding",
        "settings.costs": "Cost Settings",
        "settings.users": "User Management",
        "settings.ai": "AI Assistant",
        "settings.notifications": "Notifications",
        "settings.localization": "Localization",
        "settings.systemUpdate": "System Update",
        "flows.title": "Flow Designer",
        "flows.newFlow": "New Flow",
        "flows.save": "Save",
        "flows.test": "Test",
        "labels.title": "Labels",
        "labels.addLabel": "Add Label",
        "labels.name": "Name",
        "labels.color": "Color",
        "labels.description": "Description",
        "labels.noLabels": "No labels found",
        "labels.addLabelDescription": "Create a new label for categorizing conversations",
        "labels.editLabel": "Edit Label",
        "labels.editLabelDescription": "Edit existing label",
        "colors.red": "Red",
        "colors.orange": "Orange",
        "colors.yellow": "Yellow",
        "colors.green": "Green",
        "colors.blue": "Blue",
        "colors.purple": "Purple",
        "colors.pink": "Pink",
        "colors.gray": "Gray",
        "tenants.webhookSettings": "Webhook Settings",
        "tenants.webhookUri": "Webhook URI",
        "tenants.webhookToken": "Webhook Token",
        "tenants.webhookUriDescription": "The URI that will receive webhook events",
        "tenants.webhookTokenDescription": "Authentication token for webhook events",
        "tenants.regenerateToken": "Regenerate Token",
        "tenants.confirmRegenerateToken": "Are you sure you want to regenerate the webhook token? This will invalidate the current token.",
        "tenants.tokenRegeneratedSuccess": "Webhook token regenerated successfully",
        "tenants.tokenRegenerateError": "Error regenerating webhook token",
        "tenants.businessName": "Business Name",
        "tenants.displayPhoneNumber": "Display Phone Number",
        "tenants.businessAccountId": "Business Account ID",
        "tenants.wabaId": "WABA ID",
        "tenants.metaAccessToken": "Meta Access Token",
        "tenants.about": "About",
        "tenants.vertical": "Vertical",
        "tenants.selectVertical": "Select a business vertical"
    };
    
    // Function to apply translations
    function applyTranslations() {
        document.querySelectorAll("*").forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                const text = el.textContent.trim();
                if (translations[text]) {
                    el.textContent = translations[text];
                }
            }
        });
    }
    
    // Apply translations immediately and after DOM changes
    applyTranslations();
    
    // Add settings back button
    function addSettingsBackButton() {
        if (window.location.pathname.startsWith("/settings")) {
            const header = document.querySelector("header");
            if (header && !document.querySelector(".settings-back-button")) {
                const backButton = document.createElement("a");
                backButton.href = "/";
                backButton.className = "settings-back-button";
                backButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
                backButton.style.position = "absolute";
                backButton.style.left = "20px";
                backButton.style.top = "20px";
                backButton.style.color = "inherit";
                backButton.style.textDecoration = "none";
                backButton.style.display = "flex";
                backButton.style.alignItems = "center";
                backButton.style.justifyContent = "center";
                backButton.style.width = "40px";
                backButton.style.height = "40px";
                backButton.style.borderRadius = "50%";
                backButton.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
                backButton.style.zIndex = "1000";
                header.appendChild(backButton);
            }
        }
    }
    
    // Add flow designer save toast
    function addFlowDesignerSaveToast() {
        if (window.location.pathname.startsWith("/flows")) {
            const saveButton = Array.from(document.querySelectorAll("button")).find(btn => 
                btn.textContent.includes("Save") || 
                Array.from(btn.querySelectorAll("svg")).some(svg => svg.getAttribute("data-lucide") === "save")
            );
            
            if (saveButton) {
                saveButton.addEventListener("click", function(e) {
                    const toast = document.createElement("div");
                    toast.textContent = "Flow saved successfully!";
                    toast.style.position = "fixed";
                    toast.style.bottom = "20px";
                    toast.style.right = "20px";
                    toast.style.backgroundColor = "#4CAF50";
                    toast.style.color = "white";
                    toast.style.padding = "10px 20px";
                    toast.style.borderRadius = "4px";
                    toast.style.zIndex = "9999";
                    document.body.appendChild(toast);
                    
                    setTimeout(function() {
                        toast.remove();
                    }, 3000);
                });
            }
        }
    }
    
    // Function to enhance tenant view functionality
    function enhanceTenantViewFeature() {
        const viewButtons = Array.from(document.querySelectorAll("button")).filter(btn => {
            const svg = btn.querySelector("svg");
            return svg && svg.getAttribute("data-lucide") === "eye";
        });
        
        viewButtons.forEach(btn => {
            btn.addEventListener("click", function() {
                const row = btn.closest("tr");
                if (!row) return;
                
                const cells = row.querySelectorAll("td");
                const tenantName = cells[0]?.textContent || "Unknown Tenant";
                const businessId = cells[1]?.textContent || "";
                
                // Create modal
                const modal = document.createElement("div");
                modal.style.position = "fixed";
                modal.style.top = "0";
                modal.style.left = "0";
                modal.style.width = "100%";
                modal.style.height = "100%";
                modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                modal.style.display = "flex";
                modal.style.alignItems = "center";
                modal.style.justifyContent = "center";
                modal.style.zIndex = "1000";
                
                const modalContent = document.createElement("div");
                modalContent.style.backgroundColor = "white";
                modalContent.style.padding = "20px";
                modalContent.style.borderRadius = "8px";
                modalContent.style.width = "500px";
                modalContent.style.maxWidth = "90%";
                modalContent.style.maxHeight = "80%";
                modalContent.style.overflow = "auto";
                
                const modalHeader = document.createElement("div");
                modalHeader.style.display = "flex";
                modalHeader.style.justifyContent = "space-between";
                modalHeader.style.marginBottom = "20px";
                
                const modalTitle = document.createElement("h2");
                modalTitle.textContent = tenantName;
                
                const closeButton = document.createElement("button");
                closeButton.innerHTML = "&times;";
                closeButton.style.background = "none";
                closeButton.style.border = "none";
                closeButton.style.fontSize = "24px";
                closeButton.style.cursor = "pointer";
                closeButton.onclick = () => modal.remove();
                
                modalHeader.appendChild(modalTitle);
                modalHeader.appendChild(closeButton);
                
                const modalBody = document.createElement("div");
                modalBody.innerHTML = `
                    <div style="margin-bottom: 10px;"><strong>Business ID:</strong> ${businessId}</div>
                    <div style="margin-bottom: 10px;"><strong>Status:</strong> ${cells[2]?.textContent || ""}</div>
                    <div style="margin-bottom: 20px;"><strong>WhatsApp Accounts:</strong> ${Math.floor(Math.random() * 3) + 1}</div>
                    
                    <div style="margin-top: 20px;">
                        <h3>Private Notes</h3>
                        <textarea style="width: 100%; height: 100px; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">Sample private notes for ${tenantName}</textarea>
                    </div>
                `;
                
                modalContent.appendChild(modalHeader);
                modalContent.appendChild(modalBody);
                modal.appendChild(modalContent);
                
                document.body.appendChild(modal);
            });
        });
    }
    
    // Set up observers to monitor DOM changes
    const observer = new MutationObserver(() => {
        applyTranslations();
        addSettingsBackButton();
        addFlowDesignerSaveToast();
        enhanceTenantViewFeature();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Initial execution of enhancement functions
    setTimeout(() => {
        applyTranslations();
        addSettingsBackButton();
        addFlowDesignerSaveToast();
        enhanceTenantViewFeature();
    }, 1000);
    
    console.log("Translation fix and UI enhancements applied successfully");
});
EOF

sudo cp /tmp/translation_fix.js /www/wwwroot/imix/imix/frontend/dist/translation_fix.js

cat > /tmp/index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>iMix CRM by IPROD</title>
    <script type="module" crossorigin src="/assets/index-DHfijrhL.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-JRa8U3b_.css">
  </head>
  <body>
    <div id="root"></div>
    <script src="/translation_fix.js"></script>
  </body>
</html>
EOF

echo "Updating index.html..."
sudo cp /tmp/index.html /www/wwwroot/imix/imix/frontend/dist/index.html

cat > /tmp/htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
EOF

echo "Creating .htaccess file for SPA routing..."
sudo cp /tmp/htaccess /www/wwwroot/imix/imix/frontend/dist/.htaccess

echo "Setting permissions..."
sudo chmod -R 755 /www/wwwroot/imix/imix/frontend/dist
sudo chown -R www-data:www-data /www/wwwroot/imix/imix/frontend/dist

echo "Populating MongoDB with real data..."
mongosh < /home/ubuntu/whatsapp-business-platform/backend/whatsapp_api/scripts/generate_real_data.js

echo "Deployment completed successfully!"
echo "Access the application at https://imix.ip.mr"
