/* ─────────────────────────────────────────────────────────────────────
 AN'ZEE COLLECTION · Reservation Bag — WhatsApp Inquiry checkout
 NO online payment · NO home delivery (yet) · boutique pickup / rendez-vous
 ───────────────────────────────────────────────────────────────────── */

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Minus, Plus, Store, CalendarClock, ShieldCheck, Sparkles, CheckCircle2, BadgePercent } from 'lucide-react';
import { formatDH, priceForSize } from '../lib/data';
import { useCatalog, useMaison } from '../lib/store';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { buildInquiryMessage, computeTotal, rateLimit, sanitize, submitLead, waLink, type Lead } from '../lib/whatsapp';

export default function Cart() {
 const catalog = useCatalog();
 const cart = useMaison((s) => s.cart);
 const setQty = useMaison((s) => s.setQty);
 const removeFromCart = useMaison((s) => s.removeFromCart);
 const clearCart = useMaison((s) => s.clearCart);
 const recordInquiry = useMaison((s) => s.recordInquiry);
 const toast = useMaison((s) => s.toast);
 const navigate = useNavigate();

 const [name, setName] = useState('');
 const [phone, setPhone] = useState('');
 const [method, setMethod] = useState<'boutique' | 'rendezvous'>('boutique');
 const [date, setDate] = useState('');
 const [note, setNote] = useState('');
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [submitting, setSubmitting] = useState(false);

 const lines = useMemo(
 () =>
 cart
 .map((l) => {
 const p = catalog.find((x) => x.id === l.id);
 return p ? { ...l, perfume: p, unit: priceForSize(p, l.size) } : null;
 })
 .filter(Boolean) as Array<{ id: string; size: number; qty: number; perfume: (typeof catalog)[number]; unit: number }>,
 [cart, catalog],
 );
 const total = computeTotal(cart, catalog);

 const validate = (): boolean => {
 const e: Record<string, string> = {};
 if (sanitize(name, 80).length < 2) e.name = 'Your name, please — the home greets you personally.';
 const digits = phone.replace(/[^\d]/g, '');
 if (digits.length < 9 || digits.length > 15) e.phone = 'A valid phone / WhatsApp number is required (9–15 digits).';
 if (method === 'rendezvous' && !date) e.date = 'Choose a date for your private appointment.';
 setErrors(e);
 return Object.keys(e).length === 0;
 };

 const checkout = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!validate()) {
 toast({ icon: 'shield', title: 'A detail is missing', body: 'The concierge needs a name and a reachable number.' });
 return;
 }
 const limit = rateLimit('inquiry-lead', 4, 60_000);
 if (!limit.allowed) {
 toast({ icon: 'shield', title: 'One moment please', body: `The concierge line reopens in ${limit.retryAfterSec}s.` });
 return;
 }
 setSubmitting(true);
 const cleanPhone = sanitize(phone, 30);
 const details = { name: sanitize(name, 80), phone: cleanPhone, method, date: date || undefined, note: sanitize(note, 200) || undefined };
 const message = buildInquiryMessage(details, cart, catalog);

 const lead: Lead = {
 // eslint-disable-next-line react-hooks/purity
 id: `lead-${Date.now().toString(36)}`,
 ...details,
 cart: cart.map((l) => ({ ...l })),
 total,
 summary: message,
 // eslint-disable-next-line react-hooks/purity
 createdAt: Date.now(),
 status: 'new',
 };
 recordInquiry(lead);
 await submitLead(lead);

 window.open(waLink(message), '_blank', 'noopener,noreferrer');
 clearCart();
 setSubmitting(false);
 toast({ icon: 'check', title: 'Inquiry sent to WhatsApp ✦', body: 'The home confirms availability personally — usually within the hour.' });
 navigate('/contact', { state: { leadSent: true } });
 };

 /* ── Empty state ── */
 if (lines.length === 0) {
 return (
 <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-24 text-center">
 <span className="flex h-20 w-20 items-center justify-center rounded-3xl border border-gold-400/40 bg-wine-850 ">
 <ShoppingBag className="h-9 w-9 text-gold-300" strokeWidth={1.5} />
 </span>
 <h1 className="font-display text-4xl font-semibold text-cream-50">Your reservation bag<br /><span className="gold-text italic">is still empty</span></h1>
 <p className="max-w-sm font-serif text-lg italic text-mauve-100/90">Every AN’Zee flacon begins with a single gesture — yours.</p>
 <Link to="/collection" className="btn-sheen m3-focus rounded-full bg-gold-400 px-8 py-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-wine-950 transition hover:bg-gold-300">
 Enter the Collection
 </Link>
 </div>
 );
 }

 return (
 <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
 <p className="field-label">Boutique Reservation</p>
 <h1 className="mt-2 font-display text-4xl font-semibold text-cream-50 sm:text-5xl">Your <span className="gold-text italic">Reservation Bag</span></h1>
 <p className="mt-2 max-w-lg text-[13px] text-mauve-100/85">No card, no checkout, no delivery courier — a direct line to the home. Confirm your flacons on WhatsApp and collect them in Casablanca, or book a private home rendez-vous.</p>

 <div className="mt-8 grid gap-8 lg:grid-cols-5">
 {/* ════════ LEFT — bag lines with REAL images ════════ */}
 <div className="lg:col-span-3">
 <ul className="space-y-4">
 <AnimatePresence initial={false}>
 {lines.map(({ id, size, qty, perfume, unit }) => (
 <motion.li
 key={`${id}-${size}`}
 layout
 initial={{ opacity: 0, x: -28 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 48, height: 0, marginBottom: -16, overflow: 'hidden' }}
 transition={{ duration: 0.35 }}
 className="flex gap-4 rounded-3xl border border-gold-400/22 bg-gradient-to-br from-wine-850 to-wine-900 p-3 sm:gap-6 sm:p-4"
 >
 {/* Real product image */}
 <Link to={`/fragrance/${perfume.id}`} className="m3-focus block h-36 w-28 shrink-0 overflow-hidden rounded-2xl border border-gold-400/25 bg-wine-800 sm:h-40 sm:w-32">
 <img loading="lazy" src={perfume.image} alt={`${perfume.name} — ${perfume.concentration}`} className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105" />
 </Link>
 <div className="flex min-w-0 flex-1 flex-col">
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0">
 <Link to={`/fragrance/${perfume.id}`} className="font-display text-lg font-semibold leading-tight text-cream-50 transition hover:text-gold-200">{perfume.name}</Link>
 <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-mauve-300">{perfume.concentration} · {size} ml · {perfume.family}</p>
 <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-500">Nº 1987/{perfume.id.length.toString().padStart(2, '0')}{size} · hand-numbered</p>
 </div>
 <button onClick={() => removeFromCart(id, size)} aria-label={`Remove ${perfume.name} ${size} ml`} className="m3-focus rounded-full p-2 text-mauve-300 transition hover:bg-wine-800 hover:text-red-300">
 <Trash2 className="h-5 w-5" strokeWidth={1.8} />
 </button>
 </div>
 <div className="mt-auto flex items-end justify-between gap-3 pt-3">
 <div className="flex items-center rounded-2xl border border-mauve-500/40">
 <button onClick={() => setQty(id, size, qty - 1)} aria-label="Decrease" className="m3-focus flex h-9 w-9 items-center justify-center text-cream-100 transition hover:text-gold-200"><Minus className="h-4 w-4" /></button>
 <span className="w-8 text-center text-sm font-bold text-cream-50" aria-live="polite">{qty}</span>
 <button onClick={() => setQty(id, size, qty + 1)} aria-label="Increase" className="m3-focus flex h-9 w-9 items-center justify-center text-cream-100 transition hover:text-gold-200"><Plus className="h-4 w-4" /></button>
 </div>
 <div className="text-right">
 <p className="font-display text-lg font-semibold leading-none text-gold-300">{formatDH(unit * qty)}</p>
 <p className="mt-1 text-[9px] text-mauve-300">{formatDH(unit)} / flacon</p>
 </div>
 </div>
 </div>
 </motion.li>
 ))}
 </AnimatePresence>
 </ul>
 <button onClick={clearCart} className="m3-focus mt-4 text-[9px] font-extrabold uppercase tracking-[0.26em] text-mauve-300 transition hover:text-red-300">Empty the bag</button>

 {/* Oud Impérial upsell — house signature */}
 <div className="mt-6 flex items-center gap-4 overflow-hidden rounded-3xl border border-gold-500/35 bg-gradient-to-r from-gold-500/12 via-wine-850 to-wine-900 p-4">
 <img loading="lazy" src="/images/parfum-oud-imperial.webp" alt="Oud Impérial — the crown jewel of the home" className="h-24 w-20 rounded-2xl border border-gold-400/30 object-cover object-top" />
 <div className="min-w-0">
 <p className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.24em] text-gold-300"><BadgePercent className="h-4 w-4" /> The Collector’s Note</p>
 <p className="mt-1 text-[12px] leading-snug text-cream-100/90">Pair your reservation with <button className="font-bold text-gold-200 underline decoration-gold-500/50 underline-offset-2 hover:text-gold-100" onClick={() => navigate('/fragrance/oud-imperial')}>Oud Impérial</button>, our 40% Parfum extrait — only 19 flacons numbered this batch.</p>
 </div>
 </div>
 </div>

 {/* ════════ RIGHT — WhatsApp inquiry panel ════════ */}
 <form onSubmit={checkout} className="lg:col-span-2" noValidate>
 <div className="sticky top-24 rounded-[32px] border border-gold-400/35 bg-wine-900 p-6 ">
 <div className="flex items-center gap-3 border-b border-wine-800 pb-4">
 <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#25D366]/45 bg-[#25D366]/10">
 <WhatsAppIcon className="h-7 w-7" />
 </span>
 <div>
 <p className="font-display text-lg leading-tight text-cream-50">Reserve via WhatsApp</p>
 <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#7ef0ae]">Personal concierge · replies within the hour</p>
 </div>
 </div>

 {/* Summary */}
 <dl className="mt-4 space-y-1.5 border-b border-wine-800 pb-4 text-[12px]">
 <div className="flex justify-between text-mauve-100/90"><dt>Subtotal</dt><dd>{formatDH(total)}</dd></div>
 <div className="flex justify-between text-mauve-100/90"><dt>Boutique preparation & wax seal</dt><dd>Offered by the home</dd></div>
 <div className="flex justify-between text-mauve-100/90"><dt>Certificate of authenticity</dt><dd>Included</dd></div>
 <div className="flex items-baseline justify-between pt-1.5">
 <dt className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-gold-300">Estimated total</dt>
 <dd className="font-display text-2xl font-semibold text-gold-300">{formatDH(total)}</dd>
 </div>
 <p className="pt-1 text-right text-[8.5px] uppercase tracking-[0.2em] text-mauve-300">Settled in boutique — never online</p>
 </dl>

 {/* Pickup method */}
 <fieldset className="mt-4">
 <legend className="field-label">How shall we prepare your flacons?</legend>
 <div className="mt-2 grid grid-cols-2 gap-2">
 <button type="button" onClick={() => setMethod('boutique')} aria-pressed={method === 'boutique'} className={`m3-focus rounded-2xl border p-3 text-left transition ${method === 'boutique' ? 'border-gold-400 bg-gold-400/10 ' : 'border-wine-700 hover:border-gold-400/50'}`}>
 <Store className="h-5 w-5 text-gold-300" />
 <span className="mt-1.5 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-cream-50">Boutique pickup</span>
 <span className="mt-0.5 block text-[9px] leading-snug text-mauve-200">Derb Moulay Charif, Casablanca · Mon–Sat 9–20h</span>
 </button>
 <button type="button" onClick={() => setMethod('rendezvous')} aria-pressed={method === 'rendezvous'} className={`m3-focus rounded-2xl border p-3 text-left transition ${method === 'rendezvous' ? 'border-gold-400 bg-gold-400/10 ' : 'border-wine-700 hover:border-gold-400/50'}`}>
 <CalendarClock className="h-5 w-5 text-gold-300" />
 <span className="mt-1.5 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-cream-50">Private rendez-vous</span>
 <span className="mt-0.5 block text-[9px] leading-snug text-mauve-200">After-hours home session with the home</span>
 </button>
 </div>
 {method === 'rendezvous' && (
 <div className="mt-2">
 <label htmlFor="rdv-date" className="field-label">Preferred date</label>
 <input id="rdv-date" type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} className="field-input mt-1.5" aria-invalid={!!errors.date} />
 {errors.date && <p className="mt-1 text-[10px] font-semibold text-red-300">{errors.date}</p>}
 </div>
 )}
 </fieldset>

 {/* Details */}
 <div className="mt-4 grid gap-3">
 <div>
 <label htmlFor="lead-name" className="field-label">Your name *</label>
 <input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Salma…" autoComplete="name" maxLength={80} className="field-input mt-1.5" aria-invalid={!!errors.name} />
 {errors.name && <p className="mt-1 text-[10px] font-semibold text-red-300">{errors.name}</p>}
 </div>
 <div>
 <label htmlFor="lead-phone" className="field-label">Phone / WhatsApp *</label>
 <input id="lead-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+212 6 00 00 00 00" autoComplete="tel" inputMode="tel" maxLength={30} className="field-input mt-1.5" aria-invalid={!!errors.phone} />
 {errors.phone && <p className="mt-1 text-[10px] font-semibold text-red-300">{errors.phone}</p>}
 </div>
 <div>
 <label htmlFor="lead-note" className="field-label">A word for the home</label>
 <textarea id="lead-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Gift wrap, engraving, a name to number it with…" rows={2} maxLength={200} className="field-input mt-1.5 resize-none" />
 </div>
 </div>

 {/* Submit */}
 <button type="submit" disabled={submitting} className="btn-sheen m3-focus mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#10341f] transition hover:bg-[#3ef07f] disabled:opacity-60">
 {submitting ? <Sparkles className="h-5 w-5 animate-spin" /> : <WhatsAppIcon className="h-6 w-6" />}
 {submitting ? 'Opening WhatsApp…' : 'Send Inquiry on WhatsApp'}
 </button>
 <p className="mt-3 flex items-start gap-2 text-[10px] leading-snug text-mauve-200"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> Your details are encrypted into the WhatsApp link — never stored on a public server, never used for anything but your reservation.</p>
 <p className="mt-2 flex items-center justify-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.26em] text-mauve-300"><CheckCircle2 className="h-3.5 w-3.5 text-gold-500" /> No online payment · No home delivery yet · Boutique only</p>
 </div>
 </form>
 </div>
 </div>
 );
}
