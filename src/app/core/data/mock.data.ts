import {
  Activity,
  AppNotification,
  Appointment,
  Application,
  BusinessProfile,
  Faq,
  Invoice,
  MessageThread,
  NewsItem,
  PropertyProfile,
  Receipt,
  Region,
  StoredDocument,
  UserProfile,
} from '../models';

/**
 * Mock data for the UI-only build. One signed-in persona — Akosua Mensah, a
 * business and property owner in the Ga East Municipal Assembly — with a
 * coherent set of applications, invoices, receipts and documents behind her, so
 * every screen shows something realistic that ties back to the others.
 */

export const CURRENT_USER: UserProfile = {
  id: 'usr-001',
  firstName: 'Akosua',
  lastName: 'Mensah',
  email: 'akosua.mensah@example.com',
  phone: '+233 24 123 4567',
  ghanaCardNo: 'GHA-723451890-4',
  region: 'Greater Accra Region',
  assembly: 'Ga East Municipal Assembly',
  accountType: 'BUSINESS_OWNER',
  digitalAddress: 'GE-183-2401',
  residentialAddress: 'Plot 42, Ashongman Estates, Accra',
  avatarInitials: 'AM',
  memberSince: '2024-02-18',
};

export const REGIONS: Region[] = [
  {
    name: 'Greater Accra Region',
    assemblies: [
      'Accra Metropolitan Assembly',
      'Ga East Municipal Assembly',
      'Ga West Municipal Assembly',
      'La Nkwantanang Madina Municipal Assembly',
      'Tema Metropolitan Assembly',
      'Adentan Municipal Assembly',
    ],
  },
  {
    name: 'Ashanti Region',
    assemblies: [
      'Kumasi Metropolitan Assembly',
      'Obuasi Municipal Assembly',
      'Ejisu Municipal Assembly',
      'Asokwa Municipal Assembly',
    ],
  },
  {
    name: 'Western Region',
    assemblies: ['Sekondi-Takoradi Metropolitan Assembly', 'Tarkwa Nsuaem Municipal Assembly'],
  },
  {
    name: 'Central Region',
    assemblies: ['Cape Coast Metropolitan Assembly', 'Awutu Senya East Municipal Assembly'],
  },
  {
    name: 'Eastern Region',
    assemblies: ['New Juaben South Municipal Assembly', 'Nsawam Adoagyiri Municipal Assembly'],
  },
  {
    name: 'Northern Region',
    assemblies: ['Tamale Metropolitan Assembly', 'Sagnarigu Municipal Assembly'],
  },
  {
    name: 'Volta Region',
    assemblies: ['Ho Municipal Assembly', 'Keta Municipal Assembly'],
  },
  {
    name: 'Bono Region',
    assemblies: ['Sunyani Municipal Assembly', 'Dormaa Central Municipal Assembly'],
  },
];

export const BUSINESSES: BusinessProfile[] = [
  {
    id: 'biz-001',
    businessName: 'Akosua’s Kitchen',
    businessNumber: 'GEA/BUS/000418',
    category: 'Chop Bar & Restaurant',
    ownershipType: 'Sole Proprietorship',
    registrationNo: 'BN-2019-114577',
    tinNo: 'P0012345678',
    natureOfBusiness: 'SERVICES',
    coreBusinessDescription: 'A neighbourhood chop bar serving local dishes for lunch and dinner.',
    yearsInOperation: 6,
    monthsInOperation: 3,
    regionalPresence: [],
    location: 'Ashongman Estates, Accra',
    postalAddress: 'P.O. Box AN 442, Accra',
    digitalAddress: 'GE-183-2401',
    website: '',
    employees: 7,
    assembly: 'Ga East Municipal Assembly',
    status: 'ACTIVE',
  },
  {
    id: 'biz-002',
    businessName: 'Mensah Provisions',
    businessNumber: 'GEA/BUS/000902',
    category: 'Retail Shop',
    ownershipType: 'Sole Proprietorship',
    registrationNo: 'BN-2022-330914',
    tinNo: 'P0012345678',
    natureOfBusiness: 'PRODUCTS',
    coreBusinessDescription: 'General provisions and household goods retail.',
    yearsInOperation: 3,
    monthsInOperation: 9,
    regionalPresence: [],
    location: 'Dome Market, Accra',
    postalAddress: '',
    digitalAddress: 'GE-091-7733',
    website: '',
    employees: 3,
    assembly: 'Ga East Municipal Assembly',
    status: 'ACTIVE',
  },
];

export const PROPERTIES: PropertyProfile[] = [
  {
    id: 'prp-001',
    description: 'Residential house — 3 bedroom',
    propertyNumber: 'GEA/PR/2019/04412',
    use: 'Residential',
    location: 'Plot 42, Ashongman Estates',
    digitalAddress: 'GE-183-2401',
    assembly: 'Ga East Municipal Assembly',
    rateableValue: 240000,
    currentYearRate: 480,
    balance: 0,
  },
  {
    id: 'prp-002',
    description: 'Commercial shop unit',
    propertyNumber: 'GEA/PR/2021/09117',
    use: 'Commercial',
    location: 'Dome Market Road',
    digitalAddress: 'GE-091-7733',
    assembly: 'Ga East Municipal Assembly',
    rateableValue: 130000,
    currentYearRate: 260,
    balance: 110,
  },
];

export const APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    applicationNumber: 'ASP-2026-000124',
    serviceId: 'svc-bop-renewal',
    serviceName: 'Permit Renewal',
    categoryId: 'business',
    submittedDate: '2026-07-08',
    status: 'AWAITING_PAYMENT',
    officer: 'Kofi Boateng',
    assembly: 'Ga East Municipal Assembly',
    amountDue: 450,
    amountPaid: 0,
    subject: 'Akosua’s Kitchen — 2026 renewal',
    invoiceId: 'inv-001',
    documents: [
      { name: '2025 permit certificate.pdf', type: 'PDF', size: '284 KB', uploadedOn: '2026-07-08', verified: true },
      { name: 'Payment receipt 2025.pdf', type: 'PDF', size: '96 KB', uploadedOn: '2026-07-08', verified: true },
    ],
    timeline: [
      { date: '2026-07-08 09:12', status: 'SUBMITTED', title: 'Application submitted', actor: 'You' },
      { date: '2026-07-09 11:40', status: 'UNDER_REVIEW', title: 'Review started', detail: 'Assigned to Kofi Boateng, Revenue Office.', actor: 'Kofi Boateng' },
      { date: '2026-07-11 15:05', status: 'AWAITING_PAYMENT', title: 'Assessed — GH₵ 450.00', detail: 'Invoice GEA/INV/2026/002841 raised. Settle to proceed to approval.', actor: 'Kofi Boateng' },
    ],
    officerComments: 'Details verified against the 2025 record. No change of premises, so no fresh inspection is required.',
  },
  {
    id: 'app-002',
    applicationNumber: 'ASP-2026-000118',
    serviceId: 'svc-food-vendor',
    serviceName: 'Food Vendor Licence',
    categoryId: 'environmental',
    submittedDate: '2026-06-24',
    status: 'INSPECTION_SCHEDULED',
    officer: 'Ama Serwaa',
    assembly: 'Ga East Municipal Assembly',
    amountDue: 300,
    amountPaid: 300,
    subject: 'Akosua’s Kitchen — food vendor licence 2026',
    invoiceId: 'inv-002',
    inspection: {
      scheduledDate: '2026-07-29',
      inspector: 'Ama Serwaa',
      outcome: 'PENDING',
      notes: 'Please ensure a staff member is on site between 09:00 and 12:00.',
    },
    documents: [
      { name: 'Health certificates (7 staff).pdf', type: 'PDF', size: '1.2 MB', uploadedOn: '2026-06-24', verified: true },
      { name: 'Premises photograph.jpg', type: 'JPG', size: '840 KB', uploadedOn: '2026-06-24', verified: true },
      { name: 'Ghana Card.pdf', type: 'PDF', size: '210 KB', uploadedOn: '2026-06-24', verified: true },
    ],
    timeline: [
      { date: '2026-06-24 14:22', status: 'SUBMITTED', title: 'Application submitted', actor: 'You' },
      { date: '2026-06-26 10:03', status: 'UNDER_REVIEW', title: 'Review started', actor: 'Ama Serwaa' },
      { date: '2026-06-30 09:15', status: 'AWAITING_PAYMENT', title: 'Assessed — GH₵ 300.00', actor: 'Ama Serwaa' },
      { date: '2026-07-02 16:48', status: 'NOTE', title: 'Payment received — GH₵ 300.00', detail: 'Receipt GEA/RCT/2026/007713, Mobile Money.', actor: 'System' },
      { date: '2026-07-14 08:30', status: 'INSPECTION_SCHEDULED', title: 'Inspection scheduled for 29 July 2026', detail: 'Environmental Health Officer: Ama Serwaa.', actor: 'Ama Serwaa' },
    ],
    officerComments: 'Health certificates are current. Premises inspection is the last step before issue.',
  },
  {
    id: 'app-003',
    applicationNumber: 'ASP-2026-000097',
    serviceId: 'svc-property-rates',
    serviceName: 'Property Rate Payment',
    categoryId: 'property',
    submittedDate: '2026-05-14',
    status: 'COMPLETED',
    officer: 'Yaw Antwi',
    assembly: 'Ga East Municipal Assembly',
    amountDue: 480,
    amountPaid: 480,
    subject: '2026 property rate — Ashongman Estates',
    invoiceId: 'inv-003',
    documents: [
      { name: 'Rate notice 2026.pdf', type: 'PDF', size: '156 KB', uploadedOn: '2026-05-14', verified: true },
    ],
    timeline: [
      { date: '2026-05-14 08:45', status: 'SUBMITTED', title: 'Rate notice issued', actor: 'System' },
      { date: '2026-05-14 08:45', status: 'AWAITING_PAYMENT', title: 'Amount due — GH₵ 480.00', actor: 'System' },
      { date: '2026-05-16 12:30', status: 'NOTE', title: 'Payment received — GH₵ 480.00', detail: 'Receipt GEA/RCT/2026/005520, Mobile Money.', actor: 'System' },
      { date: '2026-05-16 12:31', status: 'COMPLETED', title: 'Rate account settled for 2026', actor: 'System' },
    ],
  },
  {
    id: 'app-004',
    applicationNumber: 'ASP-2026-000064',
    serviceId: 'svc-bop',
    serviceName: 'Business Operating Permit',
    categoryId: 'business',
    submittedDate: '2026-03-02',
    status: 'APPROVED',
    officer: 'Kofi Boateng',
    assembly: 'Ga East Municipal Assembly',
    amountDue: 380,
    amountPaid: 380,
    subject: 'Mensah Provisions — 2026 permit',
    invoiceId: 'inv-004',
    documents: [
      { name: 'Business registration.pdf', type: 'PDF', size: '410 KB', uploadedOn: '2026-03-02', verified: true },
      { name: 'TIN certificate.pdf', type: 'PDF', size: '188 KB', uploadedOn: '2026-03-02', verified: true },
      { name: 'Tenancy agreement.pdf', type: 'PDF', size: '760 KB', uploadedOn: '2026-03-02', verified: true },
    ],
    timeline: [
      { date: '2026-03-02 10:10', status: 'SUBMITTED', title: 'Application submitted', actor: 'You' },
      { date: '2026-03-04 09:00', status: 'UNDER_REVIEW', title: 'Review started', actor: 'Kofi Boateng' },
      { date: '2026-03-06 14:20', status: 'INSPECTION_SCHEDULED', title: 'Inspection scheduled for 12 March 2026', actor: 'Kofi Boateng' },
      { date: '2026-03-12 11:35', status: 'NOTE', title: 'Inspection passed', detail: 'Premises satisfactory. No conditions imposed.', actor: 'Ama Serwaa' },
      { date: '2026-03-13 09:05', status: 'AWAITING_PAYMENT', title: 'Assessed — GH₵ 380.00', actor: 'Kofi Boateng' },
      { date: '2026-03-14 13:52', status: 'NOTE', title: 'Payment received — GH₵ 380.00', detail: 'Receipt GEA/RCT/2026/002204, Debit Card.', actor: 'System' },
      { date: '2026-03-16 10:00', status: 'APPROVED', title: 'Application approved', detail: 'Permit GEA/BOP/2026/000412 issued.', actor: 'Nana Ofori (Approver)' },
    ],
    officerComments: 'Approved. Permit issued and available for download from your Documents.',
  },
  {
    id: 'app-005',
    applicationNumber: 'ASP-2026-000141',
    serviceId: 'svc-event-permit',
    serviceName: 'Public Event Permit',
    categoryId: 'community',
    submittedDate: '2026-07-19',
    status: 'UNDER_REVIEW',
    officer: 'Esi Danquah',
    assembly: 'Ga East Municipal Assembly',
    amountDue: 0,
    amountPaid: 0,
    subject: 'Community food fair — 12 September 2026',
    documents: [
      { name: 'Event plan.pdf', type: 'PDF', size: '520 KB', uploadedOn: '2026-07-19', verified: false },
      { name: 'Venue consent letter.pdf', type: 'PDF', size: '132 KB', uploadedOn: '2026-07-19', verified: true },
    ],
    timeline: [
      { date: '2026-07-19 16:40', status: 'SUBMITTED', title: 'Application submitted', actor: 'You' },
      { date: '2026-07-22 09:25', status: 'UNDER_REVIEW', title: 'Review started', detail: 'Referred to the Environmental Health unit for sanitation conditions.', actor: 'Esi Danquah' },
    ],
  },
  {
    id: 'app-006',
    applicationNumber: 'ASP-2026-000152',
    serviceId: 'svc-business-update',
    serviceName: 'Business Detail Update',
    categoryId: 'business',
    submittedDate: '2026-07-23',
    status: 'DRAFT',
    officer: '—',
    assembly: 'Ga East Municipal Assembly',
    amountDue: 60,
    amountPaid: 0,
    subject: 'Mensah Provisions — change of category',
    documents: [],
    timeline: [{ date: '2026-07-23 18:02', status: 'DRAFT', title: 'Draft created', actor: 'You' }],
  },
];

export const INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'GEA/INV/2026/002841',
    description: 'Business Operating Permit renewal — Akosua’s Kitchen',
    applicationNumber: 'ASP-2026-000124',
    serviceName: 'Permit Renewal',
    issuedDate: '2026-07-11',
    dueDate: '2026-08-10',
    total: 450,
    paid: 0,
    status: 'UNPAID',
    assembly: 'Ga East Municipal Assembly',
    items: [{ name: 'Permit renewal fee 2026', amount: 450 }],
  },
  {
    id: 'inv-005',
    invoiceNumber: 'GEA/INV/2026/002903',
    description: 'Property rate 2026 — Dome Market Road shop unit',
    serviceName: 'Property Rate Payment',
    issuedDate: '2026-07-01',
    dueDate: '2026-09-30',
    total: 260,
    paid: 150,
    status: 'PART_PAID',
    assembly: 'Ga East Municipal Assembly',
    items: [{ name: 'Annual property rate 2026', amount: 260 }],
  },
  {
    id: 'inv-002',
    invoiceNumber: 'GEA/INV/2026/002590',
    description: 'Food Vendor Licence — Akosua’s Kitchen',
    applicationNumber: 'ASP-2026-000118',
    serviceName: 'Food Vendor Licence',
    issuedDate: '2026-06-30',
    dueDate: '2026-07-30',
    total: 300,
    paid: 300,
    status: 'PAID',
    assembly: 'Ga East Municipal Assembly',
    items: [
      { name: 'Licence fee', amount: 220 },
      { name: 'Inspection fee', amount: 80 },
    ],
  },
  {
    id: 'inv-003',
    invoiceNumber: 'GEA/INV/2026/002110',
    description: 'Property rate 2026 — Ashongman Estates',
    applicationNumber: 'ASP-2026-000097',
    serviceName: 'Property Rate Payment',
    issuedDate: '2026-05-14',
    dueDate: '2026-06-30',
    total: 480,
    paid: 480,
    status: 'PAID',
    assembly: 'Ga East Municipal Assembly',
    items: [{ name: 'Annual property rate 2026', amount: 480 }],
  },
  {
    id: 'inv-004',
    invoiceNumber: 'GEA/INV/2026/000885',
    description: 'Business Operating Permit — Mensah Provisions',
    applicationNumber: 'ASP-2026-000064',
    serviceName: 'Business Operating Permit',
    issuedDate: '2026-03-13',
    dueDate: '2026-04-12',
    total: 380,
    paid: 380,
    status: 'PAID',
    assembly: 'Ga East Municipal Assembly',
    items: [
      { name: 'Permit fee 2026', amount: 300 },
      { name: 'Inspection fee', amount: 80 },
    ],
  },
];

export const RECEIPTS: Receipt[] = [
  {
    id: 'rct-001',
    receiptNumber: 'GEA/RCT/2026/007713',
    invoiceNumber: 'GEA/INV/2026/002590',
    description: 'Food Vendor Licence — Akosua’s Kitchen',
    paidDate: '2026-07-02',
    amount: 300,
    method: 'MOBILE_MONEY',
    reference: 'MM-884213097',
    payer: 'Akosua Mensah',
    assembly: 'Ga East Municipal Assembly',
  },
  {
    id: 'rct-002',
    receiptNumber: 'GEA/RCT/2026/006442',
    invoiceNumber: 'GEA/INV/2026/002903',
    description: 'Property rate 2026 — part payment',
    paidDate: '2026-07-05',
    amount: 150,
    method: 'MOBILE_MONEY',
    reference: 'MM-901447712',
    payer: 'Akosua Mensah',
    assembly: 'Ga East Municipal Assembly',
  },
  {
    id: 'rct-003',
    receiptNumber: 'GEA/RCT/2026/005520',
    invoiceNumber: 'GEA/INV/2026/002110',
    description: 'Property rate 2026 — Ashongman Estates',
    paidDate: '2026-05-16',
    amount: 480,
    method: 'MOBILE_MONEY',
    reference: 'MM-773310558',
    payer: 'Akosua Mensah',
    assembly: 'Ga East Municipal Assembly',
  },
  {
    id: 'rct-004',
    receiptNumber: 'GEA/RCT/2026/002204',
    invoiceNumber: 'GEA/INV/2026/000885',
    description: 'Business Operating Permit — Mensah Provisions',
    paidDate: '2026-03-14',
    amount: 380,
    method: 'DEBIT_CARD',
    reference: 'CD-4471-88210',
    payer: 'Akosua Mensah',
    assembly: 'Ga East Municipal Assembly',
  },
];

export const DOCUMENTS: StoredDocument[] = [
  {
    id: 'doc-001',
    name: 'Business Operating Permit 2026 — Mensah Provisions',
    kind: 'PERMIT',
    reference: 'GEA/BOP/2026/000412',
    issuedDate: '2026-03-16',
    expiryDate: '2026-12-31',
    sizeLabel: '318 KB',
    assembly: 'Ga East Municipal Assembly',
    status: 'VALID',
  },
  {
    id: 'doc-002',
    name: 'Business Operating Permit 2025 — Akosua’s Kitchen',
    kind: 'PERMIT',
    reference: 'GEA/BOP/2025/000377',
    issuedDate: '2025-02-20',
    expiryDate: '2025-12-31',
    sizeLabel: '312 KB',
    assembly: 'Ga East Municipal Assembly',
    status: 'EXPIRED',
  },
  {
    id: 'doc-003',
    name: 'Environmental Health Certificate — Akosua Mensah',
    kind: 'CERTIFICATE',
    reference: 'GEA/EHC/2026/001188',
    issuedDate: '2026-01-30',
    expiryDate: '2026-09-15',
    sizeLabel: '204 KB',
    assembly: 'Ga East Municipal Assembly',
    status: 'EXPIRING',
  },
  {
    id: 'doc-004',
    name: 'Property Rate Notice 2026 — Ashongman Estates',
    kind: 'NOTICE',
    reference: 'GEA/PRN/2026/044120',
    issuedDate: '2026-05-14',
    sizeLabel: '156 KB',
    assembly: 'Ga East Municipal Assembly',
    status: 'VALID',
  },
  {
    id: 'doc-005',
    name: 'Payment Receipt — GEA/RCT/2026/005520',
    kind: 'RECEIPT',
    reference: 'GEA/RCT/2026/005520',
    issuedDate: '2026-05-16',
    sizeLabel: '88 KB',
    assembly: 'Ga East Municipal Assembly',
    status: 'VALID',
  },
  {
    id: 'doc-006',
    name: 'Approval Letter — Business Operating Permit',
    kind: 'LETTER',
    reference: 'GEA/LTR/2026/000412',
    issuedDate: '2026-03-16',
    sizeLabel: '112 KB',
    assembly: 'Ga East Municipal Assembly',
    status: 'VALID',
  },
  {
    id: 'doc-007',
    name: 'Payment Receipt — GEA/RCT/2026/007713',
    kind: 'RECEIPT',
    reference: 'GEA/RCT/2026/007713',
    issuedDate: '2026-07-02',
    sizeLabel: '86 KB',
    assembly: 'Ga East Municipal Assembly',
    status: 'VALID',
  },
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'ntf-001',
    kind: 'INSPECTION',
    title: 'Inspection scheduled for 29 July 2026',
    body: 'Your food vendor licence application ASP-2026-000118 will be inspected by Ama Serwaa between 09:00 and 12:00.',
    date: '2026-07-14 08:30',
    read: false,
    link: '/app/applications/app-002',
  },
  {
    id: 'ntf-002',
    kind: 'PAYMENT',
    title: 'Payment due — GH₵ 450.00',
    body: 'Invoice GEA/INV/2026/002841 for your permit renewal is due by 10 August 2026.',
    date: '2026-07-11 15:06',
    read: false,
    link: '/app/payments',
  },
  {
    id: 'ntf-003',
    kind: 'PERMIT',
    title: 'Health certificate expiring in 8 weeks',
    body: 'Your Environmental Health Certificate GEA/EHC/2026/001188 expires on 15 September 2026. Renew in good time.',
    date: '2026-07-10 07:00',
    read: false,
    link: '/app/documents',
  },
  {
    id: 'ntf-004',
    kind: 'APPLICATION',
    title: 'Application under review',
    body: 'ASP-2026-000141 (Public Event Permit) has been taken up for review by Esi Danquah.',
    date: '2026-07-22 09:25',
    read: true,
    link: '/app/applications/app-005',
  },
  {
    id: 'ntf-005',
    kind: 'ANNOUNCEMENT',
    title: 'Market stall allocation opens at Dome Market',
    body: 'Applications for stalls and stores are open until 30 August 2026.',
    date: '2026-07-06 10:00',
    read: true,
  },
  {
    id: 'ntf-006',
    kind: 'PAYMENT',
    title: 'Payment received — GH₵ 300.00',
    body: 'Receipt GEA/RCT/2026/007713 has been issued for invoice GEA/INV/2026/002590.',
    date: '2026-07-02 16:48',
    read: true,
    link: '/app/payments',
  },
  {
    id: 'ntf-007',
    kind: 'APPLICATION',
    title: 'Permit issued — GEA/BOP/2026/000412',
    body: 'Your Business Operating Permit for Mensah Provisions has been issued and is available to download.',
    date: '2026-03-16 10:02',
    read: true,
    link: '/app/documents',
  },
];

export const APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    kind: 'INSPECTION',
    title: 'Environmental health inspection — Akosua’s Kitchen',
    date: '2026-07-29',
    time: '09:00 – 12:00',
    location: 'Ashongman Estates, Accra',
    officer: 'Ama Serwaa',
    reference: 'ASP-2026-000118',
    status: 'SCHEDULED',
    notes: 'Please have a staff member on site. Health certificates should be available for sighting.',
  },
  {
    id: 'apt-002',
    kind: 'MEETING',
    title: 'Event permit conditions meeting',
    date: '2026-08-05',
    time: '11:00 – 11:45',
    location: 'Ga East Municipal Assembly, Abokobi',
    officer: 'Esi Danquah',
    reference: 'ASP-2026-000141',
    status: 'SCHEDULED',
    notes: 'To agree sanitation and security arrangements for the community food fair.',
  },
  {
    id: 'apt-003',
    kind: 'OFFICER_VISIT',
    title: 'Revenue officer visit — Dome Market shop',
    date: '2026-08-14',
    time: '14:00 – 15:00',
    location: 'Dome Market Road',
    officer: 'Yaw Antwi',
    reference: 'GEA/PR/2021/09117',
    status: 'SCHEDULED',
  },
  {
    id: 'apt-004',
    kind: 'INSPECTION',
    title: 'Premises inspection — Mensah Provisions',
    date: '2026-03-12',
    time: '10:00 – 11:00',
    location: 'Dome Market Road',
    officer: 'Ama Serwaa',
    reference: 'ASP-2026-000064',
    status: 'COMPLETED',
    notes: 'Passed. No conditions imposed.',
  },
];

export const MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'msg-001',
    subject: 'Inspection date for ASP-2026-000118',
    assembly: 'Ga East Municipal Assembly',
    officer: 'Ama Serwaa',
    lastMessageDate: '2026-07-14 08:35',
    unread: true,
    messages: [
      {
        id: 'm-1',
        from: 'ASSEMBLY',
        author: 'Ama Serwaa, Environmental Health',
        date: '2026-07-14 08:30',
        body: 'Good morning. Your premises inspection has been scheduled for Wednesday 29 July, between 09:00 and 12:00. Please have a member of staff on site.',
      },
      {
        id: 'm-2',
        from: 'ME',
        author: 'You',
        date: '2026-07-14 08:33',
        body: 'Noted, thank you. I will be there myself. Should I have the staff health certificates ready?',
      },
      {
        id: 'm-3',
        from: 'ASSEMBLY',
        author: 'Ama Serwaa, Environmental Health',
        date: '2026-07-14 08:35',
        body: 'Yes please, the originals for sighting. We already have the copies you uploaded.',
      },
    ],
  },
  {
    id: 'msg-002',
    subject: 'Renewal invoice GEA/INV/2026/002841',
    assembly: 'Ga East Municipal Assembly',
    officer: 'Kofi Boateng',
    lastMessageDate: '2026-07-11 15:20',
    unread: false,
    messages: [
      {
        id: 'm-4',
        from: 'ASSEMBLY',
        author: 'Kofi Boateng, Revenue',
        date: '2026-07-11 15:10',
        body: 'Your renewal has been assessed at GH₵ 450.00. The invoice is on your account and is due by 10 August 2026.',
      },
      {
        id: 'm-5',
        from: 'ME',
        author: 'You',
        date: '2026-07-11 15:20',
        body: 'Thank you. Can I settle it in two payments?',
      },
    ],
  },
  {
    id: 'msg-003',
    subject: 'Community food fair — sanitation conditions',
    assembly: 'Ga East Municipal Assembly',
    officer: 'Esi Danquah',
    lastMessageDate: '2026-07-22 09:30',
    unread: false,
    messages: [
      {
        id: 'm-6',
        from: 'ASSEMBLY',
        author: 'Esi Danquah, Community Services',
        date: '2026-07-22 09:30',
        body: 'We have referred your event application to Environmental Health for sanitation conditions. A meeting has been proposed for 5 August.',
      },
    ],
  },
];

export const ACTIVITIES: Activity[] = [
  {
    id: 'act-001',
    icon: 'pi pi-calendar',
    tint: 'gold',
    title: 'Inspection scheduled',
    detail: 'ASP-2026-000118 · 29 July 2026, 09:00 – 12:00',
    date: '2026-07-14',
  },
  {
    id: 'act-002',
    icon: 'pi pi-credit-card',
    tint: 'blue',
    title: 'Invoice raised — GH₵ 450.00',
    detail: 'GEA/INV/2026/002841 · due 10 August 2026',
    date: '2026-07-11',
  },
  {
    id: 'act-003',
    icon: 'pi pi-check-circle',
    tint: 'green',
    title: 'Payment received — GH₵ 300.00',
    detail: 'Receipt GEA/RCT/2026/007713 · Mobile Money',
    date: '2026-07-02',
  },
  {
    id: 'act-004',
    icon: 'pi pi-file',
    tint: 'grey',
    title: 'Application submitted',
    detail: 'ASP-2026-000141 · Public Event Permit',
    date: '2026-07-19',
  },
  {
    id: 'act-005',
    icon: 'pi pi-verified',
    tint: 'green',
    title: 'Permit issued',
    detail: 'GEA/BOP/2026/000412 · Mensah Provisions',
    date: '2026-03-16',
  },
];

export const NEWS: NewsItem[] = [
  {
    id: 'news-001',
    title: 'Food vendor licensing now available online',
    summary:
      'Food vendors can apply, book their health inspection and receive the certificate digitally in participating districts.',
    body:
      'Food vendors in participating districts can now complete the whole licensing process on the portal. ' +
      'Applications are submitted online, the environmental health inspection is booked from the same screen, ' +
      'and the certificate is issued digitally once the premises pass. Vendors no longer need to visit the ' +
      'Assembly to file the application or collect the licence.',
    date: '2026-07-15',
    tag: 'New service',
    tint: 'green',
  },
  {
    id: 'news-002',
    title: '2026 property rate notices have been issued',
    summary:
      'Rate notices are on ratepayers’ accounts. Settle online to avoid the penalty that applies after the deadline.',
    body:
      'Property rate notices for 2026 are now available on ratepayers’ accounts. Rates can be settled in full ' +
      'or in instalments where the Assembly permits, and a receipt is issued immediately on payment. ' +
      'Ratepayers are encouraged to settle before the deadline to avoid the penalty.',
    date: '2026-07-01',
    tag: 'Public notice',
    tint: 'blue',
  },
  {
    id: 'news-003',
    title: 'Business permit renewals reopen for the new year',
    summary:
      'Renew before the statutory deadline to avoid late-renewal penalties on your Business Operating Permit.',
    body:
      'Renewals are open for the 2026 permit year. Business details carry over from the previous year, so most ' +
      'renewals take only a few minutes to complete. A late-renewal penalty is added automatically to renewals ' +
      'filed after 31 March.',
    date: '2026-06-20',
    tag: 'Service update',
    tint: 'gold',
  },
  {
    id: 'news-004',
    title: 'Market stall allocation opens at two markets',
    summary:
      'Applications for stalls and stores are open at selected Assembly markets, with waiting-list positions visible online.',
    body:
      'Traders can now apply for stalls and stores at selected Assembly markets through the portal. Where demand ' +
      'exceeds available space, applicants join a waiting list and can see their position on it from their account. ' +
      'Allocations are notified through the portal.',
    date: '2026-06-06',
    tag: 'New service',
    tint: 'green',
  },
  {
    id: 'news-005',
    title: 'QR code payments accepted at revenue desks',
    summary:
      'Scan the code on an invoice or rate notice and settle it instantly, at the Assembly or in the field.',
    body:
      'Every invoice and rate notice now carries a QR code. Scanning it opens the payment screen with the ' +
      'invoice already selected, so a payment can be made in seconds at a revenue desk or in the field. ' +
      'The receipt is issued on the spot.',
    date: '2026-05-22',
    tag: 'New service',
    tint: 'blue',
  },
  {
    id: 'news-006',
    title: 'Beware of unofficial payment requests',
    summary:
      'Assembly fees are payable only through the portal or at an official revenue desk, and always carry a receipt number.',
    body:
      'The public is reminded that Assembly fees are payable only through the portal or at an official revenue ' +
      'desk. Every payment is receipted with an Assembly receipt number. Do not pay fees into a personal account, ' +
      'and report any such request to the Assembly.',
    date: '2026-04-02',
    tag: 'Public notice',
    tint: 'gold',
  },
];

export const FAQS: Faq[] = [
  {
    group: 'Getting started',
    question: 'What is Assembly Services Portal?',
    answer:
      'ASP is a single online platform through which Metropolitan, Municipal and District Assemblies in Ghana ' +
      'deliver their services — applications, permits, licences, property rates, payments and public information, ' +
      'all in one place.',
  },
  {
    group: 'Getting started',
    question: 'Who can use the portal?',
    answer:
      'Citizens, business owners, property owners and organisations. Each account type sees the services and ' +
      'records that apply to it.',
  },
  {
    group: 'Getting started',
    question: 'How do I create an account?',
    answer:
      'Choose Register, pick your account type, and provide your details including your Ghana Card number. ' +
      'One account covers every district you deal with.',
  },
  {
    group: 'Getting started',
    question: 'Is the portal available in my district?',
    answer:
      'Assemblies come onto the portal in stages, and each chooses which services to open first. When you sign ' +
      'in you will see the districts and services currently available.',
  },
  {
    group: 'Applications',
    question: 'How do I apply for a Business Operating Permit?',
    answer:
      'Choose the service, describe your business and premises, upload the supporting documents and submit. ' +
      'The Assembly reviews it, arranges an inspection where required, and raises your invoice. Once paid and ' +
      'approved, the permit is issued to your account.',
  },
  {
    group: 'Applications',
    question: 'Can I track my application?',
    answer:
      'Yes. Every application shows its current stage with the date it reached it, and the full history is on ' +
      'the application timeline.',
  },
  {
    group: 'Applications',
    question: 'My application was returned. What now?',
    answer:
      'A returned application has not been rejected. Read the officer’s remarks, correct what is asked for, ' +
      'and submit it again. It returns to the same officer.',
  },
  {
    group: 'Applications',
    question: 'How do I renew my permit?',
    answer:
      'Open the business and choose Renew. Your details carry over, so you mostly confirm what has not changed ' +
      'and settle the fee. Renew before 31 March to avoid the late-renewal penalty.',
  },
  {
    group: 'Payments',
    question: 'Can I pay online?',
    answer:
      'Yes — by mobile money, debit card, credit card, bank transfer or QR code. The portal never stores your PIN.',
  },
  {
    group: 'Payments',
    question: 'Can I pay in instalments?',
    answer:
      'Where your Assembly allows part payment, yes. Each payment is receipted and the balance updates as you go. ' +
      'A permit is normally only issued once the assessed amount is settled in full.',
  },
  {
    group: 'Payments',
    question: 'I paid but my balance has not changed.',
    answer:
      'Confirmations occasionally arrive late. Wait a few minutes and refresh. If it still has not appeared, ' +
      'contact support with the transaction reference from your network or bank.',
  },
  {
    group: 'Support',
    question: 'Who do I contact for support?',
    answer:
      'For the portal itself — signing in, uploads, payments — contact technical support. For a decision on your ' +
      'application or a fee charged, contact your Assembly directly.',
  },
  {
    group: 'Support',
    question: 'Is my information safe?',
    answer:
      'Your information is used to deliver the services you request. Access within an Assembly is limited by ' +
      'role, and every action taken on your records is logged.',
  },
];
