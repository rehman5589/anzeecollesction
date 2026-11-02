/* ─────────────────────────────────────────────────────────────────────
 AN'ZEE COLLECTION · WhatsApp Concierge & Lead Generation
 No online payment · boutique pickup & private appointments only
 ───────────────────────────────────────────────────────────────────── */

import { HOUSE, formatDH, priceForSize, type Perfume } from './data';

/* Client-side sanitization before anything touches a wa.me link */
export const sanitize = (s: string, max = 280): string => {
 let out = '';
 for (let i = 0; i < s.length; i++) {
 const code = s.charCodeAt(i);
 out += (code < 32 || code === 127) ? ' ' : s[i];
 }
 return out.replace(/[<>]/g, '').trim().slice(0, max);
};

/* ── Token-bucket rate limiter (client-side courtesy guard) ───────── */
const RL_KEY = (bucket: string) => `anzee:rl:${bucket}`;

export function rateLimit(bucket: string, max: number, windowMs: number) {
 try {
 const now = Date.now();
 const raw = localStorage.getItem(RL_KEY(bucket));
 const stamps: number[] = raw ? (JSON.parse(raw) as number[]).filter((t) => now - t < windowMs) : [];
 if (stamps.length >= max) {
 const retryAfterSec = Math.ceil((windowMs - (now - stamps[0])) / 1000);
 localStorage.setItem(RL_KEY(bucket), JSON.stringify(stamps));
 return { allowed: false, remaining: 0, retryAfterSec };
 }
 stamps.push(now);
 localStorage.setItem(RL_KEY(bucket), JSON.stringify(stamps));
 return { allowed: true, remaining: max - stamps.length, retryAfterSec: 0 };
 } catch {
 return { allowed: true, remaining: max, retryAfterSec: 0 };
 }
}
export const resetRateLimit = (bucket: string) => {
 try {
 localStorage.removeItem(RL_KEY(bucket));
 } catch {
 /* private mode */
 }
};

/* ── Cart-aware inquiry message builder ───────────────────────────── */
export interface CartLine {
 id: string;
 size: number;
 qty: number;
}

export interface InquiryDetails {
 name: string;
 phone: string;
 method: 'boutique' | 'rendezvous';
 date?: string;
 note?: string;
}

export function buildInquiryMessage(details: InquiryDetails, cart: CartLine[], catalog: Perfume[]): string {
 const lines = cart
 .map((line) => {
 const p = catalog.find((x) => x.id === line.id);
 if (!p) return null;
 const unit = priceForSize(p, line.size);
 return `• ${p.name} (${p.concentration}) — ${line.size} ml × ${line.qty} = ${formatDH(unit * line.qty)}`;
 })
 .filter(Boolean)
 .join('\n');

 const total = cart.reduce((sum, line) => {
 const p = catalog.find((x) => x.id === line.id);
 return p ? sum + priceForSize(p, line.size) * line.qty : sum;
 }, 0);

 const method =
 details.method === 'boutique'
 ? 'Boutique pickup (Derb Moulay Charif, Casablanca)'
 : `Private appointment with the Home${details.date ? ` — ${details.date}` : ''}`;

 return [
 'Hello AN’Zee Collection 🌹',
 '',
 'I would love to reserve the following fragrances:',
 lines,
 '',
 `Estimated total: ${formatDH(total)}`,
 `Pickup: ${method}`,
 '',
 `Name: ${sanitize(details.name, 80)}`,
 `Phone: ${sanitize(details.phone, 30)}`,
 details.note ? `Note: ${sanitize(details.note, 200)}` : null,
 '',
 'Please confirm availability. — sent from anzee-collection.ma',
 ]
 .filter((l) => l !== null)
 .join('\n');
}

export const waLink = (message: string, number: string = HOUSE.whatsappNumber): string =>
 `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

/* ── Single-product inquiry (from detail / 3D viewer) ─────────────── */
export function buildProductInquiry(p: Perfume, size: number, customer: { name?: string; note?: string } = {}): string {
 const unit = priceForSize(p, size);
 return [
 '✨ AN’ZEE COLLECTION — Boutique Inquiry',
 '',
 `Selected creation: ${p.name}`,
 `Concentration: ${p.concentration}`,
 `Size: ${size} ml — ${formatDH(unit)}`,
 `Family: ${p.family}`,
 '',
 `Name: ${sanitize(customer.name ?? '', 80) || '—'}`,
 customer.note ? `Note: ${sanitize(customer.note, 200)}` : null,
 '',
 'I would like to reserve this flacon for boutique pickup. Please confirm availability.',
 ]
 .filter((l) => l !== null)
 .join('\n');
}

/* ── Quiz result inquiry ──────────────────────────────────────────── */
export function buildQuizInquiry(winner: string, topPick: Perfume): string {
 return [
 '✦ AN’ZEE COLLECTION — Fragrance Quiz Result',
 '',
 `My quiz signature family: ${winner}`,
 `Recommended creation: ${topPick.name} (${topPick.concentration})`,
 '',
 'I would love to book a private olfactory session at the boutique to try it.',
 ].join('\n');
}

/* ── Lead capture (stored locally + optionally relayed to the API) ── */
export interface Lead {
 id: string;
 name: string;
 phone: string;
 method: 'boutique' | 'rendezvous';
 date?: string;
 note?: string;
 cart: CartLine[];
 total: number;
 summary: string;
 createdAt: number;
 status: 'new' | 'contacted' | 'reserved' | 'closed';
}

export function computeTotal(cart: CartLine[], catalog: Perfume[]): number {
 return cart.reduce((sum, line) => {
 const p = catalog.find((x) => x.id === line.id);
 return p ? sum + priceForSize(p, line.size) * line.qty : sum;
 }, 0);
}

/** Fire-and-forget lead relay; always resolves ok when offline/no API. */
export async function submitLead(lead: Lead): Promise<{ ok: boolean; error?: string; id?: string }> {
 try {
 const res = await fetch('/api/inquiries', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(lead),
 });
 if (res.status === 404) return { ok: true, id: lead.id };
 const body = (await res.json()) as { ok: boolean; error?: string; id?: string };
 return body;
 } catch {
 return { ok: true, id: lead.id };
 }
}
