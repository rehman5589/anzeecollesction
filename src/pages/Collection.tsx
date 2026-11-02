/* ─────────────────────────────────────────────────────────────────────
 AN'ZEE COLLECTION · The Collection — filterable, sortable catalog
 ───────────────────────────────────────────────────────────────────── */

import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, SearchX } from 'lucide-react';
import { FAMILIES, HOUSE } from '../lib/data';
import { useCatalog } from '../lib/store';
import PerfumeCard from '../components/PerfumeCard';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name';

export default function Collection() {
 const catalog = useCatalog();
 const [searchParams, setSearchParams] = useSearchParams();
 const [query, setQuery] = useState(searchParams.get('search') ?? '');
 const family = searchParams.get('family') ?? 'All';
 const gender = searchParams.get('gender') ?? 'All';
 const [sort, setSort] = useState<SortKey>('featured');

 const setParam = (key: string, value: string | null) => {
 const next = new URLSearchParams(searchParams);
 if (value === null || value === 'All') next.delete(key);
 else next.set(key, value);
 setSearchParams(next, { replace: true });
 };

 const submitSearch = (e: React.FormEvent) => {
 e.preventDefault();
 setParam('search', query.trim() || null);
 };

 const filtered = useMemo(() => {
 const q = (searchParams.get('search') ?? '').trim().toLowerCase();
 let list = catalog.filter((p) => {
 if (family !== 'All' && p.family !== family) return false;
 if (gender !== 'All' && p.gender !== gender) return false;
 if (!q) return true;
 return [p.name, p.arabic, p.family, p.concentration, p.gender, p.tagline, p.notes.top.join(' '), p.notes.heart.join(' '), p.notes.base.join(' ')]
 .join(' ')
 .toLowerCase()
 .includes(q);
 });
 switch (sort) {
 case 'price-asc':
 list = [...list].sort((a, b) => a.price[0] - b.price[0]);
 break;
 case 'price-desc':
 list = [...list].sort((a, b) => b.price[0] - a.price[0]);
 break;
 case 'rating':
 list = [...list].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
 break;
 case 'name':
 list = [...list].sort((a, b) => a.name.localeCompare(b.name));
 break;
 default:
 list = [...list].sort((a, b) => Number(b.bestSeller ?? false) - Number(a.bestSeller ?? false) || b.rating - a.rating);
 }
 return list;
 }, [catalog, searchParams, family, gender, sort]);

 const clearAll = () => {
 setQuery('');
 setSearchParams({}, { replace: true });
 };

 const activeFilters = [family !== 'All' && family, gender !== 'All' && gender, searchParams.get('search') && `“${searchParams.get('search')}”`].filter(Boolean) as string[];

 return (
 <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
 {/* Page header — home photograph banner */}
 <div className="relative overflow-hidden rounded-[32px] border border-gold-400/25 ">
 <img loading="lazy" src="/images/atelier.webp" alt="Hand-numbering AN’Zee flacons at the Casablanca home" className="absolute inset-0 h-full w-full object-cover object-center" />
 <div className="absolute inset-0 bg-gradient-to-r from-wine-950/92 via-wine-950/62 to-wine-950/10" />
 <div className="relative px-6 py-12 sm:px-10">
 <p className="field-label">The Collection · {HOUSE.since}</p>
 <h1 className="mt-2 font-display text-4xl font-semibold text-cream-50 sm:text-5xl">Every flacon,<br /><span className="gold-text italic">numbered by hand</span></h1>
 <p className="mt-3 max-w-md font-serif text-base italic text-cream-200/90">Eight signatures, each composed in small numbered batches. Reserve on WhatsApp — pick up in the boutique.</p>
 </div>
 </div>

 {/* ── Filter bar ── */}
 <div className="sticky top-16 z-30 -mx-4 mt-6 border-b border-wine-800 bg-wine-950/90 px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
 <form onSubmit={submitSearch} className="flex flex-wrap items-center gap-2">
 <div className="relative min-w-40 flex-1">
 <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mauve-300" />
 <input
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 placeholder="Search by name, note, family…"
 aria-label="Search fragrances"
 className="w-full rounded-full border border-gold-400/25 bg-wine-850 py-2.5 pl-11 pr-4 text-sm text-cream-50 outline-none transition placeholder:text-mauve-300 focus:border-gold-400"
 />
 </div>
 <label className="flex items-center gap-2 rounded-full border border-gold-400/25 bg-wine-850 py-2 pl-3 pr-2 text-[10px] font-bold uppercase tracking-[0.18em] text-mauve-100">
 <SlidersHorizontal className="h-4 w-4 text-gold-400" />
 <select value={family} onChange={(e) => setParam('family', e.target.value)} aria-label="Filter by family" className="bg-transparent py-0.5 outline-none [&>option]:bg-wine-850">
 <option value="All">All families</option>
 {FAMILIES.map((f) => <option key={f} value={f}>{f}</option>)}
 </select>
 </label>
 <div className="flex items-center gap-1.5" role="group" aria-label="Filter by gender">
 {(['Women', 'Men', 'Unisex'] as const).map((g) => {
 const active = gender === g;
 return (
 <button
 key={g}
 type="button"
 aria-pressed={active}
 onClick={() => setParam('gender', active ? null : g)}
 className={`m3-focus rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition ${active ? 'border-gold-400 bg-gold-400 text-wine-950 ' : 'border-gold-400/25 bg-wine-850 text-mauve-100 hover:border-gold-400 hover:text-gold-200'}`}
 >
 {g}
 </button>
 );
 })}
 </div>
 <label className="flex items-center gap-2 rounded-full border border-gold-400/25 bg-wine-850 py-2 pl-3 pr-2 text-[10px] font-bold uppercase tracking-[0.18em] text-mauve-100">
 <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort" className="bg-transparent py-0.5 outline-none [&>option]:bg-wine-850">
 <option value="featured">Featured</option>
 <option value="price-asc">Price · low to high</option>
 <option value="price-desc">Price · high to low</option>
 <option value="rating">Best rated</option>
 <option value="name">Alphabetical</option>
 </select>
 </label>
 </form>
 {activeFilters.length > 0 && (
 <div className="mt-2 flex flex-wrap items-center gap-2">
 {activeFilters.map((f) => (
 <span key={f} className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-gold-200">{f}</span>
 ))}
 <button onClick={clearAll} className="m3-focus flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.2em] text-mauve-200 transition hover:text-gold-200">
 <X className="h-3.5 w-3.5" /> Clear all
 </button>
 </div>
 )}
 </div>

 {/* ── Grid ── */}
 <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.28em] text-mauve-300" role="status">{filtered.length} flacon{filtered.length === 1 ? '' : 's'} in the collection</p>
 {filtered.length === 0 ? (
 <div className="flex flex-col items-center gap-4 py-20 text-center">
 <SearchX className="h-12 w-12 text-mauve-400" strokeWidth={1.4} />
 <p className="font-display text-2xl text-cream-100">Nothing in the home matches “{searchParams.get('search')}”</p>
 <p className="max-w-sm text-sm text-mauve-100/80">Try a note (oud, neroli, vanilla…), a family, or a name — the collection is small but every flacon is hand-numbered.</p>
 <button onClick={clearAll} className="m3-focus rounded-full bg-gold-400 px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-wine-950 transition hover:bg-gold-300">Show all flacons</button>
 </div>
 ) : (
 <motion.div layout className="mt-4 grid grid-cols-1 gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ contentVisibility: 'auto' }}>
 <AnimatePresence mode="popLayout">
 {filtered.map((p, i) => (
 <PerfumeCard key={p.id} perfume={p} index={i} />
 ))}
 </AnimatePresence>
 </motion.div>
 )}
 </div>
 );
}
