export type Category = 'all' | 'coaches' | 'authors' | 'fitness' | 'podcasters' | 'freelancers' | 'shops';

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  priceId: string;
  category: Category;
  categoryLabel: string;
  features: string[];
  badge?: string;
  image: string;        // path in /public/images/products/
  mockupCount: number;  // how many mockup images exist
};

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all',         label: 'All Templates' },
  { id: 'coaches',     label: 'Coaches' },
  { id: 'authors',     label: 'Authors' },
  { id: 'fitness',     label: 'Fitness' },
  { id: 'podcasters',  label: 'Podcasters' },
  { id: 'freelancers', label: 'Freelancers' },
  { id: 'shops',       label: 'Shops' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'coach',
    slug: 'life-coach-website-template',
    name: 'Life Coach',
    tagline: 'Convert visitors into booked clients.',
    description: 'Built for coaches and consultants who want a site that sells. Clear messaging, trust signals, and a booking-ready layout — all editable without touching a line of code.',
    price: 29,
    priceId: process.env.NEXT_PUBLIC_PRICE_COACH || '',
    category: 'coaches',
    categoryLabel: 'Coach',
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
  },
  {
    id: 'freelancer',
    slug: 'freelancer-website-template',
    name: 'Freelancer',
    tagline: 'Land more clients with a site that works as hard as you do.',
    description: 'Everything a freelancer needs — portfolio, services, testimonials, and contact. Clean, fast, and instantly editable with the SiteFill™ editor.',
    price: 29,
    priceId: process.env.NEXT_PUBLIC_PRICE_FREELANCER || '',
    category: 'freelancers',
    categoryLabel: 'Freelancer',
    image: '/images/products/freelancer-01.jpg',
    mockupCount: 7,
    features: [
      'SiteFill™ visual editor built in',
      'Portfolio section with image uploads',
      'Services, testimonials & contact',
      'Rates / packages section',
      'One-click download — no hosting needed',
    ],
  },
  {
    id: 'novelist',
    slug: 'author-website-template',
    name: 'Author',
    tagline: 'For writers who mean business.',
    description: 'Showcase your books, events, press, and newsletter in one elegant page. Built for fiction and non-fiction authors who want a proper platform.',
    price: 29,
    priceId: process.env.NEXT_PUBLIC_PRICE_AUTHOR || '',
    category: 'authors',
    categoryLabel: 'Author',
    image: '/images/products/novelist-01.jpg',
    mockupCount: 7,
    features: [
      'SiteFill™ visual editor built in',
      'Books, events & press sections',
      'Newsletter signup',
      'Reader-first layout',
      'One-click download — no hosting needed',
    ],
  },
  {
    id: 'podcast',
    slug: 'podcast-website-template',
    name: 'Podcast',
    tagline: 'Your show deserves its own stage.',
    description: 'A full podcast home with episode listings, platform links, and a host bio. Stand out from the sea of generic podcast pages.',
    price: 29,
    priceId: process.env.NEXT_PUBLIC_PRICE_PODCAST || '',
    category: 'podcasters',
    categoryLabel: 'Podcaster',
    image: '/images/products/podcast-01.jpg',
    mockupCount: 7,
    features: [
      'SiteFill™ visual editor built in',
      'Episode listing section',
      'Listen on Spotify / Apple links',
      'Host bio & guest section',
      'One-click download — no hosting needed',
    ],
  },
  {
    id: 'shop',
    slug: 'shop-website-template',
    name: 'Shop & Artisan',
    tagline: 'Sell your work beautifully.',
    description: 'A handcrafted-aesthetic store template for makers, artists, and independent sellers. Warm, editorial, and conversion-focused.',
    price: 29,
    priceId: process.env.NEXT_PUBLIC_PRICE_SHOP || '',
    category: 'shops',
    categoryLabel: 'Shop',
    image: '/images/products/shop-01.jpg',
    mockupCount: 7,
    features: [
      'SiteFill™ visual editor built in',
      'Product showcase sections',
      'About the maker section',
      'Testimonials & social proof',
      'One-click download — no hosting needed',
    ],
  },
  {
    id: 'pt',
    slug: 'personal-trainer-website-template',
    name: 'Personal Trainer',
    tagline: 'Get more clients. Look the part.',
    description: 'Bold, high-energy design built for PTs and fitness coaches. Services, transformations, testimonials, and booking — all in one page.',
    price: 29,
    priceId: process.env.NEXT_PUBLIC_PRICE_PT || '',
    category: 'fitness',
    categoryLabel: 'Personal Trainer',
    image: '/images/products/coach-01.jpg', // swap when PT mockup available
    mockupCount: 7,
    features: [
      'SiteFill™ visual editor built in',
      'Services & pricing section',
      'Transformation gallery',
      'Booking / enquiry section',
      'One-click download — no hosting needed',
    ],
  },
  {
    id: 'pt-premium',
    slug: 'personal-trainer-premium-template',
    name: 'Personal Trainer Premium',
    tagline: 'The full package for serious fitness brands.',
    description: 'Everything in the standard PT template, plus premium sections: video hero, full testimonial slider, FAQs, and an expanded transformation showcase.',
    price: 49,
    priceId: process.env.NEXT_PUBLIC_PRICE_PT_PREMIUM || '',
    category: 'fitness',
    categoryLabel: 'Personal Trainer',
    image: '/images/products/coach-01.jpg', // swap when PT premium mockup available
    mockupCount: 7,
    badge: 'Premium',
    features: [
      'All standard PT features',
      'Video hero section',
      'Full testimonial slider',
      'Expanded transformation gallery',
      'FAQ section',
      'Priority email support',
    ],
  },
  {
    id: 'author-premium',
    slug: 'author-premium-template',
    name: 'Author Premium',
    tagline: 'The complete author web presence.',
    description: 'The full author suite — books, events, press, newsletter, podcast, and a dedicated media kit section. For authors building a serious platform.',
    price: 49,
    priceId: process.env.NEXT_PUBLIC_PRICE_AUTHOR_PREMIUM || '',
    category: 'authors',
    categoryLabel: 'Author',
    image: '/images/products/novelist-01.jpg',
    mockupCount: 7,
    badge: 'Premium',
    features: [
      'All standard Author features',
      'Podcast / interview section',
      'Media kit section',
      'Extended press & reviews',
      'Speaking engagements section',
      'Priority email support',
    ],
  },
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getProductsByCategory(cat: Category) {
  return cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
}
