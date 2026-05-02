import type { LucideIcon } from 'lucide-react';
import {
  Bell, CheckCircle2, Filter, Heart, Home, Info, Mail, MapPin,
  MessageCircle, Phone, Search, ShieldCheck, ShoppingBag, Star,
  User, Wallet, FileText, Lock,
} from 'lucide-react';

export type GuideSubstep = { title: string; icon: LucideIcon; content: string };
export type GuidePhase = { id: string; title: string; summary: string; icon: LucideIcon; colorClass: string; substeps: GuideSubstep[] };

export const guidePhases: GuidePhase[] = [
  {
    id: 'account',
    title: '1. Create & set up your account',
    summary: 'Sign up as a resident or landlord. A complete profile unlocks full platform features and builds trust with other users.',
    icon: User,
    colorClass: 'bg-blue-50 text-blue-600',
    substeps: [
      {
        title: 'Sign up & choose your role',
        icon: User,
        content:
          'Tap Account → Sign up. Select Resident if you are looking for housing or marketplace items, or Landlord if you own or manage properties. You can sign up with email & password, or use Google sign-in. Your role affects which features you see — landlords get "Post House" and a dashboard, residents get smart search and a wishlist.',
      },
      {
        title: 'Complete your profile',
        icon: Star,
        content:
          'Navigate to Account → Profile & settings. Add your full name, phone number, short bio, and a clear photo. A complete profile earns you a higher trust score, which makes landlords and buyers more likely to respond. You can also set your preferred notification channels here.',
      },
      {
        title: 'Email verification & sign-in',
        icon: Mail,
        content:
          'If email verification is enabled, check your inbox and click the link before posting. For password resets, use Forgot Password on the login screen — a secure link is sent to your registered email. If you used Google sign-in, manage your password via your Google account.',
      },
      {
        title: 'Password & account security',
        icon: Lock,
        content:
          'Use a strong, unique password. Never share it or any OTPs with anyone — including people claiming to be Skitech staff. If you suspect your account is compromised, change your password immediately and contact support from Help → Contact.',
      },
      {
        title: 'What you unlock with an account',
        icon: CheckCircle2,
        content:
          'Residents: save houses & items to Wishlist, send viewing requests to landlords, post marketplace items, and receive real-time notifications. Landlords: post house listings, manage their properties from the landlord dashboard, view analytics (views, favourites, inquiries), and update listing status. All users: receive bell notifications for activity on their listings or favourites, rate houses and landlords, and access full contact history.',
      },
    ],
  },
  {
    id: 'search',
    title: '2. Searching & finding the right place',
    summary: 'Use filters, keyword search, and the map hints to find verified houses near campus fast.',
    icon: Search,
    colorClass: 'bg-orange-50 text-orange-600',
    substeps: [
      {
        title: 'Global search bar',
        icon: Search,
        content:
          'The search bar on the homepage searches across houses AND marketplace items simultaneously. Type a location (e.g. "Kangaru"), a house type (e.g. "bedsitter"), or an amenity (e.g. "WiFi") and results appear instantly. Press the Search button or hit Enter for full results.',
      },
      {
        title: 'Filter by type, price & distance',
        icon: Filter,
        content:
          'On the Houses page, use the filter bar at the top to narrow by house type (bedsitter, single room, 1BR, 2BR, studio), price range, and location keywords. Distance is shown in km from campus — sort by nearest first when you need to walk. Re-apply filters as your needs change.',
      },
      {
        title: 'Reading a listing',
        icon: Home,
        content:
          'Each house card shows rent, deposit, distance, amenity icons, and a verified badge if the landlord is vetted. On the detail page you see a full photo gallery, amenity list, description, Google Maps directions link, landlord info, reputation score, and tenant reviews. Check all of this before messaging.',
      },
      {
        title: 'Saving to Wishlist',
        icon: Heart,
        content:
          'Tap the heart icon on any house or item card to save it. Open the Saved tab (bottom nav) to review your shortlist side-by-side. Saved items stay in your account across sessions. Use this to compare 3–5 options before committing to any viewings.',
      },
    ],
  },
  {
    id: 'communicate',
    title: '3. Contacting landlords & sellers',
    summary: 'Reach out via WhatsApp or call directly from the listing. Use the "Request to View" form for a tracked inquiry.',
    icon: Phone,
    colorClass: 'bg-green-50 text-green-600',
    substeps: [
      {
        title: '"Request to View" form',
        icon: MessageCircle,
        content:
          'On the house detail page, tap Request to View. A message form opens pre-filled with the listing title and your name. Write your move-in date, questions about availability, and send. This creates a tracked email inquiry to the landlord, giving you a paper trail. You must be logged in to send a viewing request.',
      },
      {
        title: 'WhatsApp & phone buttons',
        icon: Phone,
        content:
          'Tap WhatsApp to open a pre-written message in WhatsApp with the house title included. Tap Call to dial directly. These connect you instantly but are not tracked by Skitech — save the number and screenshot any key agreements.',
      },
      {
        title: 'Questions to ask a landlord',
        icon: Info,
        content:
          'Ask about: exact move-in date, included utilities (water, electricity), garbage collection, security arrangements, guest policies, penalty for early exit, deposit refund timelines, and any planned renovations. Get these in writing before you pay anything.',
      },
      {
        title: 'Marketplace sellers',
        icon: ShoppingBag,
        content:
          'On item detail pages, use the WhatsApp or Call buttons. Agree on a public meetup point near campus. Inspect the item thoroughly before paying. Never send money in advance for items you have not seen. For high-value electronics, test functionality on the spot.',
      },
    ],
  },
  {
    id: 'notifications',
    title: '4. Notifications & activity centre',
    summary: 'The bell icon shows real-time updates. Know what each notification means and what actions you can take.',
    icon: Bell,
    colorClass: 'bg-purple-50 text-purple-600',
    substeps: [
      {
        title: 'Types of notifications',
        icon: Bell,
        content:
          'You receive notifications for: (1) A user favourited your listing, (2) Your listing was viewed multiple times in a short window, (3) Your marketplace item was approved and went live, (4) A new listing matching your saved search was posted, (5) A system alert or account update. The icon badge on the bell shows unread count.',
      },
      {
        title: 'Actions inside a notification',
        icon: CheckCircle2,
        content:
          'Tap a notification to go directly to the related listing or account page. Swipe or use the menu to Mark as read, Mute (stop future alerts for that category), or Delete. You can also Mark all read from the notifications page header to clear the badge quickly.',
      },
      {
        title: 'Muting & managing alerts',
        icon: ShieldCheck,
        content:
          'If a notification type is noisy, mute it from the notification item options. Muting a category stops future alerts of that type only — you still receive other types. To re-enable, go to Account → Notification settings. Your preferences are saved to your account.',
      },
      {
        title: 'Landlord-specific alerts',
        icon: Star,
        content:
          'Landlords see extra notifications when someone requests to view a property, or when a listing\'s status changes (approved, pending, rejected). A quick response to viewing requests improves your reputation score on the platform.',
      },
    ],
  },
  {
    id: 'closing',
    title: '5. Closing the deal safely',
    summary: 'Inspect in person, read the lease, pay only through agreed methods, and document every step.',
    icon: MapPin,
    colorClass: 'bg-rose-50 text-rose-600',
    substeps: [
      {
        title: 'Physical viewing checklist',
        icon: Home,
        content:
          'Test: running water pressure, all light switches, window locks, door security (deadbolt vs. padlock), drainage in bathroom/kitchen, ceiling and wall for damp patches. Take dated photos before move-in. Ask who is responsible for repairs under the lease.',
      },
      {
        title: 'Lease & deposit rules',
        icon: FileText,
        content:
          'Read the rental agreement before signing. Key clauses to check: monthly rent amount, deposit size (usually one month\'s rent in Embu), notice period, deposit refund timeline, early exit penalties, and what happens if the landlord sells. Skitech does not provide legal advice — consult a local housing professional if unsure.',
      },
      {
        title: 'Payments & receipts',
        icon: Wallet,
        content:
          'Skitech does not collect or process rent or deposits. Pay directly to the landlord via agreed channels (M-Pesa or bank) and always get a receipt or confirmation SMS. If anyone asks for "platform fees" or "activation fees" to unlock a listing, this is a scam — report it immediately via Help → Safety.',
      },
      {
        title: 'Move-in documentation',
        icon: CheckCircle2,
        content:
          'Before receiving keys: agree on meter readings (electricity, water), count keys and note which doors each opens, photograph any pre-existing damage, and confirm the garbage collection schedule. Keep a copy of your signed lease somewhere safe and accessible.',
      },
    ],
  },
];

export type FaqCategory = { category: string; questions: { q: string; a: string }[] };

export const faqCategories: FaqCategory[] = [
  {
    category: 'Getting started',
    questions: [
      {
        q: 'How do I create a Skitech account?',
        a: 'Go to Account in the bottom navigation and tap Sign up. Choose your role — Resident if you are hunting for housing or marketplace items, or Landlord if you list properties. Enter your name, email, and password, or continue with Google. You can also complete your profile later under Account → Profile & settings.',
      },
      {
        q: 'What is the difference between Resident and Landlord accounts?',
        a: 'Resident accounts are for people looking for housing or buying items. They can search, save to wishlist, send viewing requests, and post marketplace items. Landlord accounts can do all of that plus post house listings, access a landlord dashboard, and view analytics like how many people viewed or saved a listing.',
      },
      {
        q: 'Is Skitech free to use?',
        a: 'Yes. Browsing, saving listings, sending viewing requests, and contacting landlords is free for residents. Posting marketplace items is also free. Landlord listing features are currently free; premium features may be introduced in future updates.',
      },
      {
        q: 'What areas does Skitech serve?',
        a: 'Skitech is focused on Embu and the areas surrounding the University of Embu campus — including Kangaru Road, Embu Town, Majimbo Estate, Dallas Estate, and nearby estates. Always confirm the exact address of a listing during a viewing.',
      },
      {
        q: 'I forgot my password. What should I do?',
        a: 'On the login screen, tap Forgot password and enter your registered email. A secure reset link will be sent to your inbox. Check spam if it does not arrive within two minutes. If you signed up with Google, manage your password through your Google account instead.',
      },
    ],
  },
  {
    category: 'Houses & rentals',
    questions: [
      {
        q: 'Are listings verified?',
        a: 'Listings from landlords who have completed our verification process display a Verified badge. We review documentation before awarding this badge. However, always conduct your own physical viewing and check all details before paying anything — no online platform can fully replace in-person due diligence.',
      },
      {
        q: 'How do I contact a landlord?',
        a: 'Open the house detail page and use Request to View (sends a tracked email inquiry), WhatsApp (opens a pre-written message), or Call. The "Request to View" option requires you to be logged in and gives you a written record of the contact.',
      },
      {
        q: 'How do I save a house to look at later?',
        a: 'Tap the heart icon on any house card or on the detail page. The listing is saved to your Wishlist, accessible from the bottom navigation under Saved. Your wishlist is tied to your account, so it persists across devices and sessions.',
      },
      {
        q: 'How do I know if a house is still available?',
        a: 'Listings marked "Available" are active. If a listing was recently updated or has many recent views, availability is more likely. The safest way to confirm is to contact the landlord directly before visiting.',
      },
      {
        q: 'Can I negotiate rent through the platform?',
        a: 'Yes — negotiation happens directly between you and the landlord via WhatsApp, phone, or the inquiry form. Skitech does not mediate pricing. Any agreed changes to the advertised price should be confirmed in your written lease agreement.',
      },
      {
        q: 'What does the distance figure on a listing mean?',
        a: 'It shows the approximate distance in kilometres from the University of Embu main gate. This is an estimate set by the landlord — verify the actual walking or transport time during your viewing.',
      },
      {
        q: 'What should I check during a property viewing?',
        a: 'Test water pressure, all light switches, window and door locks, drainage in the bathroom and kitchen, and look for damp patches on ceilings and walls. Take dated photos before you move in so you have evidence of pre-existing condition if there is a dispute later.',
      },
    ],
  },
  {
    category: 'Landlords & listing',
    questions: [
      {
        q: 'How do I post a house listing?',
        a: 'You need a Landlord account. Go to the menu or tap the Post House button, fill in the title, house type, location, rent, deposit, description, amenities, and upload at least one photo. After submitting, your listing enters a review queue and will go live once approved.',
      },
      {
        q: 'How long does listing approval take?',
        a: 'Most listings are reviewed within 24 hours. You will receive a notification when your listing is approved, pending further info, or rejected. If your listing is rejected, the reason is provided so you can correct and resubmit.',
      },
      {
        q: 'How do I know someone is interested in my listing?',
        a: 'You receive notifications when someone favourites your listing, when it gets a spike in views, or when a resident sends a "Request to View" inquiry. Respond quickly — landlords with fast response times get higher reputation scores which are visible to prospective tenants.',
      },
      {
        q: 'Can I edit or remove a listing?',
        a: 'Yes. Go to your Landlord Dashboard, find the listing, and use the Edit or Remove options. Editing requires re-approval for significant changes. Removing a listing immediately makes it unavailable to new viewers.',
      },
      {
        q: 'What photos should I upload?',
        a: 'Upload clear, bright photos of: the exterior/entrance, every bedroom, the bathroom, kitchen, and any special features like a balcony or garden. Avoid dark, blurry, or heavily filtered images. Accurate photos reduce disputes and attract more serious inquiries.',
      },
    ],
  },
  {
    category: 'Marketplace',
    questions: [
      {
        q: 'How do I sell an item?',
        a: 'You need to be logged in. Tap Post Item from the menu, select a category, condition, set a fair price, write a clear description, and upload photos. After submission, the item enters a review queue before going live.',
      },
      {
        q: 'How do I buy safely from the marketplace?',
        a: 'Inspect the item in person before paying. Meet in a public, well-lit place near campus. Test electronics on the spot. Do not send advance payments to strangers. If something feels wrong — pressure, vague location, refusal to meet — walk away and report via Help → Safety.',
      },
      {
        q: 'Can I post marketplace items as a Resident?',
        a: 'Yes. Both Resident and Landlord accounts can post and respond to marketplace items. You do not need a Landlord account to sell second-hand goods.',
      },
    ],
  },
  {
    category: 'Notifications & account',
    questions: [
      {
        q: 'What types of notifications will I receive?',
        a: 'Notifications include: a user saved your listing, your listing had a spike in views, your item or house listing was approved, a system alert about your account, and new matches for saved searches. Landlords also get alerts when a viewing request is submitted.',
      },
      {
        q: 'How do I turn off or mute notifications?',
        a: 'On the Notifications page, tap the options menu on any notification and select Mute to stop that alert category. To manage all notification preferences, go to Account → Notification settings. You can re-enable muted categories at any time.',
      },
      {
        q: 'How do I delete or mark notifications as read?',
        a: 'On the Notifications page, use Mark all read in the header to clear the badge. To delete individual notifications, tap the options menu on the notification and select Delete. Deleted notifications cannot be recovered.',
      },
    ],
  },
  {
    category: 'Safety & reporting',
    questions: [
      {
        q: 'How do I report a suspicious listing or user?',
        a: 'On a house detail page, scroll to the landlord card and tap "Report landlord / listing". This opens the Help → Safety report form pre-filled with the listing name and landlord. Fill in details and submit — our team reviews all reports within 24 hours.',
      },
      {
        q: 'What are the red flags of a rental scam?',
        a: 'Watch for: requests to pay deposit before viewing, pressure to decide immediately, prices far below market, refusal to show the unit in person, requests for "platform fees" or "registration fees" to personal M-Pesa numbers, and communication only via unofficial channels. If you see these, report immediately.',
      },
      {
        q: 'Does Skitech collect rent or deposits on behalf of landlords?',
        a: 'No. Skitech is a listing and discovery platform only. All payments go directly between the tenant and landlord. Anyone claiming to collect rent on behalf of Skitech is committing fraud. Report such cases through Help → Safety.',
      },
    ],
  },
];

export type LegalArticleId = 'about' | 'terms' | 'privacy';

export const legalArticles: Record<LegalArticleId, { label: string; sections: { heading: string; body: string[] }[] }> = {
  about: {
    label: 'About Skitech',
    sections: [
      {
        heading: 'Our mission',
        body: [
          'Skitech connects students and residents in Embu with verified housing listings and local marketplace deals. We exist to reduce the friction, risk, and information asymmetry that makes house hunting stressful — especially for first-year students arriving in a new city.',
          'We give landlords tools to reach serious, verified tenants faster, and give residents the confidence to make informed decisions before paying a single shilling.',
        ],
      },
      {
        heading: 'What we do for residents',
        body: [
          'Structured, searchable listings with honest photos, amenity details, and distance from campus.',
          'Wishlist, comparison, and verified badge systems to help you shortlist safely.',
          'Direct contact channels (WhatsApp, call, inquiry form) so you can reach landlords without giving away personal data publicly.',
          'Ratings and reviews from previous tenants to help you gauge landlord quality.',
        ],
      },
      {
        heading: 'What we do for landlords & sellers',
        body: [
          'A listing dashboard with analytics — views, saves, and inquiry counts — so you understand demand.',
          'A reputation system that rewards responsive, honest landlords with better visibility.',
          'Streamlined posting workflows that get your property in front of the right audience quickly.',
        ],
      },
      {
        heading: 'Our commitment to improvement',
        body: [
          'Skitech is actively developed. Every version improves search accuracy, trust signals, and the safety of interactions. We use anonymous usage data (never sold) to understand which features help users most.',
          'Future builds will introduce enhanced verification, in-app messaging, more granular filter options, and expanded coverage. User feedback directly shapes the roadmap — send yours via Help → Contact.',
        ],
      },
    ],
  },
  terms: {
    label: 'Terms of service',
    sections: [
      {
        heading: 'Acceptance of terms',
        body: [
          'By creating an account or using Skitech, you agree to these terms and our community standards. These terms apply to all users — residents, landlords, and marketplace participants — on the Skitech platform focused on Embu and surrounding areas.',
        ],
      },
      {
        heading: '1. Account responsibility',
        body: [
          'You are responsible for the security of your account and all activity that occurs under it. Do not share your credentials. Report compromised accounts to support immediately.',
          'Each person may hold one account. Creating multiple accounts to evade restrictions or inflate trust scores is prohibited and will result in suspension.',
        ],
      },
      {
        heading: '2. Listing accuracy',
        body: [
          'Landlords must post accurate, current information. Photos must represent the actual property. Prices, deposit amounts, and amenities must match what is offered in person.',
          'Listings with misleading content will be removed. Repeated violations result in account suspension. Residents who suspect inaccuracies should report via the listing page.',
        ],
      },
      {
        heading: '3. Payments & deposits',
        body: [
          'Skitech is a discovery platform — we do not process or hold rent payments or deposits. All financial transactions are directly between users.',
          'Standard Embu practice includes a one-month deposit; always confirm the actual deposit requirement before agreeing. Never pay any amount without viewing the property in person and signing a written agreement.',
          'Any person or account claiming to collect fees on behalf of Skitech is acting fraudulently. Report such activity immediately.',
        ],
      },
      {
        heading: '4. Prohibited conduct',
        body: [
          'The following are prohibited: posting false listings, harassment of any user, impersonation, sharing private contact information of others without consent, and any activity intended to defraud.',
          'Violations may result in listing removal, account suspension, or referral to relevant authorities depending on severity.',
        ],
      },
      {
        heading: '5. Content review',
        body: [
          'We may review listings, user profiles, and reports at any time to enforce these terms. Our review team may contact you for clarification before taking action.',
        ],
      },
      {
        heading: '6. Changes to terms',
        body: [
          'We will notify users of material changes to these terms via in-app notification or email. Continued use after the effective date constitutes acceptance.',
        ],
      },
    ],
  },
  privacy: {
    label: 'Privacy policy',
    sections: [
      {
        heading: 'Our privacy principles',
        body: [
          'We collect only what is necessary to operate the platform safely and effectively. We do not sell your personal data to third-party advertisers.',
          'We are committed to transparent data practices and will update this policy when our practices change — notifying you in advance.',
        ],
      },
      {
        heading: 'What data we collect',
        body: [
          'Account data: name, email address, phone number, and profile photo — provided by you at sign-up or profile setup.',
          'Listing content: property descriptions, photos, location details, and pricing that you post as a landlord or seller.',
          'Usage signals: pages visited, searches performed, listings viewed, and features used — used anonymously to detect abuse and improve product relevance.',
          'Communication data: inquiry messages sent through the "Request to View" form and support tickets submitted via Help → Contact.',
        ],
      },
      {
        heading: 'How we use your data',
        body: [
          'To authenticate you and maintain your account session.',
          'To display your listings, wishlist, and notification history.',
          'To deliver real-time notifications about your listings and saved items.',
          'To respond to support requests and investigate reported content.',
          'To generate anonymous, aggregated analytics (no individual identity) that help us improve the product.',
        ],
      },
      {
        heading: 'Data sharing',
        body: [
          'We share data only with: (1) infrastructure providers necessary to run the platform (e.g. Supabase for database and auth, EmailJS for support emails), and (2) law enforcement when legally required.',
          'We do not share your profile data with other users beyond what you post publicly. Your phone number and email are only visible to users you explicitly contact.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You may request a copy of your data, ask us to correct inaccurate profile information, or request account deletion at any time via Help → Contact.',
          'Deleting your account removes your profile and listings. Anonymised usage signals may be retained in aggregate reports.',
        ],
      },
      {
        heading: 'Security',
        body: [
          'Account passwords are hashed and never stored in plain text. Session tokens are short-lived and rotated on sign-out.',
          'Protect your own account by using a strong unique password and not sharing it. Contact support immediately if you believe your account has been accessed without your permission.',
        ],
      },
      {
        heading: 'Future improvements',
        body: [
          'We are committed to building more granular privacy controls in future releases — including notification preferences per category, the ability to make your profile private, and more transparent data dashboards.',
          'Our goal is a platform where you always know what data you share and why. User trust is central to Skitech\'s existence.',
        ],
      },
    ],
  },
};
