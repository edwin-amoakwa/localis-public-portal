/**
 * Domain types for the Assembly Services Portal front end.
 *
 * This build is UI-only: every one of these is populated from the mock data in
 * `core/data`. The shapes are written the way a real API would return them, so
 * swapping the mock services for HTTP calls later is a service-layer change
 * rather than a rewrite of the components.
 */

// --- Accounts ---------------------------------------------------------------

export type AccountType = 'CITIZEN' | 'BUSINESS_OWNER' | 'PROPERTY_OWNER' | 'ORGANISATION';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ghanaCardNo: string;
  region: string;
  assembly: string;
  accountType: AccountType;
  digitalAddress?: string;
  residentialAddress?: string;
  avatarInitials: string;
  memberSince: string;
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  businessNumber: string;
  category: string;
  ownershipType: string;
  registrationNo: string;
  tinNo: string;
  location: string;
  digitalAddress: string;
  employees: number;
  assembly: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface PropertyProfile {
  id: string;
  description: string;
  propertyNumber: string;
  use: string;
  location: string;
  digitalAddress: string;
  assembly: string;
  rateableValue: number;
  currentYearRate: number;
  balance: number;
}

// --- Service catalogue ------------------------------------------------------

export type ServiceCategoryId =
  | 'business'
  | 'property'
  | 'building'
  | 'environmental'
  | 'market'
  | 'transport'
  | 'community';

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  description: string;
  icon: string;
  tint: 'blue' | 'green' | 'gold';
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceFee {
  name: string;
  amount: number;
  note?: string;
}

/** One applyable service in the catalogue. */
export interface AssemblyService {
  id: string;
  slug: string;
  name: string;
  categoryId: ServiceCategoryId;
  summary: string;
  description: string;
  eligibility: string[];
  requirements: string[];
  documents: string[];
  processingTime: string;
  fees: ServiceFee[];
  faqs: ServiceFaq[];
  /** Which extra wizard steps this service needs. */
  needsBusinessInfo: boolean;
  needsPropertyInfo: boolean;
  requiresInspection: boolean;
  popular?: boolean;
}

// --- Applications -----------------------------------------------------------

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'AWAITING_PAYMENT'
  | 'INSPECTION_SCHEDULED'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED';

export interface ApplicationEvent {
  date: string;
  status: ApplicationStatus | 'NOTE';
  title: string;
  detail?: string;
  actor: string;
}

export interface ApplicationDocumentRef {
  name: string;
  type: string;
  size: string;
  uploadedOn: string;
  verified: boolean;
}

export interface Application {
  id: string;
  applicationNumber: string;
  serviceId: string;
  serviceName: string;
  categoryId: ServiceCategoryId;
  submittedDate: string;
  status: ApplicationStatus;
  officer: string;
  assembly: string;
  amountDue: number;
  amountPaid: number;
  subject: string;
  invoiceId?: string;
  inspection?: Inspection;
  documents: ApplicationDocumentRef[];
  timeline: ApplicationEvent[];
  officerComments?: string;
}

export interface Inspection {
  scheduledDate: string;
  inspector: string;
  outcome: 'PENDING' | 'PASSED' | 'PASSED_WITH_CONDITIONS' | 'FAILED';
  notes?: string;
}

// --- Payments ---------------------------------------------------------------

export type InvoiceStatus = 'UNPAID' | 'PART_PAID' | 'PAID' | 'CANCELLED';

export type PaymentMethod = 'MOBILE_MONEY' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'QR_CODE';

export interface InvoiceItem {
  name: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  description: string;
  applicationNumber?: string;
  serviceName: string;
  issuedDate: string;
  dueDate: string;
  total: number;
  paid: number;
  status: InvoiceStatus;
  assembly: string;
  items: InvoiceItem[];
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  invoiceNumber: string;
  description: string;
  paidDate: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  payer: string;
  assembly: string;
}

// --- Documents --------------------------------------------------------------

export type DocumentKind =
  | 'PERMIT'
  | 'CERTIFICATE'
  | 'RECEIPT'
  | 'LETTER'
  | 'NOTICE';

export interface StoredDocument {
  id: string;
  name: string;
  kind: DocumentKind;
  reference: string;
  issuedDate: string;
  expiryDate?: string;
  sizeLabel: string;
  assembly: string;
  status: 'VALID' | 'EXPIRING' | 'EXPIRED';
}

// --- Notifications, appointments, messages ----------------------------------

export type NotificationKind =
  | 'APPLICATION'
  | 'PAYMENT'
  | 'INSPECTION'
  | 'PERMIT'
  | 'ANNOUNCEMENT';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  date: string;
  read: boolean;
  link?: string;
}

export type AppointmentKind = 'INSPECTION' | 'MEETING' | 'OFFICER_VISIT';

export interface Appointment {
  id: string;
  kind: AppointmentKind;
  title: string;
  date: string;
  time: string;
  location: string;
  officer: string;
  reference: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface MessageThread {
  id: string;
  subject: string;
  assembly: string;
  officer: string;
  lastMessageDate: string;
  unread: boolean;
  messages: ThreadMessage[];
}

export interface ThreadMessage {
  id: string;
  from: 'ME' | 'ASSEMBLY';
  author: string;
  date: string;
  body: string;
}

// --- Public site content ----------------------------------------------------

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  body: string;
  date: string;
  tag: string;
  tint: 'blue' | 'green' | 'gold';
}

export interface Faq {
  question: string;
  answer: string;
  group: string;
}

// --- Misc -------------------------------------------------------------------

export interface Activity {
  id: string;
  icon: string;
  tint: 'blue' | 'green' | 'gold' | 'grey';
  title: string;
  detail: string;
  date: string;
}

export interface Region {
  name: string;
  assemblies: string[];
}
