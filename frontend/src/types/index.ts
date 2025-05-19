export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  role: Role;
  customPermissions?: UserPermissions;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
  languagePreference?: Language;
}

export interface Tenant {
  id: string;
  name: string;
  businessId: string;
  whatsappAccounts: WhatsAppBusinessAccount[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
  usageLimits: UsageLimits;
  webhookUri?: string;        // New field
  webhookToken?: string;      // New field
  defaultLanguage?: Language; // New field
  organization?: string;      // New field
  address?: string;           // New field
  phone?: string;             // New field
  mobile?: string;            // New field
  email?: string;             // New field
  privateNotes?: string;      // New field
  logoUrl?: string;           // New field
}

export interface WhatsAppBusinessAccount {
  phoneNumberId: string;
  displayPhoneNumber: string;
  businessName: string;
  verified: boolean;
  apiKey?: string;
  businessAccountId: string;  // New field
  metaAccessToken: string;    // New field
  appId: string;              // New field
}

export interface UsageLimits {
  maxMessagesPerDay: number;
  maxMediaPerDay: number;
  maxTemplates: number;
  maxAgents: number;
  maxContacts: number; // New field
  maxContactGroups: number; // New field
}

export interface Message {
  id: string;
  tenantId: string;
  whatsappAccountId: string;
  fromNumber: string;
  toNumber: string;
  messageType: MessageType;
  content: any;
  whatsappMessageId?: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
  isBusinessInitiated?: boolean;
  cost?: MessageCost;
  assigned_agent_id?: string;
  respondedByAgentId?: string;  // Track which agent responded to this message
  responseTime?: number;  // Time in seconds between message receipt and agent response
  voiceNoteDuration?: number;
  voice_note_expiry?: string;
}

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface Contact {
  id: string;
  tenantId: string;
  whatsappAccountId: string;
  phoneNumber: string;
  name?: string;
  profileName?: string;
  labels: Label[];
  customFields: Record<string, string>;
  variantFieldValues: Record<string, string>; // Added for variant fields
  groupIds: string[]; // Added for group memberships
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  name: string;
  color: string;
}

export interface ChatFlow {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FlowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  config: any;
  position: { x: number; y: number };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export type FormFieldType = 
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'radio';

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface FormSubmission {
  submission_id: string;
  contact_id: string;
  values: Record<string, any>;
  submitted_at: string;
}

export interface Form {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  fields: FormField[];
  submissions: FormSubmission[];
  createdAt: string;
  updatedAt: string;
}

export type Currency = 'mru' | 'usd' | 'eur';

export interface MessageCost {
  platformFee: number;
  metaBusinessFee: number;
  maintenanceHostingFee: number;
  currency: Currency;
  total: number;
}

export interface CostSettings {
  platformFeePerMessage: number;
  metaBusinessFeePerMessage: number;
  maintenanceHostingFeePerMonth: number;
  currency: Currency;
  voiceNoteRetentionDays: number;
}

export interface BrandingColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface BrandingSettings {
  id: string;
  tenantId: string;
  companyName: string;
  logoUrl?: string;
  faviconUrl?: string;
  colors: BrandingColors;
  fontFamily: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  tenantId: string;
  whatsappAccountId: string;
  fromNumber: string;
  toNumber: string;
  messageType: MessageType;
  content: any;
  whatsappMessageId?: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
  isBusinessInitiated?: boolean;
  cost?: MessageCost;
  assigned_agent_id?: string;
  respondedByAgentId?: string;  // Track which agent responded to this message
  responseTime?: number;  // Time in seconds between message receipt and agent response
  voiceNoteDuration?: number;
  voice_note_expiry?: string;
}

export type MessageType = 
  | 'text'
  | 'image'
  | 'video'
  | 'document'
  | 'audio'
  | 'sticker'
  | 'location'
  | 'contact'
  | 'template'
  | 'interactive'
  | 'form';

export type Role = 
  | 'admin' 
  | 'manager' 
  | 'agent'
  | 'supervisor'
  | 'readonly'
  | 'billing'
  | 'custom';

export type Permission =
  | 'view_dashboard'
  | 'manage_tenants'
  | 'manage_users'
  | 'send_messages'
  | 'view_messages'
  | 'manage_templates'
  | 'manage_contacts'
  | 'manage_flows'
  | 'manage_forms'
  | 'manage_billing'
  | 'manage_settings'
  | 'assign_contacts'
  | 'view_analytics';

export interface ContactVariantField {
  name: string;
  description?: string;
  isVisibleToAgent: boolean;
  isAvailableInFlows: boolean;
}

export type ContactGroupPermission = 
  | 'view'
  | 'edit'
  | 'delete'
  | 'message'
  | 'assign';

export interface RolePermission {
  role: Role;
  permissions: ContactGroupPermission[];
}

export interface ContactGroup {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  contacts: string[];
  parentGroupId?: string;
  rolePermissions: RolePermission[];
  variantFields: Record<string, ContactVariantField>;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermissions {
  permissions: Permission[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  role: Role;
  customPermissions?: UserPermissions;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
  languagePreference?: Language;
}
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface TaskAssignment {
  agentId: string;
  assignedAt: string;
  assignedBy: string;
}

export interface Task {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedTo: TaskAssignment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  completedBy?: string;
  relatedContactId?: string;
  relatedMessageId?: string;
}

export type Language = 'en' | 'fr' | 'ar';

export interface EmailSettings {
  smtpServer: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  useTls: boolean;
  notificationEnabled: boolean;
  welcomeTemplate?: string;
  passwordResetTemplate?: string;
  messageNotificationTemplate?: string;
}
