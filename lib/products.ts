// ─── KiTee Studio — Product Catalogue ───────────────────────────────────────
// Prices are stored in GBP in Supabase/admin — not hardcoded here.
// priceId comes from Stripe via env vars (still needed for checkout).
// productType: 'template' | 'app'
// appCategory: SEO-friendly category slugs for utility apps

export type ProductType = 'template' | 'app';

export type AppCategory =
  | 'adhd-neurodivergent'
  | 'fitness-wellness'
  | 'productivity-daily-life';

export type TemplateCategory =
  | 'coaches'
  | 'authors'
  | 'fitness'
  | 'podcasters'
  | 'freelancers'
  | 'shops';

export type Category = 'all' | 'templates' | 'apps' | AppCategory | TemplateCategory;

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;           // GBP — source of truth, used as fallback
  priceId: string;         // Stripe price ID
  productType: ProductType;
  category: TemplateCategory | AppCategory;
  categoryLabel: string;
  categorySlug: AppCategory | TemplateCategory;
  features: string[];
  badge?: string;
  status: 'live' | 'coming-soon';
  image: string;
  mockupCount?: number;
  seoTitle?: string;
  seoDescription?: string;
};

// ─── Template categories ─────────────────────────────────────────────────────
export const TEMPLATE_CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: 'coaches',     label: 'Coaches' },
  { id: 'authors',     label: 'Authors' },
  { id: 'fitness',     label: 'Fitness' },
  { id: 'podcasters',  label: 'Podcasters' },
  { id: 'freelancers', label: 'Freelancers' },
  { id: 'shops',       label: 'Shops' },
];

// ─── App categories ───────────────────────────────────────────────────────────
export const APP_CATEGORIES: { id: AppCategory; label: string; description: string }[] = [
  {
    id: 'adhd-neurodivergent',
    label: 'AuDHD & Neurodivergent',
    description: 'Tools designed for neurodivergent brains — built by one.',
  },
  {
    id: 'fitness-wellness',
    label: 'Fitness & Wellness',
    description: 'Track your training, your body, your recovery.',
  },
  {
    id: 'productivity-daily-life',
    label: 'Productivity & Daily Life',
    description: 'Practical tools for the day-to-day stuff that needs to just work.',
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [

  // ── UTILITY APPS ──────────────────────────────────────────────────────────

  {
    id: 'burnout-recovery-blueprint',
    slug: 'burnout-recovery-blueprint',
    name: 'Burnout Recovery Blueprint',
    tagline: 'Track your energy. Map your recovery. Build back properly.',
    description: 'A self-contained offline app for tracking where your energy actually goes and building a real recovery plan — not a mood board. Built for brains that crash hard and need structure, not inspiration.',
    price: 0,
    priceId: process.env.NEXT_PUBLIC_PRICE_BURNOUT || '',
    productType: 'app',
    category: 'adhd-neurodivergent',
    categoryLabel: 'AuDHD & Neurodivergent',
    categorySlug: 'adhd-neurodivergent',
    status: 'live',
    image: '/images/products/burnout-01.jpg',
    features: [
      'Energy tracking across all life areas',
      'Burnout stage identifier',
      'Personalised recovery roadmap',
      'Daily check-in journal',
      'Works fully offline — no internet needed',
      'Download once, yours forever',
    ],
    seoTitle: 'Burnout Recovery App for AuDHD & Neurodivergent People',
    seoDescription: 'A downloadable offline app to track burnout, map your energy, and build a real recovery plan. Built for AuDHD and neurodivergent brains.',
  },

  {
    id: 'post-diagnosis-rebuild-kit',
    slug: 'post-diagnosis-rebuild-kit',
    name: 'Post-Diagnosis Rebuild Kit',
    tagline: 'Process your diagnosis. Rebuild a life that actually fits your brain.',
    description: 'Everything you need after a late AuDHD diagnosis — a guided app to process the grief, reclaim your identity, and start building life on your own terms. No toxic positivity. Just tools.',
    price: 0,
    priceId: process.env.NEXT_PUBLIC_PRICE_REBUILD || '',
    productType: 'app',
    category: 'adhd-neurodivergent',
    categoryLabel: 'AuDHD & Neurodivergent',
    categorySlug: 'adhd-neurodivergent',
    status: 'live',
    image: '/images/products/rebuild-01.jpg',
    features: [
      'Identity explorer with masked trait mapping',
      'Grief processor with guided prompts',
      'Weekly reflection journal',
      'Progress tracking',
      'Voice-to-text on all input fields',
      'Export your data anytime',
    ],
    seoTitle: 'Late ADHD Diagnosis App — Post-Diagnosis Rebuild Kit',
    seoDescription: 'A downloadable app for processing a late AuDHD diagnosis. Guided tools for identity, grief, and rebuilding — offline, no subscription.',
  },

  {
    id: 'unmasking-roadmap',
    slug: 'unmasking-roadmap',
    name: 'Unmasking Roadmap',
    tagline: 'Identify where you mask. Build a safer way to show up.',
    description: 'A guided tool for understanding your masking patterns and gradually building a more authentic way of being — at work, in relationships, and with yourself.',
    price: 0,
    priceId: '',
    productType: 'app',
    category: 'adhd-neurodivergent',
    categoryLabel: 'AuDHD & Neurodivergent',
    categorySlug: 'adhd-neurodivergent',
    status: 'coming-soon',
    image: '/images/products/unmasking-01.jpg',
    features: [],
    seoTitle: 'AuDHD Unmasking App — Unmasking Roadmap',
    seoDescription: 'A downloadable tool for neurodivergent people to identify masking patterns and build a more authentic way of showing up.',
  },

  {
    id: 'adhd-relationships-playbook',
    slug: 'adhd-relationships-playbook',
    name: 'AuDHD Relationships Playbook',
    tagline: 'Navigate connection with a neurodivergent brain — yours or theirs.',
    description: 'Tools for communication, conflict, and connection when AuDHD is part of the picture. Whether you\'re the neurodivergent one or you love someone who is.',
    price: 0,
    priceId: '',
    productType: 'app',
    category: 'adhd-neurodivergent',
    categoryLabel: 'AuDHD & Neurodivergent',
    categorySlug: 'adhd-neurodivergent',
    status: 'coming-soon',
    image: '/images/products/relationships-01.jpg',
    features: [],
    seoTitle: 'AuDHD Relationships App — Communication & Connection Tools',
    seoDescription: 'A downloadable app for navigating relationships with AuDHD. Tools for communication, conflict, and connection.',
  },

  {
    id: 'gym-tracker',
    slug: 'gym-tracker',
    name: 'Gym Tracker',
    tagline: 'Log your lifts. Track your progress. No subscription required.',
    description: 'A self-contained offline gym tracking app. Log sets, weights, reps, and track your progress over time — without a fitness app subscription. Download once, open in any browser, use forever.',
    price: 0,
    priceId: process.env.NEXT_PUBLIC_PRICE_GYM || '',
    productType: 'app',
    category: 'fitness-wellness',
    categoryLabel: 'Fitness & Wellness',
    categorySlug: 'fitness-wellness',
    status: 'live',
    image: '/images/products/gym-01.jpg',
    features: [
      'Log sets, reps, and weights',
      'Workout history and progress tracking',
      'Custom exercise library',
      'Personal records tracker',
      'Works fully offline',
      'Download once, yours forever',
    ],
    seoTitle: 'Offline Gym Tracker App — No Subscription Workout Log',
    seoDescription: 'A downloadable offline gym tracker. Log workouts, track progress, and see your personal records — no subscription, no account, no internet needed.',
  },

  // ── SITEFILL TEMPLATES ────────────────────────────────────────────────────

  {
    id: 'coach',
    slug: 'life-coach-website-template',
    name: 'Life Coach',
    tagline: 'Convert visitors into booked clients.',
    description: 'Built for coaches and consultants who want a site that sells. Clear messaging, trust signals, and a booking-ready layout — all editable without touching a line of code.',
    price: 0,
    priceId: process.env.NEXT_PUBLIC_PRICE_COACH || '',
    productType: 'template',
    category: 'coaches',
    categoryLabel: 'Coach',
    categorySlug: 'coaches',
    status: 'live',
    image: '/images/products/coach-01.jpg',
    mockupCount: 7,
    features: [
      'SiteFill™ visual editor built in',
      'Services & packages section',
      'Testimonials & social proof block',
      'Booking / enquiry CTA',
      'Newsletter opt-in',
      'One-click download — no hosting needed',
    ],
    seoTitle: 'Life Coach Website Template — SiteFill™ by KiTee Studio',
    seoDescription: 'A premium one-page life coach website template with a built-in editor. Edit live, download, publish anywhere. No code, no subscription.',
  },

  {
    id: 'freelancer',
    slug: 'freelancer-website-template',
    name: 'Freelancer',
    tagline: 'Land more clients with a site that works as hard as you do.',
    description: 'Everything a freelancer needs — portfolio, services, testimonials, and contact. Clean, fast, and instantly editable with the SiteFill™ editor.',
    price: 0,
    priceId: process.env.NEXT_PUBLIC_PRICE_FREELANCER || '',
    productType: 'template',
    category: 'freelancers',
    categoryLabel: 'Freelancer',
    categorySlug: 'freelancers',
    status: 'live',
    image: '/images/products/freelancer-01.jpg',
    mockupCount: 7,
    features: [
      'SiteFill™ visual editor built in',
      'Portfolio section with image uploads',
      'Services, testimonials & contact',
      'Rates / packages section',
      'One-click download — no hosting needed',
    ],
    seoTitle: 'Freelancer Website Template — SiteFill™ by KiTee Studio',
    seoDescription: 'A premium one-page freelancer website template. Edit live in the browser, download, publish anywhere. No code needed.',
  },

  {
    id: 'novelist',
    slug: 'author-website-template',
    name: 'Author',
    tagline: 'For writers who mean business.',
    description: 'Showcase your books, events, press, and newsletter in one elegant page. Built for fiction and non-fiction authors who want a proper platform.',
    price: 0,
    priceId: process.env.NEXT_PUBLIC_PRICE_AUTHOR || '',
    productType: 'template',
    category: 'authors',
    categoryLabel: 'Author',
    categorySlug: 'authors',
    status: 'live',
    image: '/images/products/novelist-01.jpg',
    mockupCount: 7,
    features: [
      'SiteFill™ visual editor built in',
      'Books, events & press sections',
      'Newsletter signup',
      'Reader-first layout',
      'One-click download — no hosting needed',
    ],
    seoTitle: 'Author Website Template — SiteFill™ by KiTee Studio',
    seoDescription: 'A premium one-page author website template. Books, events, press, and newsletter — all editable live. No code, no subscription.',
  },

  {
    id: 'podcast',
    slug: 'podcast-website-template',
    name: 'Podcast',
    tagline: 'Your show deserves its own stage.',
    description: 'A full podcast home with episode listings, platform links, and a host bio. Stand out from the sea of generic podcast pages.',
    price: 0,
    priceId: process.env.NEXT_PUBLIC_PRICE_PODCAST || '',
    productType: 'template',
    category: 'podcasters',
    categoryLabel: 'Podcaster',
    categorySlug: 'podcasters',
    status: 'live',
    image: '/images/products/podcast-01.jpg',
    mockupCount: 7,
    features: [
      'SiteFill™ visual editor built in',
      'Episode listing section',
      'Listen on Spotify / Apple links',
      'Host bio & guest section',
      'One-click download — no hosting needed',
    ],
    seoTitle: 'Podcast Website Template — SiteFill™ by KiTee Studio',
    seoDescription: 'A premium one-page podcast website template. Episodes, platform links, host bio — all editable live. No code, no subscription.',
  },

  {
    id: 'shop',
    slug: 'shop-website-template',
    name: 'Shop & Artisan',
    tagline: 'Sell your work beautifully.',
    description: 'A handcrafted-aesthetic store template for makers, artists, and independent sellers. Warm, editorial, and conversion-focused.',
    price: 0,
    priceId: process.env.NEXT_PUBLIC_PRICE_SHOP || '',
    productType: 'template',
    category: 'shops',
    categoryLabel: 'Shop',
    categorySlug: 'shops',
    status: 'live',
    image: '/images/products/shop-01.jpg',
    mockupCount: 7,
    features: [
      'SiteFill™ visual editor built in',
      'Product showcase sections',
      'About the maker section',
      'Testimonials & social proof',
      'One-click download — no hosting needed',
    ],
    seoTitle: 'Shop & Artisan Website Template — SiteFill™ by KiTee Studio',
    seoDescription: 'A premium one-page shop template for makers and artisans. Editable live in the browser, no code, no subscription.',
  },

  {
    id: 'pt',
    slug: 'personal-trainer-website-template',
    name: 'Personal Trainer',
    tagline: 'Get more clients. Look the part.',
    description: 'Bold, high-energy design built for PTs and fitness coaches. Services, transformations, testimonials, and booking — all in one page.',
    price: 0,
    priceId: process.env.NEXT_PUBLIC_PRICE_PT || '',
    productType: 'template',
    category: 'fitness',
    categoryLabel: 'Personal Trainer',
    categorySlug: 'fitness',
    status: 'live',
    image: '/images/products/pt-01.jpg',
    mockupCount: 7,
    features: [
      'SiteFill™ visual editor built in',
      'Services & pricing section',
      'Transformation gallery',
      'Booking / enquiry section',
      'One-click download — no hosting needed',
    ],
    seoTitle: 'Personal Trainer Website Template — SiteFill™ by KiTee Studio',
    seoDescription: 'A premium one-page personal trainer website template. Services, testimonials, booking — editable live. No code, no subscription.',
  },

  {
    id: 'pt-premium',
    slug: 'personal-trainer-premium-template',
    name: 'Personal Trainer Premium',
    tagline: 'The full package for serious fitness brands.',
    description: 'Everything in the standard PT template, plus premium sections: video hero, full testimonial slider, FAQs, and an expanded transformation showcase.',
    price: 0,
    priceId: process.env.NEXT_PUBLIC_PRICE_PT_PREMIUM || '',
    productType: 'template',
    category: 'fitness',
    categoryLabel: 'Personal Trainer',
    categorySlug: 'fitness',
    status: 'live',
    image: '/images/products/pt-premium-01.jpg',
    mockupCount: 7,
    badge: 'Premium',
    features: [
      'All standard PT features',
      'Video hero section',
      'Full testimonial slider',
      'Expanded transformation gallery',
      'FAQ section',
    ],
    seoTitle: 'Personal Trainer Premium Website Template — SiteFill™ by KiTee Studio',
    seoDescription: 'The premium personal trainer website template. Video hero, testimonial slider, FAQs, and more. No code, no subscription.',
  },

  {
    id: 'author-premium',
    slug: 'author-premium-template',
    name: 'Author Premium',
    tagline: 'The complete author web presence.',
    description: 'The full author suite — books, events, press, newsletter, podcast, and a dedicated media kit section. For authors building a serious platform.',
    price: 0,
    priceId: process.env.NEXT_PUBLIC_PRICE_AUTHOR_PREMIUM || '',
    productType: 'template',
    category: 'authors',
    categoryLabel: 'Author',
    categorySlug: 'authors',
    status: 'live',
    image: '/images/products/author-premium-01.jpg',
    mockupCount: 7,
    badge: 'Premium',
    features: [
      'All standard Author features',
      'Podcast / interview section',
      'Media kit section',
      'Extended press & reviews',
      'Speaking engagements section',
    ],
    seoTitle: 'Author Premium Website Template — SiteFill™ by KiTee Studio',
    seoDescription: 'The premium author website template. Books, events, media kit, podcast section — all editable live. No code, no subscription.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function getProductBySlug(slug: string) {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getProductsByType(type: ProductType) {
  return PRODUCTS.filter(p => p.productType === type);
}

export function getAppsByCategory(category: AppCategory) {
  return PRODUCTS.filter(p => p.productType === 'app' && p.category === category);
}

export function getLiveProducts() {
  return PRODUCTS.filter(p => p.status === 'live');
}

