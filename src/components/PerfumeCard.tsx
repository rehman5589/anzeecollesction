/* ─────────────────────────────────────────────────────────────────
 AN’ZEE COLLECTION · Flacon Card — real photography, M3 elevated card
 ───────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { formatDH, type Perfume } from '../lib/data';
import { useMaison } from '../lib/store';
import PerfumeBadge from './Badge';

export default function PerfumeCard({ perfume, index = 0 }: { perfume: Perfume; index?: number }) {
 const [sizeIdx, setSizeIdx] = useState(0);
 const addToCart = useMaison((s) => s.addToCart);
 const toast = useMaison((s) => s.toast);
 const wishlist = useMaison((s) => s.wishlist);
 const toggleWishlist = useMaison((s) => s.toggleWishlist);
 const navigate = useNavigate();
 const wished = wishlist.includes(perfume.id);
 const size = perfume.sizes[sizeIdx];
 const price = perfume.price[sizeIdx];

 const add = () => {
 addToCart(perfume.id, size, 1);
 toast({ icon: 'check', title: `${perfume.name} · ${size} ml`, body: 'Added to your reservation bag — reserve via WhatsApp when ready.' });
 };

 return (
 <motion.article
 layout
 initial={{ opacity: 0, y: 28 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.96 }}
 transition={{ duration: 0.45, delay: (index % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
 className="group relative flex flex-col overflow-hidden rounded-[26px] border border-gold-400/22 bg-gradient-to-b from-wine-850 to-wine-900 transition-shadow duration-300 hover: hover:"
 >
 {/* ── Real photograph ── */}
 <Link to={`/fragrance/${perfume.id}`} aria-label={`Discover ${perfume.name}`} className="relative block h-64 overflow-hidden bg-wine-800 sm:h-72">
 <img
 src={perfume.image}
 srcSet={`${perfume.image.replace('.webp', '-400.webp')} 400w, ${perfume.image.replace('.webp', '-800.webp')} 800w`}
 sizes="(max-width: 640px) 100vw, 320px"
 alt={`${perfume.name} - ${perfume.concentration} by AN'Zee Collection`}
 loading="lazy"
 decoding="async"
 className="h-full w-full object-cover object-top transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
 />
 <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine-900 via-wine-900/15 to-transparent" />
 <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
 <PerfumeBadge perfume={perfume} />
 {perfume.stock <= 20 && <span className="rounded-full border border-red-300/40 bg-red-950/60 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-red-200 ">Only {perfume.stock} flacons left</span>}
 </div>
 <button
 onClick={(e) => { e.preventDefault(); toggleWishlist(perfume.id); }}
 aria-pressed={wished}
 aria-label={wished ? `Remove ${perfume.name} from wishlist` : `Add ${perfume.name} to wishlist`}
 className="m3-focus absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-cream-100/25 bg-wine-950/55 transition hover:scale-110 hover:border-gold-400"
 >
 <Heart className={`h-5 w-5 transition ${wished ? 'fill-gold-400 text-gold-400' : 'text-cream-100'}`} strokeWidth={1.8} />
 </button>

 </Link>

 {/* ── Body ── */}
 <div className="flex flex-1 flex-col p-4">
 <div className="flex items-start justify-between gap-2">
 <div className="min-w-0">
 <h3 className="font-display text-[17px] font-semibold leading-tight text-cream-50">
 <Link to={`/fragrance/${perfume.id}`} className="transition hover:text-gold-200">{perfume.name}</Link>
 </h3>
 <p className="mt-0.5 text-[10px] text-mauve-200">{perfume.arabic} · {perfume.family}</p>
 </div>
 <div className="flex shrink-0 flex-col items-end">
 <span className="flex items-center gap-1 text-[11px] font-bold text-gold-300"><Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />{perfume.rating.toFixed(1)}</span>
 <span className="text-[9px] text-mauve-300">{perfume.reviews.toLocaleString()} reviews</span>
 </div>
 </div>

 <p className="mt-2 line-clamp-2 min-h-8 font-serif text-[12px] italic leading-snug text-mauve-100/85">“{perfume.tagline}”</p>

 {/* Heart notes preview */}
 <p className="mt-1.5 truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-mauve-300">
 Heart · {perfume.notes.heart.slice(0, 2).join(' · ')}
 </p>

 {/* Size selector */}
 {perfume.sizes.length > 1 && (
 <div className="mt-2.5 flex gap-1.5" role="group" aria-label="Choose size">
 {perfume.sizes.map((s, i) => (
 <button key={s} onClick={() => setSizeIdx(i)} aria-pressed={i === sizeIdx} className={`m3-focus rounded-full border px-2.5 py-1 text-[9px] font-bold tracking-wide transition ${i === sizeIdx ? 'border-gold-400 bg-gold-400 text-wine-950' : 'border-mauve-500/40 text-mauve-100 hover:border-gold-400/60 hover:text-gold-200'}`}>
 {s} ml
 </button>
 ))}
 </div>
 )}

 {/* Price + CTA */}
 <div className="mt-auto flex items-end justify-between gap-2 pt-3">
 <div>
 <p className="font-display text-[19px] font-semibold leading-none text-gold-300">{formatDH(price)}</p>
 <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-mauve-300">{perfume.concentration} · {perfume.oils}% oils</p>
 </div>
 <button onClick={add} className="m3-focus state-layer flex items-center gap-1.5 rounded-full border border-gold-400/55 bg-gold-400/10 py-2 pl-3 pr-4 text-[9px] font-extrabold uppercase tracking-[0.18em] text-gold-300 transition hover:border-gold-400 hover:bg-gold-400 hover:text-wine-950" aria-label={`Add ${perfume.name} ${size} ml to reservation bag`}>
 <ShoppingBag className="h-4 w-4" strokeWidth={2} /> Reserve
 </button>
 </div>

 {/* Secondary ghost action */}
 <button onClick={() => navigate(`/fragrance/${perfume.id}`)} className="m3-focus mt-2 text-center text-[9px] font-bold uppercase tracking-[0.24em] text-mauve-300 transition hover:text-gold-200">
 Notes · Story · 3D Home
 </button>
 </div>
 </motion.article>
 );
}
