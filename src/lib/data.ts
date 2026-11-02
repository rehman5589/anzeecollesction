/* ─────────────────────────────────────────────────────────────────────
 AN'ZEE COLLECTION · Home Data
 Fine artisanal parfumerie · Casablanca since 1987
 ───────────────────────────────────────────────────────────────────── */

export type NotePyramid = { top: string[]; heart: string[]; base: string[] };
export type Gender = 'Women' | 'Men' | 'Unisex';

export interface Perfume {
 id: string;
 name: string;
 arabic: string;
 family: string;
 concentration: 'Parfum' | 'Extrait de Parfum' | 'Eau de Parfum';
 gender: Gender;
 tagline: string;
 story: string;
 notes: NotePyramid;
 sizes: number[];
 price: number[]; // DH, aligned with sizes[]
 oils: number; // concentration %
 longevity: number; // /10
 projection: number; // /10
 sillage: number; // /10
 stock: number;
 rating: number;
 reviews: number;
 bestSeller?: boolean;
 exclusif?: boolean;
 limited?: boolean;
 newArrivee?: boolean;
 colors: { glass: string; liquid: string; cap: string; label: string };
 flacon: 'classic' | 'solaire' | 'oud' | 'oval' | 'warrior' | 'gourmand';
 image: string;
 createdAt: string;
}

export const INITIAL_PERFUMES: Perfume[] = [
 {
 id: 'sennour-rose',
 name: 'Sennour Rosé',
 arabic: 'سنور روز',
 family: 'Floral',
 concentration: 'Extrait de Parfum',
 gender: 'Women',
 tagline: 'The rose that started it all — 2019.',
 story:
 'Distilled from centifolia roses of the Dades valley and folded into a velvet accord of peony and Madagascar vanilla. The flacon that made AN’Zee a legend in Casablanca.',
 notes: {
 top: ['Bulgarian Rose', 'Pink Pepper', 'Pear Nectar'],
 heart: ['Turkish Rose Absolute', 'Peony', 'Damask Accord'],
 base: ['Madagascar Vanilla', 'White Musk', 'Sandalwood'],
 },
 sizes: [50, 100],
 price: [650, 950],
 oils: 30,
 longevity: 10,
 projection: 8,
 sillage: 8,
 stock: 42,
 rating: 4.9,
 reviews: 1284,
 bestSeller: true,
 colors: { glass: '#f5c8cd', liquid: '#c24b63', cap: '#d4af37', label: '#fdfaf6' },
 flacon: 'classic',
 image: '/images/parfum-sennour-rose.webp',
 createdAt: '2019-03-14',
 },
 {
 id: 'santal-arab',
 name: 'Santal Arab',
 arabic: 'صندل عرب',
 family: 'Oud & Boisé',
 concentration: 'Extrait de Parfum',
 gender: 'Unisex',
 tagline: 'Sandalwood, oud & desert amber — 12 hours of gravity.',
 story:
 'Mysore sandalwood melted with Lao oud and a breath of saffron over tonka bean. A fragrance in smoked mahogany — calm, ancient, inevitable.',
 notes: {
 top: ['Saffron', 'Bergamot', 'Elemi'],
 heart: ['Mysore Sandalwood', 'Lao Oud', 'Rose de Mai'],
 base: ['Tonka Bean', 'Grey Amber', 'Leather Accord'],
 },
 sizes: [50, 100],
 price: [700, 1100],
 oils: 32,
 longevity: 12,
 projection: 9,
 sillage: 9,
 stock: 37,
 rating: 4.9,
 reviews: 1102,
 bestSeller: true,
 colors: { glass: '#8a5a2b', liquid: '#3d1e0e', cap: '#d4af37', label: '#f2e9de' },
 flacon: 'classic',
 image: '/images/parfum-santal-arab.webp',
 createdAt: '2018-09-02',
 },
 {
 id: 'neroli-blanc',
 name: 'Neroli Blanc',
 arabic: 'نيرولي بلانك',
 family: 'Citrus',
 concentration: 'Eau de Parfum',
 gender: 'Unisex',
 tagline: 'Riviera sunlight in a bottle — orange blossom on white marble.',
 story:
 'Neroli hand-picked at dawn in the bitter-orange groves of Tunisia, lifted by bergamot and petitgrain, resting on warm white musk. Summer, crystallized.',
 notes: {
 top: ['Italian Bergamot', 'Neroli', 'Petitgrain'],
 heart: ['Orange Blossom', 'Jasmine Sambac', 'Lily of the Valley'],
 base: ['White Musk', 'Cedarwood', 'Ambroxan'],
 },
 sizes: [50, 100],
 price: [550, 850],
 oils: 20,
 longevity: 8,
 projection: 7,
 sillage: 6,
 stock: 58,
 rating: 4.8,
 reviews: 947,
 newArrivee: true,
 colors: { glass: '#eef4e9', liquid: '#e8dd8f', cap: '#d4af37', label: '#fdfaf6' },
 flacon: 'solaire',
 image: '/images/parfum-neroli-blanc.webp',
 createdAt: '2025-06-20',
 },
 {
 id: 'oud-imperial',
 name: 'Oud Impérial',
 arabic: 'عود إمبيريال',
 family: 'Oud & Boisé',
 concentration: 'Parfum',
 gender: 'Men',
 tagline: 'Cambodian oud, labdanum & saffron — the crown jewel.',
 story:
 'An extrait built on Cambodian oud aged 12 years, warmed with labdanum, saffron and black amber. Reserved for evenings that deserve a legend.',
 notes: {
 top: ['Saffron', 'Black Cardamom', 'Incense Resin'],
 heart: ['Cambodian Oud', 'Labdanum', 'Rose Noire'],
 base: ['Black Amber', 'Benzoin', 'Smoked Vetiver'],
 },
 sizes: [75],
 price: [1500],
 oils: 40,
 longevity: 14,
 projection: 10,
 sillage: 9,
 stock: 19,
 rating: 5,
 reviews: 412,
 exclusif: true,
 colors: { glass: '#1c1410', liquid: '#0d0805', cap: '#b8860b', label: '#1a1a1a' },
 flacon: 'oud',
 image: '/images/parfum-oud-imperial.webp',
 createdAt: '2020-11-11',
 },
 {
 id: 'musk-tahara',
 name: 'Musk Tahara',
 arabic: 'مسك الطهارة',
 family: 'Musqué',
 concentration: 'Eau de Parfum',
 gender: 'Unisex',
 tagline: 'Pure white musk — the scent of clean linen & candlelight.',
 story:
 'A monastic white-musk composition softened with lily of the valley and orris. Weightless, luminous, endlessly wearable — our quietest icon.',
 notes: {
 top: ['Italian Bergamot', 'Aldehyde C-12', 'Neroli'],
 heart: ['White Musk', 'Lily of the Valley', 'Orris Butter'],
 base: ['Cashmeran', 'Sandalwood', 'Ambrette Seed'],
 },
 sizes: [30, 50, 100],
 price: [450, 600, 900],
 oils: 18,
 longevity: 9,
 projection: 6,
 sillage: 6,
 stock: 71,
 rating: 4.8,
 reviews: 1560,
 bestSeller: true,
 colors: { glass: '#f4eee4', liquid: '#d9c9a8', cap: '#e9d48a', label: '#fdfaf6' },
 flacon: 'oval',
 image: '/images/parfum-musk-tahara.webp',
 createdAt: '2021-04-25',
 },
 {
 id: 'nuit-marrakech',
 name: 'Nuit à Marrakech',
 arabic: 'ليلة مراكش',
 family: 'Épicé',
 concentration: 'Eau de Parfum',
 gender: 'Men',
 tagline: 'Tobacco, spices & medina smoke — after midnight.',
 story:
 'Pipe tobacco and black pepper over honeyed amber and gaïac wood, lifted by a whisper of jasmine through medina incense. For the restless gentleman.',
 notes: {
 top: ['Black Pepper', 'Saffron', 'Lemon Zest'],
 heart: ['Tobacco Leaf', 'Jasmine', 'Cinnamon Bark'],
 base: ['Gaïac Wood', 'Honeyed Amber', 'Castoreum Accord'],
 },
 sizes: [50, 100],
 price: [680, 1000],
 oils: 25,
 longevity: 11,
 projection: 9,
 sillage: 8,
 stock: 44,
 rating: 4.7,
 reviews: 733,
 colors: { glass: '#1e2a1e', liquid: '#241608', cap: '#8f6b2f', label: '#20291f' },
 flacon: 'warrior',
 image: '/images/parfum-nuit-marrakech.webp',
 createdAt: '2022-10-30',
 },
 {
 id: 'rose-mogador',
 name: 'Rosé Mogador',
 arabic: 'روز موغادور',
 family: 'Chypre',
 concentration: 'Eau de Parfum',
 gender: 'Women',
 tagline: 'A sea-salt chypre love letter to Essaouira’s rose-cut dusk.',
 story:
 'Grapefruit and bergamot over patchouli, oakmoss and rose — a chypre with sea-salt in its blood, cut for women who arrive before the storm.',
 notes: {
 top: ['Pink Grapefruit', 'Calabrian Bergamot', 'Sea Salt Accord'],
 heart: ['Rose de Mai', 'Jasmine', 'Geranium'],
 base: ['Indonesian Patchouli', 'Oakmoss', 'Labdanum'],
 },
 sizes: [50, 100],
 price: [620, 920],
 oils: 22,
 longevity: 9,
 projection: 7,
 sillage: 7,
 stock: 39,
 rating: 4.7,
 reviews: 688,
 newArrivee: true,
 colors: { glass: '#b9c79a', liquid: '#6f7a35', cap: '#d4af37', label: '#f9f4ec' },
 flacon: 'classic',
 image: '/images/parfum-rose-mogador.webp',
 createdAt: '2025-09-12',
 },
 {
 id: 'ambre-royal',
 name: 'Ambre Royal',
 arabic: 'عنبر رويال',
 family: 'Gourmand',
 concentration: 'Extrait de Parfum',
 gender: 'Unisex',
 tagline: 'Burnt vanilla, tonka & benzoin — dessert for the soul.',
 story:
 'An edible warmth of vanilla bourbon, tonka and benzoin, kissed with cinnamon and sandalwood. The fragrance our tea houses dared not invent.',
 notes: {
 top: ['Cinnamon Bark', 'Bergamot', 'Pink Pepper'],
 heart: ['Vanilla Bourbon', 'Tonka Bean', 'Heliotrope'],
 base: ['Benzoin', 'Sandalwood', 'Praline Accord'],
 },
 sizes: [50, 100],
 price: [720, 1050],
 oils: 30,
 longevity: 11,
 projection: 8,
 sillage: 9,
 stock: 51,
 rating: 4.9,
 reviews: 934,
 limited: true,
 colors: { glass: '#c98a3a', liquid: '#7a3d10', cap: '#b8860b', label: '#f2e9de' },
 flacon: 'gourmand',
 image: '/images/parfum-ambre-royal.webp',
 createdAt: '2023-12-01',
 },
];

export const FAMILIES = ['Floral', 'Oud & Boisé', 'Oriental', 'Musqué', 'Citrus', 'Chypre', 'Épicé', 'Gourmand'] as const;

export const HOUSE = {
 name: 'AN’Zee Collection',
 tagline: 'Haute Parfumerie Artisanale',
 since: 1987,
 address: 'Derb Moulay Charif, Casablanca 20250, Morocco',
 hours: 'Mon – Sat · 9:00 AM – 8:00 PM',
 email: 'bonjour@anzee-collection.ma',
 phone: '+212 660 000 000',
 whatsappNumber: '212660000000',
 instagram: '@anzee.collection',
 instagramUrl: 'https://www.instagram.com/anzee.collection',
 foundedStory:
 'Founded in 1987 by Maâlem Rachid Bensaïd on a single formula scrawled on a Dades valley blotter, AN’Zee Collection remains a family home — every extrait composed in Casablanca, numbered by hand, and certified before it leaves the home.',
} as const;

export const formatDH = (n: number): string =>
 new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(n) + ' DH';

export const priceForSize = (p: Perfume, size: number): number => {
 const i = p.sizes.indexOf(size);
 return i >= 0 ? p.price[i] : p.price[0];
};

/* ── Fragrance Discovery Quiz ─────────────────────────────────────── */

export interface QuizOption {
 label: string;
 icon: string;
 weights: Record<string, number>;
}
export interface QuizQuestion {
 id: string;
 question: string;
 options: QuizOption[];
}
export const QUIZ_FAMILIES = [...FAMILIES] as string[];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
 {
 id: 'mood',
 question: 'Which atmosphere pulls you in?',
 options: [
 { label: 'A sunlit Riviera garden', icon: 'Sun', weights: { Citrus: 3, Floral: 2, Chypre: 1 } },
 { label: 'A candlelit medina at midnight', icon: 'Moon', weights: { Épicé: 3, Oriental: 2, 'Oud & Boisé': 2 } },
 { label: 'A crisp white-linen morning', icon: 'CloudSun', weights: { Musqué: 3, Citrus: 1, Floral: 1 } },
 { label: 'A velvet fireside after skiing', icon: 'Flame', weights: { Gourmand: 3, Oriental: 2, 'Oud & Boisé': 1 } },
 ],
 },
 {
 id: 'occasion',
 question: 'Where will you wear it most?',
 options: [
 { label: 'Every day, office to café', icon: 'Briefcase', weights: { Musqué: 3, Citrus: 2, Floral: 1 } },
 { label: 'Evenings & celebrations', icon: 'Sparkles', weights: { Oriental: 3, 'Oud & Boisé': 3, Gourmand: 1 } },
 { label: 'Romantic dates', icon: 'Heart', weights: { Floral: 3, Gourmand: 2, Oriental: 1 } },
 { label: 'Big moments & galas', icon: 'Crown', weights: { 'Oud & Boisé': 3, Épicé: 2, Chypre: 2 } },
 ],
 },
 {
 id: 'memory',
 question: 'Which memory smells like home?',
 options: [
 { label: 'Orange trees in the garden', icon: 'Flower2', weights: { Citrus: 3, Floral: 2 } },
 { label: 'Baking vanilla & cinnamon', icon: 'CakeSlice', weights: { Gourmand: 3, Oriental: 1 } },
 { label: 'Rain on cedar & moss', icon: 'CloudRain', weights: { Chypre: 3, 'Oud & Boisé': 2 } },
 { label: 'Incense in a grandmother’s lounge', icon: 'Wind', weights: { Épicé: 2, 'Oud & Boisé': 3, Oriental: 1 } },
 ],
 },
 {
 id: 'style',
 question: 'Your signature style is…',
 options: [
 { label: 'Effortless & luminous', icon: 'Feather', weights: { Musqué: 2, Citrus: 2, Floral: 2 } },
 { label: 'Intense & magnetic', icon: 'Zap', weights: { 'Oud & Boisé': 3, Épicé: 2 } },
 { label: 'Romantic & poetic', icon: 'Flower', weights: { Floral: 3, Chypre: 1, Musqué: 1 } },
 { label: 'Mysterious & rare', icon: 'Eye', weights: { Oriental: 3, Chypre: 2, Épicé: 1 } },
 ],
 },
 {
 id: 'intensity',
 question: 'How loud should your fragrance speak?',
 options: [
 { label: 'A whisper — skin-close musk', icon: 'Feather', weights: { Musqué: 3, Citrus: 1 } },
 { label: 'A conversation — elegant trail', icon: 'MessageCircle', weights: { Floral: 2, Chypre: 2, Citrus: 1 } },
 { label: 'A statement — room-filling sillage', icon: 'Volume2', weights: { Oriental: 3, Gourmand: 2, Épicé: 1 } },
 { label: 'A legend — 12+ hours of gravity', icon: 'Mountain', weights: { 'Oud & Boisé': 4, Oriental: 1 } },
 ],
 },
];

export function scoreQuiz(answers: QuizOption[]): { familyScores: Record<string, number>; winner: string } {
 const familyScores: Record<string, number> = Object.fromEntries(QUIZ_FAMILIES.map((f) => [f, 0]));
 for (const answer of answers) {
 for (const [family, weight] of Object.entries(answer.weights)) {
 familyScores[family] = (familyScores[family] ?? 0) + weight;
 }
 }
 let winner = 'Musqué';
 let best = -1;
 for (const family of QUIZ_FAMILIES) {
 if (familyScores[family] > best) {
 best = familyScores[family];
 winner = family;
 }
 }
 return { familyScores, winner };
}

/* ── Boutique background slider (perfume photography) ─────────────── */
export const HERO_SLIDES = [
 { src: '/images/hero-atelier.webp', alt: "AN Zee home - copper stills and numbered flacons in Casablanca" },
];

export const ATELIER_GALLERY = [
 { src: '/images/hero-perfume.webp', caption: 'Flacon Nº 1 — the maison’s first formula, 1987' },
 { src: '/images/ingredients-roses.webp', caption: 'Centifolia roses, hand-picked before first light' },
 { src: '/images/maison-atelier.webp', caption: 'The composition bench — one nose, one batch, one signature' },
 { src: '/images/boutique.webp', caption: 'Boutique & salon de thé — Derb Moulay Charif, Casablanca' },
 { src: '/images/atelier.webp', caption: 'Numbering & gilding — every flacon certified by hand' },
 { src: '/images/hero-atelier.webp', caption: 'The home at dusk — where every batch is born' },
];
