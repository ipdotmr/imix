db = db.getSiblingDB('imix_crm');

db.tenants.drop();
db.users.drop();
db.labels.drop();
db.messages.drop();
db.contacts.drop();
db.contact_groups.drop();
db.flows.drop();

const tenant = {
  name: "IPROD Technologies",
  organization: "IPROD",
  business_id: "iprod-tech-001",
  email: "info@iprod.tech",
  webhook_uri: "https://apimix.ip.mr/webhooks/example-webhook-id",
  webhook_token: "placeholder_webhook_token",
  webhook_secret: "placeholder_webhook_secret",
  created_at: new Date(),
  updated_at: new Date(),
  active: true,
  whatsapp_accounts: [
    {
      phone_number_id: "000000000000000",
      display_phone_number: "+12025551234",
      business_name: "IPROD Business",
      verified: true,
      business_account_id: "000000000000000",
      waba_id: "000000000000000",
      meta_access_token: "placeholder_meta_access_token",
      about: "Business solutions provider",
      vertical: "PROFESSIONAL_SERVICES"
    }
  ],
  usage_limits: {
    max_messages_per_day: 10000,
    max_media_per_day: 1000,
    max_templates: 100,
    max_agents: 25,
    max_contacts: 5000,
    max_contact_groups: 100
  }
};

db.tenants.insertOne(tenant);
const tenantId = tenant._id.toString();

const admin = {
  email: "admin@example.com",
  password_hash: "$2b$12$K3JNi5xEIXj.BcQlM5EyOeh8KGlwP9aPGe5tPHQZ5PWjqu3481BNO", // password123
  first_name: "Admin",
  last_name: "User",
  tenant_id: tenantId,
  role: "admin",
  active: true,
  created_at: new Date(),
  last_login: new Date()
};

db.users.insertOne(admin);

const labelColors = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "gray"];
const labels = [
  { name: "Urgent", color: "red", description: "Requires immediate attention" },
  { name: "Support", color: "blue", description: "Customer support inquiries" },
  { name: "Sales", color: "green", description: "Sales related conversations" },
  { name: "Feedback", color: "purple", description: "Customer feedback" },
  { name: "Resolved", color: "gray", description: "Issues that have been resolved" }
];

labels.forEach(label => {
  db.labels.insertOne({
    tenant_id: tenantId,
    name: label.name,
    color: label.color,
    description: label.description,
    created_at: new Date(),
    updated_at: new Date()
  });
});

const contacts = [];
for (let i = 1; i <= 20; i++) {
  contacts.push({
    tenant_id: tenantId,
    whatsapp_account_id: tenant.whatsapp_accounts[0].phone_number_id,
    phone_number: `+1202555${1000 + i}`,
    name: `Contact ${i}`,
    profile_name: `User ${i}`,
    labels: [],
    custom_fields: { company: `Company ${i}`, role: "Customer" },
    created_at: new Date(),
    updated_at: new Date()
  });
}

db.contacts.insertMany(contacts);

const contactGroups = [
  { name: "VIP Customers", description: "Our most valuable customers" },
  { name: "New Leads", description: "Potential customers to follow up with" },
  { name: "Support Tier 1", description: "First level support team" }
];

contactGroups.forEach(group => {
  db.contact_groups.insertOne({
    tenant_id: tenantId,
    name: group.name,
    description: group.description,
    contact_ids: contacts.slice(0, 5).map(c => c._id.toString()),
    created_at: new Date(),
    updated_at: new Date()
  });
});

const messageTypes = ["text", "image", "document", "template"];
const messages = [];

for (let i = 0; i < 10; i++) {
  const contact = contacts[i];
  const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
  let content = {};
  
  if (messageType === "text") {
    content = { text: `Sample message content ${i + 1}` };
  } else if (messageType === "image") {
    content = { 
      caption: `Image caption ${i + 1}`,
      url: "https://example.com/image.jpg" 
    };
  } else if (messageType === "document") {
    content = {
      caption: `Document ${i + 1}`,
      filename: "sample.pdf",
      url: "https://example.com/sample.pdf"
    };
  } else if (messageType === "template") {
    content = {
      name: "sample_template",
      language: { code: "en_US" },
      components: []
    };
  }
  
  messages.push({
    tenant_id: tenantId,
    whatsapp_account_id: tenant.whatsapp_accounts[0].phone_number_id,
    from_number: tenant.whatsapp_accounts[0].display_phone_number,
    to_number: contact.phone_number,
    message_type: messageType,
    content: content,
    status: "delivered",
    labels: [],
    created_at: new Date(),
    updated_at: new Date()
  });
  
  messages.push({
    tenant_id: tenantId,
    whatsapp_account_id: tenant.whatsapp_accounts[0].phone_number_id,
    from_number: contact.phone_number,
    to_number: tenant.whatsapp_accounts[0].display_phone_number,
    message_type: "text",
    content: { text: `Reply to message ${i + 1}` },
    status: "delivered",
    labels: [],
    created_at: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes later
    updated_at: new Date(Date.now() + 1000 * 60 * 5)
  });
}

db.messages.insertMany(messages);

const flow = {
  tenant_id: tenantId,
  name: "Welcome Flow",
  description: "Welcomes new customers and provides options",
  is_active: true,
  trigger: {
    type: "message",
    conditions: [
      {
        field: "content.text",
        operator: "contains",
        value: "hello"
      }
    ]
  },
  steps: [
    {
      id: "step1",
      type: "send_message",
      data: {
        message_type: "text",
        content: {
          text: "Welcome to IPROD! How can we help you today?"
        }
      },
      next_step: "step2"
    },
    {
      id: "step2",
      type: "wait_for_reply",
      timeout: 86400,
      timeout_step: "step3",
      next_step: "step4"
    },
    {
      id: "step3",
      type: "send_message",
      data: {
        message_type: "text",
        content: {
          text: "We haven't heard from you. Please let us know if you still need assistance."
        }
      },
      next_step: null
    },
    {
      id: "step4",
      type: "condition",
      data: {
        conditions: [
          {
            field: "content.text",
            operator: "contains",
            value: "support"
          }
        ]
      },
      true_step: "step5",
      false_step: "step6"
    },
    {
      id: "step5",
      type: "send_message",
      data: {
        message_type: "text",
        content: {
          text: "Our support team will assist you shortly."
        }
      },
      next_step: null
    },
    {
      id: "step6",
      type: "send_message",
      data: {
        message_type: "text",
        content: {
          text: "Thank you for contacting us. Is there anything else we can help with?"
        }
      },
      next_step: null
    }
  ],
  created_at: new Date(),
  updated_at: new Date()
};

db.flows.insertOne(flow);

print("Sample data created successfully!");
