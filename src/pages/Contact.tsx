import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail, ShieldCheck, CheckCircle2, CalendarClock } from 'lucide-react';
import { HOUSE } from '../lib/data';
import { rateLimit, sanitize, waLink } from '../lib/whatsapp';
import { useMaison } from '../lib/store';
import WhatsAppIcon from '../components/WhatsAppIcon';

export default function Contact() {
 const location = useLocation();
 const toast = useMaison((s) => s.toast);
 const recordInquiry = useMaison((s) => s.recordInquiry);
 const [name, setName] = useState('');
 const [phone, setPhone] = useState('');
 const [topic, setTopic] = useState('Boutique visit');
 const [message, setMessage] = useState('');
 const leadSent = (location.state as { leadSent?: boolean } | null)?.leadSent;

 const send = (e: React.FormEvent) => {
 e.preventDefault();
 if (sanitize(name, 80).length < 2 || phone.replace(/\D/g, '').length < 9) {
 toast({ icon: 'shield', title: 'A detail is missing', body: 'Name and reachable number, please — the home replies personally.' });
 return;
 }
 const limit = rateLimit('contact-lead', 4, 60_000);
 if (!limit.allowed) {
 toast({ icon: 'shield', title: 'One moment please', body: `The concierge line reopens in ${limit.retryAfterSec}s.` });
 return;
 }
 const msg = ['Hello AN’Zee Collection 🌹', '', `Topic: ${topic}`, `Name: ${sanitize(name, 80)}`, `Phone: ${sanitize(phone, 30)}`, message ? `Message: ${sanitize(message, 400)}` : null, '', '— via anzee-collection.ma'].filter(Boolean).join('\n');
 recordInquiry({ id: `lead-${Date.now().toString(36)}`, name: sanitize(name, 80), phone: sanitize(phone, 30), method: 'boutique', note: `${topic}: ${sanitize(message, 200)}`, cart: [], total: 0, summary: msg, createdAt: Date.now(), status: 'new' });
 window.open(waLink(msg), '_blank', 'noopener,noreferrer');
 toast({ icon: 'check', title: 'Opening WhatsApp ✦', body: 'The home confirms personally — usually within the hour.' });
 };

 return (
 <div className="relative isolate overflow-hidden">
 <img loading="lazy" src="/images/boutique.webp" alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-30" />
 <div className="absolute inset-0 -z-10 bg-gradient-to-br from-wine-950/88 via-wine-950/80 to-wine-950/55" />
 <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
 <div>
 <p className="field-label">La Boutique · Derb Moulay Charif</p>
 <h1 className="mt-2 font-display text-4xl font-semibold text-cream-50 sm:text-5xl">Visit<br /><span className="gold-text italic">the home</span></h1>
 <p className="mt-4 max-w-md font-serif text-lg italic text-cream-200/92">Reserve your visit on WhatsApp, walk in with the notebook in hand, or write to the home. The doors open Monday to Saturday, nine to eight.</p>
 <ul className="mt-8 space-y-4 text-[13px] text-cream-100/95">
 <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />{HOUSE.address}</li>
 <li className="flex items-start gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />{HOUSE.hours}</li>
 <li className="flex items-start gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" /><a href={`tel:${HOUSE.phone.replace(/\s/g, '')}`} className="transition hover:text-gold-200">{HOUSE.phone}</a></li>
 <li className="flex items-start gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" /><a href={`mailto:${HOUSE.email}`} className="transition hover:text-gold-200">{HOUSE.email}</a></li>
 </ul>
 {leadSent && (
 <p className="mt-8 flex items-center gap-2 rounded-2xl border border-[#25D366]/45 bg-[#25D366]/10 px-5 py-4 text-[12px] font-semibold text-[#7ef0ae]"><CheckCircle2 className="h-5 w-5" /> Your reservation inquiry was sent on WhatsApp — the home will confirm personally.</p>
 )}
 <div className="mt-8 flex items-center gap-3 rounded-3xl border border-gold-400/35 bg-wine-900/80 p-5 ">
 <CalendarClock className="h-8 w-8 shrink-0 text-gold-400" strokeWidth={1.5} />
 <p className="text-[11px] leading-snug text-mauve-100/90"><span className="font-bold text-cream-100">Private home rendez-vous</span> — after hours, with the nose of the home. Flacons prepared to your preferences, tea served under the jasmine.</p>
 </div>
 </div>
 {/* Form */}
 <form onSubmit={send} className="rounded-[32px] border border-gold-400/35 bg-wine-900/92 p-6 sm:p-8" noValidate>
 {leadSent ? null : null}
 <p className="flex items-center gap-2 font-display text-xl text-cream-50"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#25D366]/45 bg-[#25D366]/10"><WhatsAppIcon className="h-6 w-6" /></span> Écrire à l'Home</p>
 <div className="mt-5 grid gap-4">
 <div>
 <label htmlFor="c-name" className="field-label">Your name *</label>
 <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Salma…" className="field-input mt-1.5" />
 </div>
 <div>
 <label htmlFor="c-phone" className="field-label">Phone / WhatsApp *</label>
 <input id="c-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" maxLength={30} placeholder="+212 6 00 00 00 00" className="field-input mt-1.5" />
 </div>
 <div>
 <label htmlFor="c-topic" className="field-label">Subject</label>
 <select id="c-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="field-input mt-1.5 [&>option]:bg-wine-850">
 {['Boutique visit', 'Private rendez-vous', 'A gift to number', 'Press & collaborations', 'Something else'].map((t) => <option key={t}>{t}</option>)}
 </select>
 </div>
 <div>
 <label htmlFor="c-msg" className="field-label">Your note</label>
 <textarea id="c-msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={400} placeholder="A few words for the maison…" className="field-input mt-1.5 resize-none" />
 </div>
 </div>
 <button type="submit" className="btn-sheen m3-focus mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#10341f] transition hover:bg-[#3ef07f]">
 <WhatsAppIcon className="h-6 w-6" /> Send on WhatsApp
 </button>
 <p className="mt-3 flex items-center gap-2 text-[10px] leading-snug text-mauve-200"><ShieldCheck className="h-4 w-4 shrink-0 text-gold-400" /> Your words are carried only inside the WhatsApp link you approve — nothing is stored on a public server.</p>
 </form>
 </div>
 </div>
 );
}
