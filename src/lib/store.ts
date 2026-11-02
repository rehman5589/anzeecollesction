/* ─────────────────────────────────────────────────────────────────────
 AN'ZEE COLLECTION · Home Store (zustand + persistence)
 Cart · wishlist · inquiries(leads) · catalog overrides · admin session
 ───────────────────────────────────────────────────────────────────── */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_PERFUMES, type Perfume } from './data';
import type { Lead } from './whatsapp';

export interface Toast {
 id: number;
 icon?: string;
 title: string;
 body?: string;
}

export interface AdminRateState {
 allowed: boolean;
 remaining: number;
 retryAfterSec: number;
}

const ADMIN_SALT = 'anzee:atelier:v1:';
const ADMIN_USER = 'atelier';
const sha256Hex = async (text: string): Promise<string> => {
 const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
 return Array.from(new Uint8Array(buf))
 .map((b) => b.toString(16).padStart(2, '0'))
 .join('');
};
const timingSafeEqual = (a: string, b: string): boolean => {
 if (a.length !== b.length) return false;
 let diff = 0;
 for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
 return diff === 0;
};

/* Token-bucket style rate limiter persisted in localStorage */
const rateKey = (bucket: string) => `anzee:rl:${bucket}`;
function checkRate(bucket: string, max: number, windowMs: number): AdminRateState {
 try {
 const now = Date.now();
 const raw = localStorage.getItem(rateKey(bucket));
 const stamps: number[] = raw ? (JSON.parse(raw) as number[]).filter((t) => now - t < windowMs) : [];
 if (stamps.length >= max) {
 const retryAfterSec = Math.ceil((windowMs - (now - stamps[0])) / 1000);
 return { allowed: false, remaining: 0, retryAfterSec };
 }
 return { allowed: true, remaining: max - stamps.length, retryAfterSec: 0 };
 } catch {
 return { allowed: true, remaining: max, retryAfterSec: 0 };
 }
}
function recordAttempt(bucket: string, windowMs: number) {
 try {
 const now = Date.now();
 const raw = localStorage.getItem(rateKey(bucket));
 const stamps: number[] = raw ? (JSON.parse(raw) as number[]).filter((t) => now - t < windowMs) : [];
 stamps.push(now);
 localStorage.setItem(rateKey(bucket), JSON.stringify(stamps));
 } catch {
 /* ignore */
 }
}
function clearAttempts(bucket: string) {
 try {
 localStorage.removeItem(rateKey(bucket));
 } catch {
 /* ignore */
 }
}

async function verifyAdmin(username: string, passphrase: string): Promise<{ ok: boolean; error?: string }> {
 /* Prefer a real API when the platform provides one; fall back to the
 client-side home gate (hashed, rate-limited, constant time). */
 try {
 const res = await fetch('/api/auth/login', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ username, password: passphrase }),
 });
 if (res.status !== 404) {
 const body = (await res.json()) as { ok: boolean; error?: string };
 return { ok: !!body.ok, error: body.error };
 }
 } catch {
 /* no API — fall through to local gate */
 }
 const limit = checkRate('admin-login', 5, 5 * 60_000);
 if (!limit.allowed) {
 return { ok: false, error: `Too many attempts. The home reopens in ${limit.retryAfterSec}s.` };
 }
 const userNorm = username.trim().toLowerCase();
 const userOk = userNorm.length === ADMIN_USER.length && timingSafeEqual(userNorm, ADMIN_USER);
 const hash = await sha256Hex(ADMIN_SALT + passphrase);
 const expected = await sha256Hex(ADMIN_SALT + 'Anzee-2026');
 const passOk = timingSafeEqual(hash, expected);
 if (!userOk || !passOk) {
 recordAttempt('admin-login', 5 * 60_000);
 const after = checkRate('admin-login', 5, 5 * 60_000);
 return { ok: false, error: `Invalid credentials. ${Math.max(after.remaining, 0)} attempt(s) remaining.` };
 }
 clearAttempts('admin-login');
 return { ok: true };
}

export interface CartLineState {
 id: string;
 size: number;
 qty: number;
}

interface MaisonState {
 cart: CartLineState[];
 wishlist: string[];
 inquiries: Lead[];
 overrides: Record<string, Partial<Perfume>>;
 deletedIds: string[];
 customFragrances: Perfume[];
 adminAuthed: boolean;
 adminLoginAt: number | null;
 toasts: Toast[];

 addToCart: (id: string, size: number, qty?: number) => void;
 removeFromCart: (id: string, size: number) => void;
 setQty: (id: string, size: number, qty: number) => void;
 clearCart: () => void;
 toggleWishlist: (id: string) => void;

 recordInquiry: (lead: Lead) => void;
 setLeadStatus: (id: string, status: Lead['status']) => void;
 clearInquiries: () => void;

 upsertFragrance: (p: Perfume, isNew?: boolean) => void;
 deleteFragrance: (id: string) => void;
 resetCatalog: () => void;

 adminLogin: (username: string, passphrase: string) => Promise<{ ok: boolean; error?: string }>;
 adminLogout: () => void;

 toast: (t: Omit<Toast, 'id'>) => void;
 dismissToast: (id: number) => void;
}

let toastId = 1;

export const useMaison = create<MaisonState>()(
 persist(
 (set, get) => ({
 cart: [],
 wishlist: [],
 inquiries: [],
 overrides: {},
 deletedIds: [],
 customFragrances: [],
 adminAuthed: false,
 adminLoginAt: null,
 toasts: [],

 addToCart: (id, size, qty = 1) =>
 set((s) => {
 const existing = s.cart.find((l) => l.id === id && l.size === size);
 if (existing) {
 return { cart: s.cart.map((l) => (l.id === id && l.size === size ? { ...l, qty: Math.min(l.qty + qty, 20) } : l)) };
 }
 return { cart: [...s.cart, { id, size, qty }] };
 }),
 removeFromCart: (id, size) => set((s) => ({ cart: s.cart.filter((l) => !(l.id === id && l.size === size)) })),
 setQty: (id, size, qty) =>
 set((s) => ({
 cart: qty <= 0 ? s.cart.filter((l) => !(l.id === id && l.size === size)) : s.cart.map((l) => (l.id === id && l.size === size ? { ...l, qty: Math.min(qty, 20) } : l)),
 })),
 clearCart: () => set({ cart: [] }),
 toggleWishlist: (id) =>
 set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] })),

 recordInquiry: (lead) => set((s) => ({ inquiries: [lead, ...s.inquiries].slice(0, 120) })),
 setLeadStatus: (id, status) => set((s) => ({ inquiries: s.inquiries.map((l) => (l.id === id ? { ...l, status } : l)) })),
 clearInquiries: () => set({ inquiries: [] }),

 upsertFragrance: (p, isNew) =>
 set((s) => {
 const { id, ...rest } = p;
 if (isNew) {
 return { customFragrances: [p, ...s.customFragrances] };
 }
 if (s.customFragrances.some((c) => c.id === id)) {
 return { customFragrances: s.customFragrances.map((c) => (c.id === id ? p : c)) };
 }
 return { overrides: { ...s.overrides, [id]: { ...s.overrides[id], ...rest } } };
 }),
 deleteFragrance: (id) =>
 set((s) => {
 const isCustom = s.customFragrances.some((c) => c.id === id);
 const cart = s.cart.filter((l) => l.id !== id);
 if (isCustom) {
 return { customFragrances: s.customFragrances.filter((c) => c.id !== id), cart };
 }
 return { deletedIds: s.deletedIds.includes(id) ? s.deletedIds : [...s.deletedIds, id], cart };
 }),
 resetCatalog: () => set({ overrides: {}, deletedIds: [], customFragrances: [] }),

 adminLogin: async (username, passphrase) => verifyAdmin(username, passphrase),
 adminLogout: () => set({ adminAuthed: false, adminLoginAt: null }),

 toast: (t) => {
 const id = toastId++;
 set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }));
 window.setTimeout(() => get().dismissToast(id), 4200);
 },
 dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
 }),
 {
 name: 'anzee-collection-v1',
 partialize: (s) => ({
 cart: s.cart,
 wishlist: s.wishlist,
 inquiries: s.inquiries,
 overrides: s.overrides,
 deletedIds: s.deletedIds,
 customFragrances: s.customFragrances,
 adminAuthed: s.adminAuthed,
 adminLoginAt: s.adminLoginAt,
 }),
 },
 ),
);

/* Merged catalog: seed + admin overrides + custom flacons − deleted */
export function useCatalog(): Perfume[] {
 const overrides = useMaison((s) => s.overrides);
 const deletedIds = useMaison((s) => s.deletedIds);
 const customFragrances = useMaison((s) => s.customFragrances);
 const seeded = INITIAL_PERFUMES.filter((p) => !deletedIds.includes(p.id)).map((p) => (overrides[p.id] ? { ...p, ...overrides[p.id] } : p));
 return [...customFragrances, ...seeded];
}

/** 8h session auto-expiry check for the User Login. */
export function adminSessionValid(s: { adminAuthed: boolean; adminLoginAt: number | null }): boolean {
 if (!s.adminAuthed || !s.adminLoginAt) return false;
 return Date.now() - s.adminLoginAt < 8 * 60 * 60_000;
}
