/* ─────────────────────────────────────────────────────────────────────
 AN'ZEE COLLECTION · Global Layout
 Announcement → glass nav → routes → newsletter/footer → floating
 WhatsApp concierge (real icon) + scroll FAB. Material Design 3 chrome.
 ───────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, ChevronUp, Instagram, MapPin, Clock, Mail, Phone, BadgeCheck, Send, Lock, Sparkles } from 'lucide-react';
import { HOUSE } from '../lib/data';
import { useMaison } from '../lib/store';
import WhatsAppIcon from './WhatsAppIcon';
import Toasts from './Toast';

const NAV = [
 { to: '/', label: 'Home' },
 { to: '/collection', label: 'Collection' },
 { to: '/quiz', label: 'Discovery Quiz' },
 { to: '/legacy', label: 'Legacy' },
 { to: '/contact', label: 'Contact' },
];

export default function Layout() {
 const cart = useMaison((s) => s.cart);
 const cartCount = cart.reduce((n, l) => n + l.qty, 0);
 const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled] = useState(false);
  const [showFab] = useState(false);
 const [query, setQuery] = useState('');
 const [searchOpen, setSearchOpen] = useState(false);
 const [logoOpen, setLogoOpen] = useState(false);
 const searchRef = useRef<HTMLInputElement>(null);
 const location = useLocation();
 const navigate = useNavigate();
 const toast = useMaison((s) => s.toast);

 useEffect(() => {
 // eslint-disable-next-line react-hooks/set-state-in-effect
 setMenuOpen(false);
 setSearchOpen(false);
 window.scrollTo({ top: 0 });
 }, [location.pathname]);


 useEffect(() => {
 if (searchOpen) searchRef.current?.focus();
 }, [searchOpen]);

 const submitSearch = (e: React.FormEvent) => {
 e.preventDefault();
 const q = query.trim();
 if (!q) return;
 navigate(`/collection?search=${encodeURIComponent(q)}`);
 setQuery('');
 };

 const subscribe = (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 const input = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
 const value = input.value.trim();
 if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(value)) {
 toast({ icon: 'shield', title: 'Please enter a valid email', body: 'The Notebook reaches you at a real inbox.' });
 return;
 }
 input.value = '';
 toast({ icon: 'check', title: 'Welcome to the Notebook ✦', body: `${value} — letters from the home, once a month.` });
 };

 return (
 <div className="relative flex min-h-[100svh] flex-col bg-wine-950 text-cream-100">
 {/* ── Top bar ───────────────────────────────────────────────────── */}
 <header className={`sticky top-0 z-50 border-b transition-all duration-500 ${scrolled ? 'border-gold-400/25 bg-wine-950/88 ' : 'border-transparent bg-transparent'}`}>
 <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
 {/* Mobile menu toggle */}
 <button onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} className="m3-focus rounded-full p-2 text-cream-100 transition hover:bg-wine-800 lg:hidden">
 {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
 </button>

 {/* Wordmark */}
 <div className="mr-auto flex shrink-0 items-center gap-3 leading-none lg:mr-6">
 <button
 type="button"
 onClick={() => setLogoOpen(true)}
 aria-label="View the AN’Zee logo"
 className="m3-focus group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-wine-900 ring-1 ring-gold-400/40 transition hover:ring-gold-400"
 >
 <img loading="lazy" src="/logo.webp" alt="AN’Zee Collection" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
 </button>
 <Link to="/" className="m3-focus group flex flex-col items-start">
 <span className="font-display text-[22px] font-semibold tracking-[0.08em] text-cream-50 transition group-hover:text-gold-200">
 AN<span className="text-gold-400">’</span>ZEE
 </span>
 <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.44em] text-gold-400">Collection</span>
 </Link>
 </div>

 {/* Desktop nav */}
 <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
 {NAV.map((item) => (
 <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `m3-focus state-layer rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] transition ${isActive ? 'bg-gold-400 text-wine-950 ' : 'text-cream-100 hover:text-gold-200'}`}>
 {item.label}
 </NavLink>
 ))}
 </nav>

 {/* Search */}
 <div className="relative flex items-center">
 <AnimatePresence>
 {searchOpen && (
 <motion.form initial={{ width: 0, opacity: 0 }} animate={{ width: 180, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} onSubmit={submitSearch} className="overflow-hidden">
 <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the maison…" aria-label="Search fragrances" className="w-44 rounded-full border border-gold-400/35 bg-wine-850 py-2 pl-4 pr-3 text-xs text-cream-50 outline-none placeholder:text-mauve-300 focus:border-gold-400 sm:w-44" />
 </motion.form>
 )}
 </AnimatePresence>
 <button onClick={() => setSearchOpen((v) => !v)} aria-label="Toggle search" className="m3-focus state-layer rounded-full p-2 text-cream-100 transition hover:text-gold-200">
 <Search className="h-5 w-5" />
 </button>
 </div>

 {/* User Login (admin) */}
 <Link to="/admin" aria-label="User Login — staff access" title="User Login — staff access" className="m3-focus state-layer hidden rounded-full p-2 text-mauve-200 transition hover:text-gold-300 sm:block">
 <Lock className="h-5 w-5" strokeWidth={1.8} />
 </Link>

 {/* Reserve bag */}
 <Link to="/cart" aria-label={`Reservation bag, ${cartCount} item${cartCount === 1 ? '' : 's'}`} className="m3-focus state-layer relative rounded-full p-2 text-cream-100 transition hover:text-gold-200">
 <ShoppingBag className="h-6 w-6" strokeWidth={1.8} />
 {cartCount > 0 && (
 <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[9px] font-extrabold text-wine-950 ring-2 ring-wine-950">
 {cartCount > 9 ? '9+' : cartCount}
 </span>
 )}
 </Link>
 </div>

 {/* Mobile nav panel */}
 <AnimatePresence>
 {menuOpen && (
 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden border-t border-gold-400/20 bg-wine-950/97 lg:hidden">
 <form onSubmit={submitSearch} className="border-b border-wine-800 px-4 py-3">
 <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the maison…" aria-label="Search fragrances" className="field-input" />
 </form>
 <nav className="grid gap-1 p-4" aria-label="Mobile">
 {NAV.map((item) => (
 <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `rounded-2xl px-4 py-3 text-[11px] font-bold uppercase tracking-[0.22em] transition ${isActive ? 'bg-gold-400 text-wine-950' : 'text-cream-100 hover:bg-wine-800'}`}>
 {item.label}
 </NavLink>
 ))}
 <Link to="/admin" className="flex items-center gap-2 rounded-2xl px-4 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-mauve-200 transition hover:bg-wine-800">
 <Lock className="h-4 w-4" /> User Login — Staff
 </Link>
 </nav>
 </motion.div>
 )}
 </AnimatePresence>
 </header>

 {/* ── Routed pages ──────────────────────────────────────────────── */}
 <main className="relative z-0 flex-1" style={{ willChange: 'auto', transform: 'translateZ(0)' }}>
 <Outlet />
 </main>

 {/* ── Newsletter + Footer ───────────────────────────────────────── */}
 <footer className="relative z-10 border-t border-gold-400/25 bg-wine-900">
 {/* Newsletter band */}
 <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 border-b border-wine-800 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
 <div className="text-center md:text-left">
 <p className="flex items-center justify-center gap-2 font-display text-lg text-cream-50 md:justify-start">
 <Sparkles className="h-4 w-4 text-gold-400" /> The Notebook
 </p>
 <p className="mt-1 text-[11px] text-mauve-100/85">One letter a month — batches, blends and boutique rendez-vous.</p>
 </div>
 <form onSubmit={subscribe} className="flex w-full max-w-md overflow-hidden rounded-full border border-gold-400/40 bg-wine-850 focus-within:border-gold-400">
 <label htmlFor="newsletter-email" className="sr-only">Your email</label>
 <input id="newsletter-email" name="email" type="email" required placeholder="you@email.com" className="w-full bg-transparent px-5 py-3 text-sm text-cream-50 outline-none placeholder:text-mauve-300" />
 <button type="submit" className="m3-focus flex shrink-0 items-center gap-2 bg-gold-400 px-5 text-[10px] font-bold uppercase tracking-[0.2em] text-wine-950 transition hover:bg-gold-300">
 Subscribe <Send className="h-3.5 w-3.5" />
 </button>
 </form>
 </div>

 <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
 <div>
 <div className="flex items-center gap-3">
 <img loading="lazy" src="/logo.webp" alt="AN’Zee Collection" className="h-12 w-12 rounded-full object-cover ring-1 ring-gold-400/40" />
 <p className="font-display text-3xl text-cream-50">
 AN<span className="text-gold-400">’</span>ZEE
 </p>
 </div>
 <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.42em] text-gold-400">Collection · Parfumerie</p>
 <p className="mt-4 text-[11.5px] leading-relaxed text-mauve-100/85">Fine artisanal parfumerie since 1987. Each extract is composed in small batches, numbered and sealed in Casablanca.</p>
 <p className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-gold-300">
 <BadgeCheck className="h-4 w-4" /> Authentic flacons · certificate of authenticity
 </p>
 <div className="mt-5 flex items-center gap-2">
 <a href={HOUSE.instagramUrl} target="_blank" rel="noreferrer" aria-label="AN’Zee Collection on Instagram" className="m3-focus state-layer inline-flex h-10 w-10 items-center justify-center rounded-full border border-mauve-500/45 bg-mauve-800/25 text-mauve-100 transition hover:scale-110 hover:border-gold-400 hover:text-gold-300">
 <Instagram className="h-5 w-5" />
 </a>
 <a href={`https://wa.me/${HOUSE.whatsappNumber}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="m3-focus state-layer inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#25D366]/45 bg-[#25D366]/10 transition hover:scale-110 hover:border-[#25D366]">
 <WhatsAppIcon className="h-5 w-5" />
 </a>
 <Link to="/instagram" className="m3-focus rounded-full border border-gold-400/40 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-gold-300 transition hover:bg-gold-400 hover:text-wine-950">
 View gallery →
 </Link>
 </div>
 </div>

 <nav aria-label="Home">
 <p className="field-label">Home</p>
 <ul className="mt-3 space-y-2 text-[12px] text-mauve-100/90">
 <li><Link to="/collection" className="transition hover:text-gold-200">The Collection</Link></li>
 <li><Link to="/quiz" className="transition hover:text-gold-200">Discovery Quiz</Link></li>
 <li><Link to="/legacy" className="transition hover:text-gold-200">Legacy & Home</Link></li>
 <li><Link to="/instagram" className="transition hover:text-gold-200">Instagram Gallery</Link></li>
 <li><Link to="/contact" className="transition hover:text-gold-200">Private Appointments</Link></li>
 </ul>
 </nav>

 <div>
 <p className="field-label">Boutique</p>
 <ul className="mt-3 space-y-2.5 text-[12px] leading-snug text-mauve-100/90">
 <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />{HOUSE.address}</li>
 <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />{HOUSE.hours}</li>
 <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /><a href={`tel:${HOUSE.phone.replace(/\s/g, '')}`} className="transition hover:text-gold-200">{HOUSE.phone}</a></li>
 <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /><a href={`mailto:${HOUSE.email}`} className="transition hover:text-gold-200">{HOUSE.email}</a></li>
 </ul>
 </div>

 <div>
 <p className="field-label">Reserve, never check out</p>
 <p className="mt-3 text-[11.5px] leading-relaxed text-mauve-100/90">AN’Zee flacons are reserved exclusively through our WhatsApp concierge. No online payment — each numbered extract is wrapped, certified and handed to you in the boutique, or prepared for a private home rendez-vous.</p>
 <a href={`https://wa.me/${HOUSE.whatsappNumber}?text=${encodeURIComponent('Hello AN’Zee Collection 🌹 I would like to visit the boutique.')}`} target="_blank" rel="noreferrer" className="btn-sheen m3-focus mt-4 inline-flex items-center gap-2 rounded-full bg-gold-400 px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-wine-950 transition hover:bg-gold-300">
 <WhatsAppIcon className="h-4 w-4" /> Open WhatsApp Concierge
 </a>
 </div>
 </div>

 <div className="border-t border-wine-800">
 <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-mauve-300 sm:flex-row sm:px-6 lg:px-8">
 <span>© {new Date().getFullYear()} AN’Zee Collection · Nº Béni Mellal — Casablanca</span>
 <span className="flex items-center gap-4">
 <Link to="/admin" className="flex items-center gap-1.5 transition hover:text-gold-300"><Lock className="h-3 w-3" /> User Login</Link>
 <span className="text-gold-500">Est. 1987</span>
 </span>
 </div>
 </div>
 </footer>

 {/* ── Floating WhatsApp concierge (real icon) ───────────────────── */}
 <a
 href={`https://wa.me/${HOUSE.whatsappNumber}?text=${encodeURIComponent('Hello AN’Zee Collection 🌹 I would like assistance choosing my extrait.')}`}
 target="_blank"
 rel="noreferrer"
 aria-label="Chat with the AN’Zee concierge on WhatsApp"
 className="m3-focus fixed bottom-6 right-5 z-[60] flex animate-pulse-ring items-center gap-0 overflow-hidden rounded-full border border-[#25D366]/60 bg-[#10341f] transition-transform hover:scale-105"
 >
 <span className="hidden max-w-0 whitespace-nowrap pl-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7ef0ae] opacity-0 transition-all duration-500 sm:block sm:max-w-56 sm:pr-1 sm:opacity-100">
 Concierge on WhatsApp
 </span>
 <span className="flex h-14 w-14 items-center justify-center">
 <WhatsAppIcon className="h-9 w-9" />
 </span>
 </a>

 {/* ── Scroll to top FAB ─────────────────────────────────────────── */}
 <AnimatePresence>
 {showFab && (
 <motion.button
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 20 }}
 onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
 aria-label="Back to top"
 className="m3-focus fixed bottom-24 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-400/40 bg-wine-850/90 text-gold-300 transition hover:border-gold-400 hover:text-gold-200"
 >
 <ChevronUp className="h-6 w-6" />
 </motion.button>
 )}
 </AnimatePresence>

 {/* ── Logo popup (small window) ─────────────────────────────────── */}
 <AnimatePresence>
 {logoOpen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setLogoOpen(false)}
 className="fixed inset-0 z-[80] flex items-center justify-center bg-wine-950/80 p-6 "
 role="dialog"
 aria-modal="true"
 aria-label="AN’Zee logo"
 >
 <motion.div
 initial={{ scale: 0.85, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.85, opacity: 0 }}
 transition={{ type: 'spring', stiffness: 260, damping: 22 }}
 onClick={(e) => e.stopPropagation()}
 className="relative flex flex-col items-center gap-4 rounded-[32px] border border-gold-400/40 bg-wine-900 p-6 "
 >
 <button
 type="button"
 onClick={() => setLogoOpen(false)}
 aria-label="Close logo"
 className="m3-focus absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/30 bg-wine-850 text-gold-300 transition hover:border-gold-400 hover:text-gold-200"
 >
 <X className="h-4 w-4" />
 </button>
 <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-full bg-wine-950 ring-2 ring-gold-400/50">
 <img loading="lazy" src="/logo.webp" alt="AN’Zee Collection logo" className="h-full w-full object-cover" />
 </div>
 <p className="font-display text-lg text-cream-50">AN’Zee Collection</p>
 <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold-400">Haute Parfumerie Artisanale · Est. 1987</p>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 <Toasts />
 </div>
 );
}
