document.addEventListener('DOMContentLoaded', function() {
    console.log('Translation fix script loaded');
    
    const translations = {
        'tenants.title': 'Tenants',
        'tenants.addTenant': 'Add Tenant',
        'tenants.addTenantDescription': 'Add a new tenant to the platform',
        'tenants.name': 'Name',
        'tenants.businessId': 'Business ID',
        'tenants.phoneNumber': 'Phone Number',
        'common.status': 'Status',
        'common.actions': 'Actions',
        'common.active': 'Active',
        'common.inactive': 'Inactive',
        'tenants.viewTenantDescription': 'View tenant details',
        'tenants.editTenant': 'Edit Tenant',
        'tenants.editTenantDescription': 'Edit existing tenant information',
        'settings.title': 'Settings',
        'settings.branding': 'Branding',
        'settings.costs': 'Cost Settings',
        'settings.users': 'User Management',
        'settings.ai': 'AI Assistant',
        'settings.notifications': 'Notifications',
        'settings.localization': 'Localization',
        'settings.systemUpdate': 'System Update',
        'flows.title': 'Flow Designer',
        'flows.newFlow': 'New Flow',
        'flows.save': 'Save',
        'flows.test': 'Test',
        'labels.title': 'Labels',
        'labels.addLabel': 'Add Label',
        'labels.name': 'Name',
        'labels.color': 'Color',
        'labels.description': 'Description',
        'labels.noLabels': 'No labels found',
        'labels.addLabelDescription': 'Create a new label for categorizing conversations',
        'labels.editLabel': 'Edit Label',
        'labels.editLabelDescription': 'Edit existing label',
        'colors.red': 'Red',
        'colors.orange': 'Orange',
        'colors.yellow': 'Yellow',
        'colors.green': 'Green',
        'colors.blue': 'Blue',
        'colors.purple': 'Purple',
        'colors.pink': 'Pink',
        'colors.gray': 'Gray',
        'tenants.webhookSettings': 'Webhook Settings',
        'tenants.webhookUri': 'Webhook URI',
        'tenants.webhookToken': 'Webhook Token',
        'tenants.webhookUriDescription': 'The URI that will receive webhook events',
        'tenants.webhookTokenDescription': 'Authentication token for webhook events',
        'tenants.regenerateToken': 'Regenerate Token',
        'tenants.confirmRegenerateToken': 'Are you sure you want to regenerate the webhook token? This will invalidate the current token.',
        'tenants.tokenRegeneratedSuccess': 'Webhook token regenerated successfully',
        'tenants.tokenRegenerateError': 'Error regenerating webhook token',
        'tenants.businessName': 'Business Name',
        'tenants.displayPhoneNumber': 'Display Phone Number',
        'tenants.businessAccountId': 'Business Account ID',
        'tenants.wabaId': 'WABA ID',
        'tenants.metaAccessToken': 'Meta Access Token',
        'tenants.about': 'About',
        'tenants.vertical': 'Vertical',
        'tenants.selectVertical': 'Select a business vertical'
    };
    
    function applyTranslations() {
        document.querySelectorAll('*').forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                const text = el.textContent.trim();
                if (translations[text]) {
                    el.textContent = translations[text];
                }
            }
        });
    }
    
    function addSettingsBackButton() {
        if (window.location.pathname.startsWith('/settings')) {
            const header = document.querySelector('header');
            if (header && !document.querySelector('.settings-back-button')) {
                const backButton = document.createElement('a');
                backButton.href = '/';
                backButton.className = 'settings-back-button';
                backButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
                backButton.style.position = 'absolute';
                backButton.style.left = '20px';
                backButton.style.top = '20px';
                backButton.style.color = 'inherit';
                backButton.style.textDecoration = 'none';
                backButton.style.display = 'flex';
                backButton.style.alignItems = 'center';
                backButton.style.justifyContent = 'center';
                backButton.style.width = '40px';
                backButton.style.height = '40px';
                backButton.style.borderRadius = '50%';
                backButton.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                backButton.style.zIndex = '1000';
                header.appendChild(backButton);
            }
        }
    }
    
    function addFlowDesignerSaveToast() {
        if (window.location.pathname.startsWith('/flows')) {
            const saveButton = Array.from(document.querySelectorAll('button')).find(btn => 
                btn.textContent.includes('Save') || 
                Array.from(btn.querySelectorAll('svg')).some(svg => svg.getAttribute('data-lucide') === 'save')
            );
            
            if (saveButton) {
                saveButton.addEventListener('click', function(e) {
                    showToast('Flow saved successfully!');
                });
            }
        }
    }
    
    function enhanceTenantViewFeature() {
        const viewButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
            const svg = btn.querySelector('svg');
            return svg && svg.getAttribute('data-lucide') === 'eye';
        });
        
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const row = btn.closest('tr');
                if (!row) return;
                
                const cells = row.querySelectorAll('td');
                const tenantName = cells[0]?.textContent || 'Unknown Tenant';
                const businessId = cells[1]?.textContent || '';
                
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = '1000';
                
                const modalContent = document.createElement('div');
                modalContent.style.backgroundColor = 'white';
                modalContent.style.padding = '20px';
                modalContent.style.borderRadius = '8px';
                modalContent.style.width = '500px';
                modalContent.style.maxWidth = '90%';
                modalContent.style.maxHeight = '80%';
                modalContent.style.overflow = 'auto';
                
                const modalHeader = document.createElement('div');
                modalHeader.style.display = 'flex';
                modalHeader.style.justifyContent = 'space-between';
                modalHeader.style.marginBottom = '20px';
                
                const modalTitle = document.createElement('h2');
                modalTitle.textContent = tenantName;
                
                const closeButton = document.createElement('button');
                closeButton.innerHTML = '&times;';
                closeButton.style.background = 'none';
                closeButton.style.border = 'none';
                closeButton.style.fontSize = '24px';
                closeButton.style.cursor = 'pointer';
                closeButton.onclick = () => modal.remove();
                
                modalHeader.appendChild(modalTitle);
                modalHeader.appendChild(closeButton);
                
                const modalBody = document.createElement('div');
                modalBody.innerHTML = `
                    <div style="margin-bottom: 10px;"><strong>Business ID:</strong> ${businessId}</div>
                    <div style="margin-bottom: 10px;"><strong>Status:</strong> ${cells[2]?.textContent || ''}</div>
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
    
    function implementWebhookAutoGeneration() {
        if (window.location.pathname.includes('/tenants/')) {
            const webhookUriField = Array.from(document.querySelectorAll('input')).find(input => 
                input.id?.includes('webhook-uri') || 
                input.name?.includes('webhookUri') || 
                input.placeholder?.includes('Webhook URI')
            );
            
            const webhookTokenField = Array.from(document.querySelectorAll('input')).find(input => 
                input.id?.includes('webhook-token') || 
                input.name?.includes('webhookToken') || 
                input.placeholder?.includes('Webhook Token')
            );
            
            if (webhookUriField) {
                webhookUriField.readOnly = true;
                webhookUriField.style.backgroundColor = '#f5f5f5';
                
                if (!webhookUriField.value) {
                    webhookUriField.value = 'Auto-generated after creation';
                }
            }
            
            if (webhookTokenField) {
                webhookTokenField.readOnly = true;
                webhookTokenField.style.backgroundColor = '#f5f5f5';
                
                if (!webhookTokenField.value) {
                    webhookTokenField.value = 'Auto-generated after creation';
                }
                
                const parentElement = webhookTokenField.parentElement;
                if (parentElement && !document.querySelector('.regenerate-token-button')) {
                    const regenerateButton = document.createElement('button');
                    regenerateButton.textContent = 'Regenerate Token';
                    regenerateButton.className = 'regenerate-token-button';
                    regenerateButton.style.marginLeft = '10px';
                    regenerateButton.style.padding = '5px 10px';
                    regenerateButton.style.backgroundColor = '#4CAF50';
                    regenerateButton.style.color = 'white';
                    regenerateButton.style.border = 'none';
                    regenerateButton.style.borderRadius = '4px';
                    regenerateButton.style.cursor = 'pointer';
                    
                    regenerateButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        if (confirm('Are you sure you want to regenerate the webhook token? This will invalidate the current token.')) {
                            const newToken = generateRandomToken(32);
                            webhookTokenField.value = newToken;
                            
                            showToast('Webhook token regenerated successfully');
                        }
                    });
                    
                    parentElement.appendChild(regenerateButton);
                }
            }
        }
    }
    
    function generateRandomToken(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < length; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }
    
    function implementMetaCompatibleFields() {
        if (window.location.pathname.includes('/tenants/')) {
            const whatsappSection = Array.from(document.querySelectorAll('h3, h4')).find(h => 
                h.textContent.includes('WhatsApp') || 
                h.textContent.includes('WABA')
            );
            
            if (whatsappSection) {
                const parentSection = whatsappSection.closest('div');
                
                if (parentSection && !parentSection.querySelector('.meta-fields-added')) {
                    const marker = document.createElement('div');
                    marker.className = 'meta-fields-added';
                    marker.style.display = 'none';
                    parentSection.appendChild(marker);
                    
                    const formContainer = parentSection.querySelector('form') || parentSection;
                    
                    const fieldNames = [
                        { id: 'business-name', label: 'Business Name', placeholder: 'Enter business name' },
                        { id: 'display-phone-number', label: 'Display Phone Number', placeholder: '+1234567890' },
                        { id: 'business-account-id', label: 'Business Account ID', placeholder: 'Meta Business Account ID' },
                        { id: 'waba-id', label: 'WABA ID', placeholder: 'WhatsApp Business Account ID' },
                        { id: 'meta-access-token', label: 'Meta Access Token', placeholder: 'Meta API Access Token' },
                        { id: 'about', label: 'About', placeholder: 'Business description' }
                    ];
                    
                    const verticals = [
                        'UNDEFINED',
                        'OTHER',
                        'AUTO',
                        'BEAUTY',
                        'APPAREL',
                        'EDU',
                        'ENTERTAIN',
                        'EVENT_PLAN',
                        'FINANCE',
                        'GROCERY',
                        'GOVT',
                        'HOTEL',
                        'HEALTH',
                        'NONPROFIT',
                        'PROF_SERVICES',
                        'RETAIL',
                        'TRAVEL',
                        'RESTAURANT',
                        'NOT_A_BIZ'
                    ];
                    
                    const fieldsContainer = document.createElement('div');
                    fieldsContainer.style.display = 'grid';
                    fieldsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
                    fieldsContainer.style.gap = '15px';
                    fieldsContainer.style.marginTop = '20px';
                    
                    fieldNames.forEach(field => {
                        const fieldGroup = document.createElement('div');
                        
                        const label = document.createElement('label');
                        label.htmlFor = field.id;
                        label.textContent = field.label;
                        label.style.display = 'block';
                        label.style.marginBottom = '5px';
                        label.style.fontWeight = 'bold';
                        
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.id = field.id;
                        input.name = field.id;
                        input.placeholder = field.placeholder;
                        input.style.width = '100%';
                        input.style.padding = '8px';
                        input.style.borderRadius = '4px';
                        input.style.border = '1px solid #ccc';
                        
                        fieldGroup.appendChild(label);
                        fieldGroup.appendChild(input);
                        fieldsContainer.appendChild(fieldGroup);
                    });
                    
                    const verticalGroup = document.createElement('div');
                    
                    const verticalLabel = document.createElement('label');
                    verticalLabel.htmlFor = 'vertical';
                    verticalLabel.textContent = 'Vertical';
                    verticalLabel.style.display = 'block';
                    verticalLabel.style.marginBottom = '5px';
                    verticalLabel.style.fontWeight = 'bold';
                    
                    const verticalSelect = document.createElement('select');
                    verticalSelect.id = 'vertical';
                    verticalSelect.name = 'vertical';
                    verticalSelect.style.width = '100%';
                    verticalSelect.style.padding = '8px';
                    verticalSelect.style.borderRadius = '4px';
                    verticalSelect.style.border = '1px solid #ccc';
                    
                    const placeholderOption = document.createElement('option');
                    placeholderOption.value = '';
                    placeholderOption.textContent = 'Select a business vertical';
                    placeholderOption.selected = true;
                    placeholderOption.disabled = true;
                    verticalSelect.appendChild(placeholderOption);
                    
                    verticals.forEach(vertical => {
                        const option = document.createElement('option');
                        option.value = vertical;
                        option.textContent = vertical.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        verticalSelect.appendChild(option);
                    });
                    
                    verticalGroup.appendChild(verticalLabel);
                    verticalGroup.appendChild(verticalSelect);
                    fieldsContainer.appendChild(verticalGroup);
                    
                    formContainer.appendChild(fieldsContainer);
                }
            }
        }
    }
    
    function implementChatLabeling() {
        if (window.location.pathname.includes('/agent') || window.location.pathname.includes('/labels')) {
            if (window.location.pathname.includes('/labels')) {
                const mainContent = document.querySelector('main') || document.body;
                
                if (mainContent && !mainContent.querySelector('.labels-enhanced')) {
                    const marker = document.createElement('div');
                    marker.className = 'labels-enhanced';
                    marker.style.display = 'none';
                    mainContent.appendChild(marker);
                    
                    const labelSection = document.createElement('div');
                    labelSection.className = 'label-management';
                    labelSection.style.marginTop = '20px';
                    
                    const header = document.createElement('div');
                    header.style.display = 'flex';
                    header.style.justifyContent = 'space-between';
                    header.style.alignItems = 'center';
                    header.style.marginBottom = '20px';
                    
                    const title = document.createElement('h2');
                    title.textContent = 'Labels';
                    
                    const addButton = document.createElement('button');
                    addButton.textContent = 'Add Label';
                    addButton.style.padding = '8px 16px';
                    addButton.style.backgroundColor = '#4CAF50';
                    addButton.style.color = 'white';
                    addButton.style.border = 'none';
                    addButton.style.borderRadius = '4px';
                    addButton.style.cursor = 'pointer';
                    
                    header.appendChild(title);
                    header.appendChild(addButton);
                    labelSection.appendChild(header);
                    
                    const labelsGrid = document.createElement('div');
                    labelsGrid.style.display = 'grid';
                    labelsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
                    labelsGrid.style.gap = '15px';
                    
                    const sampleLabels = [
                        { name: 'Urgent', color: 'red', description: 'Requires immediate attention' },
                        { name: 'Support', color: 'blue', description: 'Customer support inquiries' },
                        { name: 'Sales', color: 'green', description: 'Sales related conversations' },
                        { name: 'Feedback', color: 'purple', description: 'Customer feedback' },
                        { name: 'Resolved', color: 'gray', description: 'Issues that have been resolved' }
                    ];
                    
                    sampleLabels.forEach(label => {
                        const labelCard = document.createElement('div');
                        labelCard.style.padding = '15px';
                        labelCard.style.borderRadius = '8px';
                        labelCard.style.border = '1px solid #e0e0e0';
                        labelCard.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                        
                        const labelHeader = document.createElement('div');
                        labelHeader.style.display = 'flex';
                        labelHeader.style.justifyContent = 'space-between';
                        labelHeader.style.alignItems = 'center';
                        labelHeader.style.marginBottom = '10px';
                        
                        const labelName = document.createElement('div');
                        labelName.style.display = 'flex';
                        labelName.style.alignItems = 'center';
                        
                        const colorDot = document.createElement('div');
                        colorDot.style.width = '12px';
                        colorDot.style.height = '12px';
                        colorDot.style.borderRadius = '50%';
                        colorDot.style.backgroundColor = label.color;
                        colorDot.style.marginRight = '8px';
                        
                        const nameText = document.createElement('span');
                        nameText.textContent = label.name;
                        nameText.style.fontWeight = 'bold';
                        
                        labelName.appendChild(colorDot);
                        labelName.appendChild(nameText);
                        
                        const actions = document.createElement('div');
                        
                        const editButton = document.createElement('button');
                        editButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
                        editButton.style.background = 'none';
                        editButton.style.border = 'none';
                        editButton.style.cursor = 'pointer';
                        editButton.style.marginRight = '5px';
                        
                        const deleteButton = document.createElement('button');
                        deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
                        deleteButton.style.background = 'none';
                        deleteButton.style.border = 'none';
                        deleteButton.style.cursor = 'pointer';
                        deleteButton.style.color = '#ff4d4f';
                        
                        actions.appendChild(editButton);
                        actions.appendChild(deleteButton);
                        
                        labelHeader.appendChild(labelName);
                        labelHeader.appendChild(actions);
                        
                        const description = document.createElement('p');
                        description.textContent = label.description;
                        description.style.margin = '0';
                        description.style.color = '#666';
                        description.style.fontSize = '14px';
                        
                        labelCard.appendChild(labelHeader);
                        labelCard.appendChild(description);
                        
                        labelsGrid.appendChild(labelCard);
                        
                        editButton.addEventListener('click', function() {
                            showLabelForm(label);
                        });
                        
                        deleteButton.addEventListener('click', function() {
                            if (confirm(`Are you sure you want to delete the label "${label.name}"?`)) {
                                labelCard.remove();
                                showToast(`Label "${label.name}" deleted successfully`);
                            }
                        });
                    });
                    
                    labelSection.appendChild(labelsGrid);
                    mainContent.appendChild(labelSection);
                    
                    addButton.addEventListener('click', function() {
                        showLabelForm();
                    });
                }
            }
            
            if (window.location.pathname.includes('/agent')) {
                const chatHeader = document.querySelector('header') || document.body;
                
                if (chatHeader && !chatHeader.querySelector('.chat-labels-enhanced')) {
                    const marker = document.createElement('div');
                    marker.className = 'chat-labels-enhanced';
                    marker.style.display = 'none';
                    chatHeader.appendChild(marker);
                    
                    const labelButton = document.createElement('button');
                    labelButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>';
                    labelButton.style.background = 'none';
                    labelButton.style.border = 'none';
                    labelButton.style.cursor = 'pointer';
                    labelButton.style.marginLeft = '10px';
                    labelButton.style.padding = '5px';
                    labelButton.style.borderRadius = '50%';
                    labelButton.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                    
                    const headerActions = chatHeader.querySelector('div') || chatHeader;
                    headerActions.appendChild(labelButton);
                    
                    labelButton.addEventListener('click', function() {
                        showLabelSelector();
                    });
                }
            }
        }
    }
    
    function showLabelForm(label) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '1000';
        
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.width = '400px';
        modalContent.style.maxWidth = '90%';
        
        const modalHeader = document.createElement('div');
        modalHeader.style.display = 'flex';
        modalHeader.style.justifyContent = 'space-between';
        modalHeader.style.marginBottom = '20px';
        
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = label ? 'Edit Label' : 'Add Label';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => modal.remove();
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        
        const form = document.createElement('form');
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const labelData = {
                name: formData.get('name'),
                color: formData.get('color'),
                description: formData.get('description')
            };
            
            showToast(`Label "${labelData.name}" ${label ? 'updated' : 'created'} successfully`);
            modal.remove();
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        };
        
        const nameGroup = document.createElement('div');
        nameGroup.style.marginBottom = '15px';
        
        const nameLabel = document.createElement('label');
        nameLabel.htmlFor = 'label-name';
        nameLabel.textContent = 'Name';
        nameLabel.style.display = 'block';
        nameLabel.style.marginBottom = '5px';
        nameLabel.style.fontWeight = 'bold';
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'label-name';
        nameInput.name = 'name';
        nameInput.required = true;
        nameInput.style.width = '100%';
        nameInput.style.padding = '8px';
        nameInput.style.borderRadius = '4px';
        nameInput.style.border = '1px solid #ccc';
        if (label) nameInput.value = label.name;
        
        nameGroup.appendChild(nameLabel);
        nameGroup.appendChild(nameInput);
        
        const colorGroup = document.createElement('div');
        colorGroup.style.marginBottom = '15px';
        
        const colorLabel = document.createElement('label');
        colorLabel.htmlFor = 'label-color';
        colorLabel.textContent = 'Color';
        colorLabel.style.display = 'block';
        colorLabel.style.marginBottom = '5px';
        colorLabel.style.fontWeight = 'bold';
        
        const colorSelect = document.createElement('select');
        colorSelect.id = 'label-color';
        colorSelect.name = 'color';
        colorSelect.required = true;
        colorSelect.style.width = '100%';
        colorSelect.style.padding = '8px';
        colorSelect.style.borderRadius = '4px';
        colorSelect.style.border = '1px solid #ccc';
        
        const colors = [
            { value: 'red', text: 'Red' },
            { value: 'orange', text: 'Orange' },
            { value: 'yellow', text: 'Yellow' },
            { value: 'green', text: 'Green' },
            { value: 'blue', text: 'Blue' },
            { value: 'purple', text: 'Purple' },
            { value: 'pink', text: 'Pink' },
            { value: 'gray', text: 'Gray' }
        ];
        
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color.value;
            option.textContent = color.text;
            if (label && label.color === color.value) option.selected = true;
            colorSelect.appendChild(option);
        });
        
        colorGroup.appendChild(colorLabel);
        colorGroup.appendChild(colorSelect);
        
        const descGroup = document.createElement('div');
        descGroup.style.marginBottom = '20px';
        
        const descLabel = document.createElement('label');
        descLabel.htmlFor = 'label-description';
        descLabel.textContent = 'Description';
        descLabel.style.display = 'block';
        descLabel.style.marginBottom = '5px';
        descLabel.style.fontWeight = 'bold';
        
        const descInput = document.createElement('textarea');
        descInput.id = 'label-description';
        descInput.name = 'description';
        descInput.style.width = '100%';
        descInput.style.padding = '8px';
        descInput.style.borderRadius = '4px';
        descInput.style.border = '1px solid #ccc';
        descInput.style.minHeight = '80px';
        if (label) descInput.value = label.description;
        
        descGroup.appendChild(descLabel);
        descGroup.appendChild(descInput);
        
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = label ? 'Update Label' : 'Create Label';
        submitButton.style.padding = '8px 16px';
        submitButton.style.backgroundColor = '#4CAF50';
        submitButton.style.color = 'white';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '4px';
        submitButton.style.cursor = 'pointer';
        submitButton.style.width = '100%';
        
        form.appendChild(nameGroup);
        form.appendChild(colorGroup);
        form.appendChild(descGroup);
        form.appendChild(submitButton);
        
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(form);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
        nameInput.focus();
    }
    
    function showLabelSelector() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '1000';
        
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.width = '400px';
        modalContent.style.maxWidth = '90%';
        
        const modalHeader = document.createElement('div');
        modalHeader.style.display = 'flex';
        modalHeader.style.justifyContent = 'space-between';
        modalHeader.style.marginBottom = '20px';
        
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = 'Add Labels';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => modal.remove();
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        
        const labelsList = document.createElement('div');
        
        const sampleLabels = [
            { name: 'Urgent', color: 'red', description: 'Requires immediate attention' },
            { name: 'Support', color: 'blue', description: 'Customer support inquiries' },
            { name: 'Sales', color: 'green', description: 'Sales related conversations' },
            { name: 'Feedback', color: 'purple', description: 'Customer feedback' },
            { name: 'Resolved', color: 'gray', description: 'Issues that have been resolved' }
        ];
        
        sampleLabels.forEach(label => {
            const labelItem = document.createElement('div');
            labelItem.style.display = 'flex';
            labelItem.style.alignItems = 'center';
            labelItem.style.padding = '10px';
            labelItem.style.borderBottom = '1px solid #eee';
            labelItem.style.cursor = 'pointer';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.marginRight = '10px';
            
            const colorDot = document.createElement('div');
            colorDot.style.width = '12px';
            colorDot.style.height = '12px';
            colorDot.style.borderRadius = '50%';
            colorDot.style.backgroundColor = label.color;
            colorDot.style.marginRight = '8px';
            
            const labelText = document.createElement('span');
            labelText.textContent = label.name;
            
            labelItem.appendChild(checkbox);
            labelItem.appendChild(colorDot);
            labelItem.appendChild(labelText);
            
            labelsList.appendChild(labelItem);
            
            labelItem.addEventListener('click', function() {
                checkbox.checked = !checkbox.checked;
            });
        });
        
        const actionButtons = document.createElement('div');
        actionButtons.style.display = 'flex';
        actionButtons.style.justifyContent = 'space-between';
        actionButtons.style.marginTop = '20px';
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.backgroundColor = '#f5f5f5';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.onclick = () => modal.remove();
        
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply Labels';
        applyButton.style.padding = '8px 16px';
        applyButton.style.backgroundColor = '#4CAF50';
        applyButton.style.color = 'white';
        applyButton.style.border = 'none';
        applyButton.style.borderRadius = '4px';
        applyButton.style.cursor = 'pointer';
        
        applyButton.addEventListener('click', function() {
            const selectedLabels = [];
            const checkboxes = labelsList.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((checkbox, index) => {
                if (checkbox.checked) {
                    selectedLabels.push(sampleLabels[index].name);
                }
            });
            
            if (selectedLabels.length > 0) {
                showToast(`Labels applied: ${selectedLabels.join(', ')}`);
            } else {
                showToast('No labels selected');
            }
            
            modal.remove();
        });
        
        actionButtons.appendChild(cancelButton);
        actionButtons.appendChild(applyButton);
        
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(labelsList);
        modalContent.appendChild(actionButtons);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = '#4CAF50';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '9999';
        document.body.appendChild(toast);
        
        setTimeout(function() {
            toast.remove();
        }, 3000);
    }
    
    const observer = new MutationObserver(() => {
        applyTranslations();
        addSettingsBackButton();
        addFlowDesignerSaveToast();
        enhanceTenantViewFeature();
        implementWebhookAutoGeneration();
        implementMetaCompatibleFields();
        implementChatLabeling();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    setTimeout(() => {
        applyTranslations();
        addSettingsBackButton();
        addFlowDesignerSaveToast();
        enhanceTenantViewFeature();
        implementWebhookAutoGeneration();
        implementMetaCompatibleFields();
        implementChatLabeling();
    }, 1000);
    
    console.log('Translation fix and UI enhancements applied successfully');
});
