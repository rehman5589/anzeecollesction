/* ─────────────────────────────────────────────────────────────────────
 AN'ZEE COLLECTION · Fragrance Detail
 Real-photography 3D home + note pyramid + WhatsApp reservation CTA
 ───────────────────────────────────────────────────────────────────── */

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
 ArrowLeft, Star, Heart, ShoppingBag, Sun, CloudSun, MoonStar, Wind, Clock, ChevronRight, ShieldCheck, Truck, Sparkles,
} from 'lucide-react';
import { formatDH, priceForSize } from '../lib/data';
import { useCatalog, useMaison } from '../lib/store';
import FlaconScene from '../components/FlaconScene';
import PerfumeBadge from '../components/Badge';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { buildProductInquiry, waLink } from '../lib/whatsapp';
import PerfumeCard from '../components/PerfumeCard';

const ACTS = [
 { id: 'top' as const, label: 'I · The Attack', icon: Sun, hint: 'First 15 minutes — the opening gesture' },
 { id: 'heart' as const, label: 'II · The Heart', icon: CloudSun, hint: 'Hours 1–4 — the true character' },
 { id: 'base' as const, label: 'III · The Sillage', icon: MoonStar, hint: 'Hours 4–14 — the lingering signature' },
];

export default function FragranceDetail() {
 const { id } = useParams<{ id: string }>();
 const catalog = useCatalog();
 const perfume = catalog.find((p) => p.id === id);
 const navigate = useNavigate();
 const addToCart = useMaison((s) => s.addToCart);
 const toast = useMaison((s) => s.toast);
 const wishlist = useMaison((s) => s.wishlist);
 const toggleWishlist = useMaison((s) => s.toggleWishlist);

 const [sizeIdx, setSizeIdx] = useState(0);
 const [qty, setQty] = useState(1);
 const [act, setAct] = useState<'top' | 'heart' | 'base'>('heart');
 const [exploded, setExploded] = useState(false);
 const [tab, setTab] = useState<'notes' | 'story'>('notes');

 useEffect(() => {
 // eslint-disable-next-line react-hooks/set-state-in-effect
 setSizeIdx(0);
 setQty(1);
 setAct('heart');
 setExploded(false);
 setTab('notes');
 }, [id]);

 const pairs = useMemo(() => (perfume ? catalog.filter((p) => p.id !== perfume.id && p.family === perfume.family).concat(catalog.filter((p) => p.id !== perfume.id && p.family !== perfume.family)).slice(0, 3) : []), [catalog, perfume]);

 if (!perfume) {
 return (
 <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-6 py-28 text-center">
 <p className="font-display text-3xl text-cream-50">This flacon has left the home</p>
 <p className="text-sm text-mauve-100/85">The fragrance you reached for is no longer in the collection.</p>
 <Link to="/collection" className="m3-focus rounded-full bg-gold-400 px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-wine-950">Browse the collection</Link>
 </div>
 );
 }

 const size = perfume.sizes[Math.min(sizeIdx, perfume.sizes.length - 1)];
 const unitPrice = priceForSize(perfume, size);
 const wished = wishlist.includes(perfume.id);

 const add = () => {
 addToCart(perfume.id, size, qty);
 toast({ icon: 'check', title: `${perfume.name} · ${size} ml × ${qty}`, body: 'Sealed into your reservation bag.' });
 };

 const reserveNow = () => {
 const url = waLink(buildProductInquiry(perfume, size, {}));
 window.open(url, '_blank', 'noopener,noreferrer');
 };

 const intensity = [
 { label: 'Longevity', value: perfume.longevity },
 { label: 'Projection', value: perfume.projection },
 { label: 'Sillage', value: perfume.sillage },
 ];

 return (
 <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
 {/* Breadcrumb */}
 <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-mauve-300" aria-label="Breadcrumb">
 <button onClick={() => navigate(-1)} className="m3-focus flex items-center gap-1 transition hover:text-gold-200"><ArrowLeft className="h-3.5 w-3.5" /> Retour</button>
 <ChevronRight className="h-3.5 w-3.5" />
 <Link to="/collection" className="transition hover:text-gold-200">Collection</Link>
 <ChevronRight className="h-3.5 w-3.5" />
 <span className="text-gold-300">{perfume.name}</span>
 </nav>

 <div className="mt-6 grid gap-8 lg:grid-cols-2">
 {/* ══════════ LEFT — 3D home + photography ══════════ */}
 <section aria-label="3D flacon viewer">
 {/* Tab switcher (mobile ordering) */}
 <div className="mb-3 flex gap-2 rounded-2xl border border-gold-400/25 bg-wine-900 p-1.5">
 {([
 { id: 'notes', label: 'Notes', icon: Wind },
 { id: 'story', label: 'Story', icon: Sparkles },
 ] as const).map(({ id: t, label, icon: Icon }) => (
 <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t} className={`m3-focus flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[9px] font-extrabold uppercase tracking-[0.2em] transition ${tab === t ? 'bg-gold-400 text-wine-950' : 'text-mauve-100 hover:text-gold-200'}`}>
 <Icon className="h-4 w-4" />{label}
 </button>
 ))}
 </div>

 <div className="relative overflow-hidden rounded-[32px] border border-gold-400/30 bg-[radial-gradient(ellipse_at_50%_30%,#3a0d1a_0%,#26060c_65%,#1c030a_100%)] ">
 {/* 3D canvas — real photography woven in */}
 <FlaconScene
 perfume={perfume}
 autoRotate={false}
 exploded={exploded}
 onToggleExploded={() => setExploded((v) => !v)}
 className="relative h-[420px] w-full sm:h-[480px]"
 />

 {/* HUD chips */}
 <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
 <PerfumeBadge perfume={perfume} />
 <span className="w-fit rounded-full border border-cream-100/20 bg-wine-950/60 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-cream-100 ">Nº {String(perfume.createdAt).slice(0, 4)} · batch certified</span>
 </div>
 <div className="absolute right-4 top-4 flex flex-col gap-2">
 <button onClick={() => toggleWishlist(perfume.id)} aria-pressed={wished} aria-label="Toggle wishlist" className="m3-focus flex h-11 w-11 items-center justify-center rounded-2xl border border-cream-100/25 bg-wine-950/60 transition hover:border-gold-400">
 <Heart className={`h-5 w-5 ${wished ? 'fill-gold-400 text-gold-400' : 'text-cream-100'}`} strokeWidth={1.8} />
 </button>
 </div>
 <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold-400/35 bg-wine-950/70 px-4 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.26em] text-gold-300 ">
 Drag to orbit · scroll to zoom · tap cap to deconstruct
 </p>
 </div>

 {/* Real product photograph strip */}
 <figure className="mt-4 overflow-hidden rounded-3xl border border-gold-400/22 ">
 <img loading="lazy" src={perfume.image} alt={`${perfume.name} flacon — official product photograph`} className="h-44 w-full object-cover object-top sm:h-52" />
 <figcaption className="border-t border-wine-800 bg-wine-900 px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.24em] text-mauve-200">
 Official home photograph · {perfume.name} · {perfume.concentration}
 </figcaption>
 </figure>
 </section>

 {/* ══════════ RIGHT — commerce column ══════════ */}
 <section>
 <p className="text-[9px] font-extrabold uppercase tracking-[0.32em] text-gold-400">{perfume.concentration} · {perfume.family} · {perfume.gender}</p>
 <h1 className="mt-2 font-display text-4xl font-semibold text-cream-50 sm:text-5xl">{perfume.name}</h1>
 <p className="mt-1 text-sm text-mauve-200">{perfume.arabic} — “{perfume.tagline}”</p>

 <div className="mt-4 flex items-center gap-4">
 <span className="flex items-center gap-1.5 text-sm font-bold text-gold-300"><Star className="h-4 w-4 fill-gold-400 text-gold-400" />{perfume.rating.toFixed(1)}</span>
 <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mauve-300">{perfume.reviews.toLocaleString()} verified reviews</span>
 <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mauve-300">· {perfume.oils}% concentration</span>
 </div>

 {/* Price */}
 <p className="mt-5 font-display text-5xl font-semibold text-gold-300">{formatDH(unitPrice)}</p>
 <p className="mt-1 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-mauve-300"><ShieldCheck className="h-4 w-4 text-gold-400" /> Boutique reservation — no online payment</p>

 {/* Size + qty */}
 <div className="mt-6 flex flex-wrap items-end gap-5">
 {perfume.sizes.length > 1 && (
 <div>
 <p className="field-label">Flacon size</p>
 <div className="mt-2 flex gap-2">
 {perfume.sizes.map((s, i) => (
 <button key={s} onClick={() => setSizeIdx(i)} aria-pressed={i === sizeIdx} className={`m3-focus rounded-2xl border px-4 py-2.5 text-center transition ${i === sizeIdx ? 'border-gold-400 bg-gold-400 text-wine-950 ' : 'border-mauve-500/40 text-cream-100 hover:border-gold-400/60'}`}>
 <span className="block text-sm font-extrabold">{s}</span>
 <span className="block text-[8px] font-bold uppercase tracking-[0.18em]">ml · {formatDH(perfume.price[i])}</span>
 </button>
 ))}
 </div>
 </div>
 )}
 <div>
 <p className="field-label">Quantity</p>
 <div className="mt-2 flex items-center rounded-2xl border border-mauve-500/40">
 <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="m3-focus h-12 w-11 text-lg text-cream-100 transition hover:text-gold-200">−</button>
 <span className="w-10 text-center font-display text-lg text-cream-50" aria-live="polite">{qty}</span>
 <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity" className="m3-focus h-12 w-11 text-lg text-cream-100 transition hover:text-gold-200">+</button>
 </div>
 </div>
 </div>

 {/* CTAs */}
 <div className="mt-6 flex flex-col gap-3 sm:flex-row">
 <button onClick={add} className="btn-sheen m3-focus flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-400 py-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-wine-950 transition hover:bg-gold-300">
 <ShoppingBag className="h-5 w-5" strokeWidth={2.2} /> Add to Reservation Bag
 </button>
 <button onClick={reserveNow} className="m3-focus flex flex-1 items-center justify-center gap-2.5 rounded-full border-2 border-[#25D366] bg-[#25D366]/10 py-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#7ef0ae] transition hover:bg-[#25D366] hover:text-[#10341f]">
 <WhatsAppIcon className="h-5 w-5" /> Reserve on WhatsApp
 </button>
 </div>
 <p className="mt-3 flex items-center gap-2 text-[10px] text-mauve-200"><Truck className="h-4 w-4 shrink-0 text-gold-400" /> Reserve today — collect at Derb Moulay Charif, or prepare a private home rendez-vous. Home delivery intentionally not offered yet.</p>

 {/* ── TAB PANEL: Notes pyramid / Story ── */}
 <div className="mt-7">
 <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
 {tab === 'notes' && (
 <div>
 {/* Pyramid tabs */}
 <div className="flex gap-2">
 {ACTS.map(({ id: a, label, icon: Icon }) => (
 <button key={a} onClick={() => setAct(a)} aria-pressed={act === a} className={`m3-focus flex-1 rounded-2xl border px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.14em] transition ${act === a ? 'border-gold-400 bg-wine-800 text-gold-300' : 'border-wine-700 text-mauve-200 hover:text-gold-200'}`}>
 <Icon className="mx-auto mb-1 h-4 w-4" />{label}
 </button>
 ))}
 </div>
 <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-mauve-300">{ACTS.find((a) => a.id === act)?.hint}</p>
 <div className="mt-2 flex flex-wrap gap-2">
 {perfume.notes[act].map((n) => (
 <span key={n} className="rounded-xl border border-gold-400/45 bg-cream-50 px-3.5 py-2 text-[11px] font-semibold text-wine-800 ">{n}</span>
 ))}
 </div>
 </div>
 )}
 {tab === 'story' && (
 <blockquote className="paper rounded-3xl border border-gold-500/30 p-6 font-serif text-[15px] leading-relaxed text-wine-800 ">
 <Wind aria-hidden className="mb-2 h-5 w-5 text-gold-600" />
 {perfume.story}
 <footer className="mt-3 text-[9px] font-sans font-bold uppercase tracking-[0.26em] text-mauve-500">— The Nose of the Home</footer>
 </blockquote>
 )}
 </motion.div>

 {/* Intensity meters always visible */}
 <div className="mt-4 grid grid-cols-3 gap-3">
 {intensity.map(({ label, value }) => (
 <div key={label} className="rounded-2xl border border-wine-700 bg-wine-900 p-3">
 <p className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-[0.2em] text-mauve-200"><span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gold-400" />{label}</span><span className="text-gold-300">{value}/10</span></p>
 <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-wine-800">
 <motion.div initial={{ width: 0 }} animate={{ width: `${value * 10}%` }} transition={{ duration: 0.9, delay: 0.15 }} className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200" />
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>
 </div>

 {/* ══════════ OTHER FLACONS FROM THE MAISON ══════════ */}
 <section className="mt-16">
 <div className="flex items-end justify-between gap-4">
 <h2 className="font-display text-2xl font-semibold text-cream-50">Continue the <span className="gold-text italic">ritual</span></h2>
 <Link to="/collection" className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-gold-300 transition hover:text-gold-200">All flacons →</Link>
 </div>
 <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
 {pairs.map((p, i) => <PerfumeCard key={p.id} perfume={p} index={i} />)}
 </div>
 </section>
 </div>
 );
}
