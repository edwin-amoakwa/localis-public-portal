import { AssemblyService, ServiceCategory } from '../models';

/**
 * The service catalogue. Categories and services mirror what a Ghanaian MMDA
 * actually offers; fees are illustrative and stated as such in the UI.
 */

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'business',
    name: 'Business Services',
    description: 'Operating permits, renewals and changes to your business record.',
    icon: 'pi pi-briefcase',
    tint: 'blue',
  },
  {
    id: 'property',
    name: 'Property Services',
    description: 'Register a property, pay your rates and view your records.',
    icon: 'pi pi-home',
    tint: 'green',
  },
  {
    id: 'building',
    name: 'Building Services',
    description: 'Building, development and planning permission.',
    icon: 'pi pi-building',
    tint: 'gold',
  },
  {
    id: 'environmental',
    name: 'Environmental Services',
    description: 'Food vendor licences, health certificates and sanitation permits.',
    icon: 'pi pi-shield',
    tint: 'green',
  },
  {
    id: 'market',
    name: 'Market Services',
    description: 'Stall allocation, trading licences and market fees.',
    icon: 'pi pi-shopping-bag',
    tint: 'blue',
  },
  {
    id: 'transport',
    name: 'Transport Services',
    description: 'Lorry park permits and commercial vehicle services.',
    icon: 'pi pi-car',
    tint: 'gold',
  },
  {
    id: 'community',
    name: 'Community Services',
    description: 'Burial permits, facility bookings and public event permits.',
    icon: 'pi pi-users',
    tint: 'blue',
  },
];

export const SERVICES: AssemblyService[] = [
  // --- Business -------------------------------------------------------------
  {
    id: 'svc-bop',
    slug: 'business-operating-permit',
    name: 'Business Operating Permit',
    categoryId: 'business',
    summary: 'The permit every business needs to trade lawfully in the district.',
    description:
      'A Business Operating Permit authorises you to operate your business within the ' +
      'Assembly’s jurisdiction for the permit year. It is issued after your details are ' +
      'verified, your premises inspected where required, and the assessed fee settled. ' +
      'The permit runs to 31 December of the year it is issued for, regardless of when in ' +
      'the year you take it out.',
    eligibility: [
      'The business must operate within the district',
      'The business must be registered with the Registrar of Companies',
      'The applicant must be the owner or an authorised representative',
      'Any outstanding fees from previous years must be settled',
    ],
    requirements: [
      'A physical premises within the district, with a digital address',
      'A valid Taxpayer Identification Number (TIN)',
      'Sector licence where the trade requires one (for example FDA or EPA)',
      'Premises must satisfy the environmental health inspection',
    ],
    documents: [
      'Business registration certificate',
      'Ghana Card of the owner',
      'TIN certificate',
      'Tenancy agreement or proof of premises',
      'Photograph of the business premises',
    ],
    processingTime: '5 – 10 working days',
    fees: [
      { name: 'Permit fee', amount: 450, note: 'Varies by category and grade' },
      { name: 'Registration fee', amount: 120, note: 'New businesses only' },
      { name: 'Inspection fee', amount: 80 },
    ],
    faqs: [
      {
        question: 'How long is the permit valid?',
        answer: 'Until 31 December of the permit year. Renewals open at the start of each year.',
      },
      {
        question: 'Do I need one for each district I trade in?',
        answer:
          'Yes. Each Assembly permits businesses operating within its own jurisdiction, so a ' +
          'business trading in three districts needs a permit from each.',
      },
      {
        question: 'Can I trade while my application is being processed?',
        answer:
          'No. You may only operate once the permit has been issued. Submitting an application ' +
          'does not authorise you to trade.',
      },
    ],
    needsBusinessInfo: true,
    needsPropertyInfo: false,
    requiresInspection: true,
    popular: true,
  },
  {
    id: 'svc-bop-renewal',
    slug: 'permit-renewal',
    name: 'Permit Renewal',
    categoryId: 'business',
    summary: 'Renew an existing Business Operating Permit for the new year.',
    description:
      'Renewal carries your existing business details forward, so in most cases you are ' +
      'confirming what has not changed and settling the fee. Renew before the statutory ' +
      'deadline of 31 March to avoid the late-renewal penalty, which is added automatically.',
    eligibility: [
      'You must hold a permit issued by this Assembly',
      'The business must still be trading at the registered premises',
      'Previous years’ fees must be settled in full',
    ],
    requirements: [
      'Your existing permit number',
      'Confirmation that business details are unchanged',
      'A fresh inspection where the category requires one annually',
    ],
    documents: ['Previous year’s permit', 'Latest payment receipt'],
    processingTime: '2 – 5 working days',
    fees: [
      { name: 'Renewal fee', amount: 450 },
      { name: 'Late renewal penalty', amount: 90, note: 'Applies after 31 March' },
    ],
    faqs: [
      {
        question: 'What if my business details have changed?',
        answer:
          'Update them during the renewal. Substantial changes — a new location or a different ' +
          'trade — may require a fresh inspection.',
      },
      {
        question: 'When does the penalty apply?',
        answer: 'To any renewal filed after 31 March of the permit year.',
      },
    ],
    needsBusinessInfo: true,
    needsPropertyInfo: false,
    requiresInspection: false,
    popular: true,
    isRenewal: true,
  },
  {
    id: 'svc-temp-permit',
    slug: 'temporary-permit',
    name: 'Temporary Permit',
    categoryId: 'business',
    summary: 'Short-term authorisation for seasonal or time-limited trading.',
    description:
      'A temporary permit covers trading for a defined period — a festival, a promotion, a ' +
      'seasonal stall — without the commitment of a full annual permit.',
    eligibility: [
      'The activity must be time-limited and stated in the application',
      'The location must be within the district',
    ],
    requirements: ['Start and end dates of the activity', 'Permission of the site owner'],
    documents: ['Ghana Card of the applicant', 'Site owner’s consent letter'],
    processingTime: '1 – 3 working days',
    fees: [{ name: 'Temporary permit fee', amount: 150, note: 'Per 30-day period' }],
    faqs: [
      {
        question: 'Can I extend a temporary permit?',
        answer: 'Yes, apply again before it expires and state the new period.',
      },
    ],
    needsBusinessInfo: true,
    needsPropertyInfo: false,
    requiresInspection: false,
  },
  {
    id: 'svc-business-update',
    slug: 'business-detail-update',
    name: 'Business Detail Update',
    categoryId: 'business',
    summary: 'Change the name, ownership, category or premises on your record.',
    description:
      'Keep the Assembly’s register accurate. Updating your record makes sure notices, ' +
      'invoices and inspection appointments reach the right person at the right place.',
    eligibility: ['You must hold a current record with this Assembly'],
    requirements: ['Evidence supporting the change', 'Authorisation where ownership changes'],
    documents: ['Supporting document for the change', 'Ghana Card of the applicant'],
    processingTime: '2 – 4 working days',
    fees: [{ name: 'Amendment fee', amount: 60 }],
    faqs: [
      {
        question: 'Does a change of premises need a new inspection?',
        answer: 'Usually yes, since the inspection is of the premises rather than the business.',
      },
    ],
    needsBusinessInfo: true,
    needsPropertyInfo: false,
    requiresInspection: false,
  },

  // --- Property -------------------------------------------------------------
  {
    id: 'svc-property-registration',
    slug: 'property-registration',
    name: 'Property Registration',
    categoryId: 'property',
    summary: 'Add a property to the Assembly’s valuation list.',
    description:
      'A property must be on the valuation list before it can be rated correctly. ' +
      'Registering it also ensures rate notices and receipts reach the right owner.',
    eligibility: ['The property must be located within the district', 'You must be the owner or their agent'],
    requirements: ['Digital address of the property', 'Evidence of ownership'],
    documents: ['Title deed or indenture', 'Ghana Card of the owner', 'Site plan'],
    processingTime: '7 – 14 working days',
    fees: [{ name: 'Registration fee', amount: 100 }],
    faqs: [
      {
        question: 'Who sets the rateable value?',
        answer: 'The Assembly’s valuation officer, based on the property’s use, size and location.',
      },
    ],
    needsBusinessInfo: false,
    needsPropertyInfo: true,
    requiresInspection: true,
  },
  {
    id: 'svc-property-rates',
    slug: 'property-rate-payment',
    name: 'Property Rate Payment',
    categoryId: 'property',
    summary: 'Settle the year’s property rates in full or in instalments.',
    description:
      'Property rates fund refuse collection, drains, street lighting and local roads. ' +
      'Pay the year’s rates from your account and download the receipt immediately.',
    eligibility: ['The property must be on the Assembly’s valuation list'],
    requirements: ['Your property number or digital address'],
    documents: ['None — pay directly from your rate account'],
    processingTime: 'Immediate',
    fees: [{ name: 'Annual rate', amount: 480, note: 'Set by rateable value' }],
    faqs: [
      {
        question: 'Can I pay in instalments?',
        answer:
          'Yes, where your Assembly allows part payment. Each payment is receipted and the ' +
          'balance updates as you go.',
      },
    ],
    needsBusinessInfo: false,
    needsPropertyInfo: true,
    requiresInspection: false,
    popular: true,
  },
  {
    id: 'svc-property-records',
    slug: 'property-records',
    name: 'Property Records',
    categoryId: 'property',
    summary: 'Request a copy of the record held for a property.',
    description:
      'Obtain an official statement of what the Assembly holds for a property — its ' +
      'valuation, use, registered ratepayer and rate payment history.',
    eligibility: ['You must be the registered ratepayer or an authorised agent'],
    requirements: ['Property number', 'Reason for the request'],
    documents: ['Ghana Card of the applicant', 'Authorisation letter where acting for the owner'],
    processingTime: '3 – 5 working days',
    fees: [{ name: 'Search and copy fee', amount: 50 }],
    faqs: [
      {
        question: 'Is this proof of ownership?',
        answer:
          'No. It is a record of what the Assembly holds for rating purposes. Title is a matter ' +
          'for the Lands Commission.',
      },
    ],
    needsBusinessInfo: false,
    needsPropertyInfo: true,
    requiresInspection: false,
  },

  // --- Building -------------------------------------------------------------
  {
    id: 'svc-building-permit',
    slug: 'building-permit',
    name: 'Building Permit',
    categoryId: 'building',
    summary: 'Permission to put up, extend or alter a structure.',
    description:
      'A building permit is required before any construction begins. Your drawings are ' +
      'assessed by the Works and Physical Planning departments, and the site is inspected ' +
      'at the stages the Assembly requires.',
    eligibility: [
      'You must own the land or have the owner’s written consent',
      'The proposal must conform to the district planning scheme',
    ],
    requirements: [
      'Architectural and structural drawings by a licensed professional',
      'Site plan and location plan',
      'Land title or allocation documents',
    ],
    documents: [
      'Architectural drawings',
      'Structural drawings',
      'Site plan',
      'Land title or indenture',
      'Ghana Card of the applicant',
    ],
    processingTime: '21 – 60 working days',
    fees: [
      { name: 'Application fee', amount: 250 },
      { name: 'Permit fee', amount: 1800, note: 'Based on floor area and use' },
      { name: 'Inspection fee', amount: 300 },
    ],
    faqs: [
      {
        question: 'Can I start building once I have applied?',
        answer:
          'No. Work started before a permit is issued may be stopped and the structure may be ' +
          'liable to demolition.',
      },
      {
        question: 'How long is a building permit valid?',
        answer: 'Typically five years from issue, within which the work must be substantially completed.',
      },
    ],
    needsBusinessInfo: false,
    needsPropertyInfo: true,
    requiresInspection: true,
    popular: true,
  },
  {
    id: 'svc-development-permit',
    slug: 'development-permit',
    name: 'Development Permit',
    categoryId: 'building',
    summary: 'Permission for a change of use or a wider development.',
    description:
      'Required where you intend to change how land or a building is used, or to carry out ' +
      'development beyond ordinary construction.',
    eligibility: ['The site must be within the district', 'The proposal must fit the planning scheme'],
    requirements: ['A statement of the proposed use', 'Supporting plans'],
    documents: ['Site plan', 'Proposal statement', 'Land documents'],
    processingTime: '21 – 45 working days',
    fees: [{ name: 'Development permit fee', amount: 900 }],
    faqs: [
      {
        question: 'Is this different from a building permit?',
        answer:
          'Yes. A development permit concerns the use of the land; a building permit concerns ' +
          'the structure. Some projects need both.',
      },
    ],
    needsBusinessInfo: false,
    needsPropertyInfo: true,
    requiresInspection: true,
  },
  {
    id: 'svc-planning-approval',
    slug: 'planning-approval',
    name: 'Planning Approval',
    categoryId: 'building',
    summary: 'Formal approval from the Physical Planning Department.',
    description:
      'Planning approval confirms that a proposal conforms to the district’s planning scheme ' +
      'and zoning before detailed permits are issued.',
    eligibility: ['The applicant must have an interest in the land'],
    requirements: ['Zoning confirmation', 'Site and layout plans'],
    documents: ['Layout plan', 'Land documents', 'Ghana Card of the applicant'],
    processingTime: '14 – 30 working days',
    fees: [{ name: 'Planning approval fee', amount: 600 }],
    faqs: [
      {
        question: 'Do I need this before a building permit?',
        answer: 'In most districts, yes — planning approval precedes the building permit.',
      },
    ],
    needsBusinessInfo: false,
    needsPropertyInfo: true,
    requiresInspection: false,
  },

  // --- Environmental --------------------------------------------------------
  {
    id: 'svc-food-vendor',
    slug: 'food-vendor-licence',
    name: 'Food Vendor Licence',
    categoryId: 'environmental',
    summary: 'Licence to prepare or sell food within the district.',
    description:
      'Anyone preparing or selling food to the public needs a food vendor licence. It is ' +
      'issued after the premises pass an environmental health inspection and food handlers ' +
      'hold valid health certificates.',
    eligibility: [
      'The premises must be within the district',
      'All food handlers must hold health certificates',
      'The premises must pass the sanitation inspection',
    ],
    requirements: [
      'Adequate water supply and waste disposal',
      'Hand-washing facilities',
      'Health certificates for all staff handling food',
    ],
    documents: [
      'Health certificates of food handlers',
      'Ghana Card of the applicant',
      'Photograph of the premises',
    ],
    processingTime: '7 – 14 working days',
    fees: [
      { name: 'Licence fee', amount: 220 },
      { name: 'Inspection fee', amount: 80 },
    ],
    faqs: [
      {
        question: 'How often must the premises be inspected?',
        answer: 'At least once a year, and at any time on a complaint.',
      },
    ],
    needsBusinessInfo: true,
    needsPropertyInfo: false,
    requiresInspection: true,
    popular: true,
  },
  {
    id: 'svc-health-certificate',
    slug: 'environmental-health-certificate',
    name: 'Environmental Health Certificate',
    categoryId: 'environmental',
    summary: 'Certificate for individuals handling food or working in regulated premises.',
    description:
      'Issued to an individual after a medical screening, confirming they are fit to handle ' +
      'food or work in premises where a certificate is required by law.',
    eligibility: ['The applicant must complete the required medical screening'],
    requirements: ['Medical screening at an approved facility', 'Passport photograph'],
    documents: ['Medical screening report', 'Ghana Card', 'Passport photograph'],
    processingTime: '3 – 7 working days',
    fees: [{ name: 'Certificate fee', amount: 90 }],
    faqs: [
      {
        question: 'How long is it valid?',
        answer: 'One year from the date of issue.',
      },
    ],
    needsBusinessInfo: false,
    needsPropertyInfo: false,
    requiresInspection: false,
  },
  {
    id: 'svc-sanitation-permit',
    slug: 'sanitation-permit',
    name: 'Sanitation Permit',
    categoryId: 'environmental',
    summary: 'Permit for waste handling, disposal and related activity.',
    description:
      'Required for businesses handling, transporting or disposing of waste, and for ' +
      'premises whose activity has a sanitation impact on the community.',
    eligibility: ['The activity must be carried out within the district'],
    requirements: ['A waste management plan', 'Suitable equipment and containment'],
    documents: ['Waste management plan', 'Business registration certificate'],
    processingTime: '7 – 14 working days',
    fees: [{ name: 'Sanitation permit fee', amount: 350 }],
    faqs: [
      {
        question: 'Does this replace an EPA permit?',
        answer: 'No. Where the EPA also regulates the activity, both are required.',
      },
    ],
    needsBusinessInfo: true,
    needsPropertyInfo: false,
    requiresInspection: true,
  },

  // --- Market ---------------------------------------------------------------
  {
    id: 'svc-stall-allocation',
    slug: 'market-stall-allocation',
    name: 'Market Stall Allocation',
    categoryId: 'market',
    summary: 'Apply for a stall or store in an Assembly market.',
    description:
      'Apply for space in an Assembly market. Where demand exceeds supply you join a ' +
      'waiting list and can see your position on it from your account.',
    eligibility: ['The applicant must be at least 18 years old', 'One stall per trader in most markets'],
    requirements: ['Preferred market and stall type', 'Description of the goods to be traded'],
    documents: ['Ghana Card of the applicant', 'Passport photograph'],
    processingTime: '14 – 30 working days',
    fees: [
      { name: 'Application fee', amount: 50 },
      { name: 'Allocation fee', amount: 400, note: 'Payable on allocation' },
    ],
    faqs: [
      {
        question: 'Can I transfer my stall to someone else?',
        answer: 'Not without the Assembly’s written consent. Unauthorised transfers may be revoked.',
      },
    ],
    needsBusinessInfo: true,
    needsPropertyInfo: false,
    requiresInspection: false,
  },
  {
    id: 'svc-trading-licence',
    slug: 'trading-licence',
    name: 'Trading Licence',
    categoryId: 'market',
    summary: 'Licence for specific trades regulated by the Assembly.',
    description:
      'Certain trades require a licence in addition to a business operating permit. The ' +
      'portal lists what your trade requires before you submit.',
    eligibility: ['The trade must be one the Assembly licenses'],
    requirements: ['Details of the trade and where it is carried on'],
    documents: ['Business registration certificate', 'Ghana Card of the applicant'],
    processingTime: '5 – 10 working days',
    fees: [{ name: 'Trading licence fee', amount: 280 }],
    faqs: [
      {
        question: 'Do I still need an operating permit?',
        answer: 'Yes. A trading licence is in addition to, not instead of, the operating permit.',
      },
    ],
    needsBusinessInfo: true,
    needsPropertyInfo: false,
    requiresInspection: false,
  },
  {
    id: 'svc-market-fees',
    slug: 'market-fee-payment',
    name: 'Market Fee Payment',
    categoryId: 'market',
    summary: 'Settle daily and periodic market tolls.',
    description:
      'Pay your market tolls from your phone and receive an electronic receipt on the spot, ' +
      'instead of holding paper tickets.',
    eligibility: ['You must hold an allocated stall or trade in the market'],
    requirements: ['Your stall number'],
    documents: ['None'],
    processingTime: 'Immediate',
    fees: [{ name: 'Daily toll', amount: 5, note: 'Per trading day' }],
    faqs: [
      {
        question: 'Can I pay for a month at once?',
        answer: 'Yes. Choose the number of days and the total is calculated for you.',
      },
    ],
    needsBusinessInfo: false,
    needsPropertyInfo: false,
    requiresInspection: false,
  },

  // --- Transport ------------------------------------------------------------
  {
    id: 'svc-lorry-park',
    slug: 'lorry-park-permit',
    name: 'Lorry Park Permit',
    categoryId: 'transport',
    summary: 'Permit to operate from an Assembly lorry park or station.',
    description:
      'Authorises a commercial vehicle to load and operate from an Assembly lorry park, ' +
      'with the daily park toll payable through the portal.',
    eligibility: ['The vehicle must be roadworthy and insured', 'The operator must be a registered member of a union or association where required'],
    requirements: ['Vehicle registration details', 'Route or station requested'],
    documents: ['Vehicle registration certificate', 'Roadworthy certificate', 'Driver’s licence'],
    processingTime: '3 – 7 working days',
    fees: [
      { name: 'Permit fee', amount: 320 },
      { name: 'Daily park toll', amount: 8 },
    ],
    faqs: [
      {
        question: 'Is the toll included in the permit fee?',
        answer: 'No. The permit authorises operation; the daily toll is charged separately.',
      },
    ],
    needsBusinessInfo: true,
    needsPropertyInfo: false,
    requiresInspection: false,
  },
  {
    id: 'svc-commercial-vehicle',
    slug: 'commercial-vehicle-services',
    name: 'Commercial Vehicle Services',
    categoryId: 'transport',
    summary: 'Registrations, stickers and station services for commercial vehicles.',
    description:
      'Covers the Assembly-level services a commercial operator needs — annual stickers, ' +
      'station registration and related permits.',
    eligibility: ['The vehicle must be operating commercially within the district'],
    requirements: ['Vehicle and operator details'],
    documents: ['Vehicle registration certificate', 'Insurance certificate'],
    processingTime: '3 – 7 working days',
    fees: [{ name: 'Annual sticker', amount: 180 }],
    faqs: [
      {
        question: 'Does this replace DVLA registration?',
        answer: 'No. DVLA registration is separate and remains a national requirement.',
      },
    ],
    needsBusinessInfo: true,
    needsPropertyInfo: false,
    requiresInspection: false,
  },

  // --- Community ------------------------------------------------------------
  {
    id: 'svc-burial-permit',
    slug: 'burial-permit',
    name: 'Burial Permit',
    categoryId: 'community',
    summary: 'Permit for burial and cemetery space within the district.',
    description:
      'A burial permit is required before an interment in an Assembly cemetery. ' +
      'Applications are treated with priority given the circumstances.',
    eligibility: ['The burial must take place within the district'],
    requirements: ['Certificate of death', 'Preferred cemetery and date'],
    documents: ['Certificate of death', 'Ghana Card of the applicant'],
    processingTime: '1 – 2 working days',
    fees: [
      { name: 'Burial permit fee', amount: 120 },
      { name: 'Cemetery plot fee', amount: 600, note: 'Where a plot is allocated' },
    ],
    faqs: [
      {
        question: 'Can this be expedited?',
        answer:
          'Yes. Burial permits are prioritised, and most are processed within one working day.',
      },
    ],
    needsBusinessInfo: false,
    needsPropertyInfo: false,
    requiresInspection: false,
  },
  {
    id: 'svc-community-centre',
    slug: 'community-centre-booking',
    name: 'Community Centre Booking',
    categoryId: 'community',
    summary: 'Reserve an Assembly hall, park or community centre.',
    description:
      'Book an Assembly facility for a date and time. Availability is shown before you ' +
      'commit, and the booking is confirmed once the fee is settled.',
    eligibility: ['The facility must be available on the requested date'],
    requirements: ['Date, time and purpose of the booking', 'Expected number of attendees'],
    documents: ['Ghana Card of the applicant'],
    processingTime: '2 – 5 working days',
    fees: [
      { name: 'Hall hire, per day', amount: 800 },
      { name: 'Refundable caution deposit', amount: 300 },
    ],
    faqs: [
      {
        question: 'When is the caution deposit refunded?',
        answer: 'After the facility is inspected following your event and found undamaged.',
      },
    ],
    needsBusinessInfo: false,
    needsPropertyInfo: false,
    requiresInspection: false,
  },
  {
    id: 'svc-event-permit',
    slug: 'public-event-permit',
    name: 'Public Event Permit',
    categoryId: 'community',
    summary: 'Authorisation to hold a public event in the district.',
    description:
      'Required for public gatherings, street events and outdoor activity. Sanitation and ' +
      'safety conditions are attached to the permit and must be met.',
    eligibility: ['The organiser must be identifiable and contactable', 'The venue must be suitable for the expected numbers'],
    requirements: [
      'Event plan including date, time and venue',
      'Sanitation and waste arrangements',
      'Security arrangements where numbers require them',
    ],
    documents: ['Event plan', 'Venue owner’s consent', 'Ghana Card of the organiser'],
    processingTime: '7 – 14 working days',
    fees: [
      { name: 'Event permit fee', amount: 400 },
      { name: 'Sanitation deposit', amount: 250, note: 'Refundable' },
    ],
    faqs: [
      {
        question: 'How far in advance should I apply?',
        answer: 'At least three weeks before the event, to allow for the conditions to be agreed.',
      },
    ],
    needsBusinessInfo: false,
    needsPropertyInfo: false,
    requiresInspection: false,
  },
];
