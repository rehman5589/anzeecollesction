/* ─────────────────────────────────────────────────────────────────────
 AN'ZEE COLLECTION · User Login (Admin)
 Secure gate → dashboard KPIs · catalog CRUD · WhatsApp lead inbox
 ───────────────────────────────────────────────────────────────────── */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
 Lock, User, Eye, EyeOff, LogOut, LayoutDashboard, Package, Inbox, Settings, Trash2, Pencil, Plus, X, Search, RotateCcw, BadgeCheck, ShieldCheck, ExternalLink,
} from 'lucide-react';
import { FAMILIES, formatDH, type Perfume } from '../lib/data';
import { adminSessionValid, useCatalog, useMaison } from '../lib/store';
import WhatsAppIcon from '../components/WhatsAppIcon';

type Tab = 'overview' | 'catalog' | 'inquiries' | 'settings';
const SESSION_KEY_NOTE = 'adminAuthed + adminLoginAt persisted · auto-expiry 8h';

export default function Admin() {
 const authed = useMaison((s) => adminSessionValid(s));
 return authed ? <Dashboard /> : <Gate />;
}

/* ═══════════════ The secure gate ═══════════════ */
function Gate() {
 const login = useMaison((s) => s.adminLogin);
 const toast = useMaison((s) => s.toast);
 const [user, setUser] = useState('');
 const [pass, setPass] = useState('');
 const [show, setShow] = useState(false);
 const [error, setError] = useState('');
 const [busy, setBusy] = useState(false);

 const submit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError('');
 setBusy(true);
 const result = await login(user, pass);
 setBusy(false);
 if (!result.ok) {
 setError(result.error ?? 'Access refused.');
 toast({ icon: 'shield', title: 'Access refused', body: 'Attempt logged in the security register.' });
 return;
 }
 useMaison.setState({ adminAuthed: true, adminLoginAt: Date.now() });
 toast({ icon: 'check', title: 'Welcome, User', body: 'Session open. Auto-expires after 8 hours.' });
 };

 return (
 <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-wine-950 px-4">
 <img loading="lazy" src="/images/maison-atelier.webp" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" />
 <div className="absolute inset-0 bg-gradient-to-br from-wine-950/75 via-wine-950/60 to-wine-950" />
 <form onSubmit={submit} className="relative w-full max-w-md rounded-[32px] border border-gold-400/40 bg-wine-950/88 p-8 ">
 <span className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-gold-400/50 bg-wine-900">
 <img loading="lazy" src="/logo.webp" alt="AN’Zee Collection" className="h-full w-full object-cover" />
 </span>
 <h1 className="mt-5 text-center font-display text-3xl text-cream-50">User <span className="gold-text italic">Login</span></h1>
 <p className="mt-1 text-center text-[9px] font-bold uppercase tracking-[0.32em] text-mauve-200">Restricted access — AN’Zee Collection</p>
 <label htmlFor="adm-user" className="field-label mt-6 block">Username</label>
 <div className="relative mt-1.5">
 <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mauve-300" />
 <input id="adm-user" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" maxLength={40} placeholder="atelier" className="field-input pl-11" />
 </div>
 <label htmlFor="adm-pass" className="field-label mt-4 block">Passphrase</label>
 <div className="relative mt-1.5">
 <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mauve-300" />
 <input id="adm-pass" type={show ? 'text' : 'password'} value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" maxLength={64} placeholder="••••••••••" className="field-input pl-11 pr-12" />
 <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide passphrase' : 'Show passphrase'} className="m3-focus absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-mauve-200 transition hover:text-gold-200">
 {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
 </button>
 </div>
 {error && <p role="alert" className="mt-3 rounded-2xl border border-red-400/40 bg-red-950/40 px-4 py-2.5 text-[11px] font-semibold text-red-200">{error}</p>}
 <button type="submit" disabled={busy} className="btn-sheen m3-focus mt-6 w-full rounded-full bg-gold-400 py-4 text-[11px] font-extrabold uppercase tracking-[0.24em] text-wine-950 transition hover:bg-gold-300 disabled:opacity-60">
 {busy ? 'Verifying…' : 'Open the User Login'}
 </button>
 <p className="mt-4 text-center text-[9px] uppercase tracking-[0.2em] text-mauve-300">Hashed gate · constant-time compare · 5 attempts / 5 min · 8h auto-expiry</p>
 </form>
 </div>
 );
}

/* ═══════════════ The dashboard ═══════════════ */
const EMPTY: Perfume = {
 id: '', name: '', arabic: '', family: 'Floral', concentration: 'Extrait de Parfum', gender: 'Unisex',
 tagline: '', story: '', notes: { top: [''], heart: [''], base: [''] }, sizes: [50], price: [500], oils: 20,
 longevity: 8, projection: 7, sillage: 7, stock: 30, rating: 4.8, reviews: 0,
 colors: { glass: '#f5c8cd', liquid: '#c24b63', cap: '#d4af37', label: '#fdfaf6' },
 flacon: 'classic', image: '/images/parfum-sennour-rose.webp', createdAt: new Date().toISOString().slice(0, 10),
};

function Dashboard() {
 const catalog = useCatalog();
 const inquiries = useMaison((s) => s.inquiries);
 const setLeadStatus = useMaison((s) => s.setLeadStatus);
 const clearInquiries = useMaison((s) => s.clearInquiries);
 const logout = useMaison((s) => s.adminLogout);
 const upsert = useMaison((s) => s.upsertFragrance);
 const deleteFragrance = useMaison((s) => s.deleteFragrance);
 const resetCatalog = useMaison((s) => s.resetCatalog);
 const toast = useMaison((s) => s.toast);
 const navigate = useNavigate();

 const [tab, setTab] = useState<Tab>('overview');
 const [filter, setFilter] = useState('');
 const [editing, setEditing] = useState<Perfume | null>(null);
 const [isNew, setIsNew] = useState(false);

 const logoutAndLeave = () => { logout(); navigate('/'); };

 const kpis = useMemo(() => {
 const inventory = catalog.reduce((n, p) => n + p.stock, 0);
 const value = catalog.reduce((n, p) => n + p.stock * p.price[0], 0);
 const avgRating = catalog.length ? catalog.reduce((n, p) => n + p.rating, 0) / catalog.length : 0;
 const newLeads = inquiries.filter((l) => l.status === 'new').length;
 return { inventory, value, avgRating, newLeads, catalogSize: catalog.length };
 }, [catalog, inquiries]);

 const filtered = catalog.filter((p) => !filter.trim() || [p.name, p.arabic, p.family].join(' ').toLowerCase().includes(filter.trim().toLowerCase()));

 const TABS: Array<{ id: Tab; label: string; icon: typeof LayoutDashboard }> = [
 { id: 'overview', label: 'Overview', icon: LayoutDashboard },
 { id: 'catalog', label: 'Catalog · CRUD', icon: Package },
 { id: 'inquiries', label: 'WhatsApp Inquiries', icon: Inbox },
 { id: 'settings', label: 'Settings', icon: Settings },
 ];

 return (
 <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
 {/* Header */}
 <div className="flex flex-wrap items-center justify-between gap-4 border-b border-wine-800 pb-5">
 <div>
 <p className="field-label">User Login · Session open</p>
 <h1 className="mt-1 font-display text-3xl font-semibold text-cream-50">The Home <span className="gold-text italic">Register</span></h1>
 </div>
 <button onClick={logoutAndLeave} className="m3-focus flex items-center gap-2 rounded-full border border-mauve-500/45 px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-mauve-100 transition hover:border-gold-400 hover:text-gold-200">
 <LogOut className="h-4 w-4" /> Lock & leave
 </button>
 </div>

 {/* Tabs */}
 <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="User Login sections">
 {TABS.map(({ id: t, label, icon: Icon }) => (
 <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`m3-focus flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.2em] transition ${tab === t ? 'border-gold-400 bg-gold-400 text-wine-950' : 'border-wine-700 text-mauve-100 hover:border-gold-400/60 hover:text-gold-200'}`}>
 <Icon className="h-4 w-4" />{label}{t === 'inquiries' && kpis.newLeads > 0 && <span className={`rounded-full px-1.5 text-[9px] font-black ${tab === t ? 'bg-wine-950 text-gold-300' : 'bg-gold-400 text-wine-950'}`}>{kpis.newLeads}</span>}
 </button>
 ))}
 </div>

 {/* ── OVERVIEW ── */}
 {tab === 'overview' && (
 <div className="mt-6">
 <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
 {[
 { label: 'Flacons in home', value: String(kpis.catalogSize), sub: `${kpis.inventory} units in stock` },
 { label: 'Inventory value', value: formatDH(kpis.value), sub: 'At 50/75 ml shelf price' },
 { label: 'Average rating', value: `${kpis.avgRating.toFixed(2)} ★`, sub: 'Across the collection' },
 { label: 'New inquiries', value: String(kpis.newLeads), sub: `${inquiries.length} total reservations logged` },
 ].map((kpi) => (
 <div key={kpi.label} className="rounded-3xl border border-gold-400/25 bg-wine-900 p-5 ">
 <p className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-mauve-300">{kpi.label}</p>
 <p className="mt-2 font-display text-2xl font-semibold text-gold-300">{kpi.value}</p>
 <p className="mt-1 text-[10px] text-mauve-200">{kpi.sub}</p>
 </div>
 ))}
 </div>
 {/* Best sellers */}
 <div className="mt-6 grid gap-4 lg:grid-cols-2">
 <div className="rounded-3xl border border-wine-800 bg-wine-900 p-5">
 <p className="field-label">Flacon health · low stock first</p>
 <ul className="mt-3 divide-y divide-wine-800">
 {[...catalog].sort((a, b) => a.stock - b.stock).slice(0, 5).map((p) => (
 <li key={p.id} className="flex items-center gap-3 py-2.5">
 <img loading="lazy" src={p.image} alt={p.name} className="h-12 w-9 rounded-lg object-cover object-top" />
 <div className="min-w-0 flex-1">
 <p className="truncate text-[12px] font-semibold text-cream-100">{p.name}</p>
 <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-wine-800"><div className={`h-full rounded-full ${p.stock <= 20 ? 'bg-red-400' : 'bg-gold-400'}`} style={{ width: `${Math.min(100, (p.stock / 80) * 100)}%` }} /></div>
 </div>
 <span className={`text-[11px] font-extrabold ${p.stock <= 20 ? 'text-red-300' : 'text-mauve-100'}`}>{p.stock}</span>
 </li>
 ))}
 </ul>
 </div>
 <div className="rounded-3xl border border-wine-800 bg-wine-900 p-5">
 <p className="field-label">Latest reservations</p>
 {inquiries.length === 0 ? (
 <p className="mt-4 text-[12px] text-mauve-200">No reservations logged yet. When a guest reserves through the bag or contact page, their WhatsApp inquiry is recorded here.</p>
 ) : (
 <ul className="mt-3 divide-y divide-wine-800">
 {inquiries.slice(0, 5).map((l) => (
 <li key={l.id} className="flex items-center gap-3 py-2.5">
 <WhatsAppIcon className="h-5 w-5 shrink-0" />
 <div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-cream-100">{l.name} · {formatDH(l.total)}</p><p className="text-[9px] uppercase tracking-[0.18em] text-mauve-300">{new Date(l.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {l.status}</p></div>
 </li>
 ))}
 </ul>
 )}
 </div>
 </div>
 </div>
 )}

 {/* ── CATALOG CRUD ── */}
 {tab === 'catalog' && (
 <div className="mt-6">
 <div className="flex flex-wrap items-center gap-2">
 <div className="relative min-w-44 flex-1">
 <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mauve-300" />
 <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search the catalog…" aria-label="Search catalog" className="w-full rounded-full border border-gold-400/25 bg-wine-850 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-gold-400" />
 </div>
 <button onClick={() => { setEditing({ ...EMPTY, id: `atelier-${Date.now().toString(36)}` }); setIsNew(true); }} className="m3-focus flex items-center gap-2 rounded-full bg-gold-400 px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-wine-950 transition hover:bg-gold-300"><Plus className="h-4 w-4" /> New flacon</button>
 <button onClick={() => { resetCatalog(); toast({ icon: 'check', title: 'Catalog restored', body: 'Overrides, deletions and custom flacons cleared.' }); }} className="m3-focus flex items-center gap-2 rounded-full border border-wine-700 px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-mauve-100 transition hover:border-gold-400 hover:text-gold-200"><RotateCcw className="h-4 w-4" /> Restore</button>
 </div>
 <div className="mt-4 overflow-x-auto rounded-3xl border border-wine-800">
 <table className="w-full min-w-[760px] text-left text-[12px]">
 <thead className="bg-wine-850 text-[9px] font-extrabold uppercase tracking-[0.22em] text-gold-300">
 <tr>{['Flacon', 'Family', 'Conc.', 'Stock', 'Price', 'Rating', 'Actions'].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
 </thead>
 <tbody className="divide-y divide-wine-800 bg-wine-900">
 {filtered.map((p) => (
 <tr key={p.id} className="transition hover:bg-wine-850/60">
 <td className="px-4 py-2.5"><div className="flex items-center gap-3"><img loading="lazy" src={p.image} alt={p.name} className="h-12 w-9 rounded-lg object-cover object-top" /><div><p className="font-semibold text-cream-100">{p.name}</p><p className="text-[9px] text-mauve-300">{p.arabic}</p></div></div></td>
 <td className="px-4 py-2.5 text-mauve-100">{p.family}</td>
 <td className="px-4 py-2.5 text-mauve-100">{p.concentration}</td>
 <td className="px-4 py-2.5"><span className={p.stock <= 20 ? 'font-bold text-red-300' : 'text-mauve-100'}>{p.stock}</span></td>
 <td className="px-4 py-2.5 font-semibold text-gold-200">{formatDH(p.price[0])}</td>
 <td className="px-4 py-2.5 text-mauve-100">{p.rating.toFixed(1)} ★</td>
 <td className="px-4 py-2.5"><div className="flex items-center gap-1.5">
 <button onClick={() => { setEditing({ ...p, notes: { top: [...p.notes.top], heart: [...p.notes.heart], base: [...p.notes.base] } }); setIsNew(false); }} aria-label={`Edit ${p.name}`} className="m3-focus rounded-full p-2 text-mauve-100 transition hover:bg-wine-800 hover:text-gold-200"><Pencil className="h-4 w-4" /></button>
 <button onClick={() => { deleteFragrance(p.id); toast({ icon: 'check', title: `${p.name} removed`, body: 'The flacon left the collection.' }); }} aria-label={`Delete ${p.name}`} className="m3-focus rounded-full p-2 text-mauve-100 transition hover:bg-wine-800 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
 </div></td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ── INQUIRIES / LEAD INBOX ── */}
 {tab === 'inquiries' && (
 <div className="mt-6">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mauve-200">{inquiries.length} reservation{inquiries.length === 1 ? '' : 's'} · {kpis.newLeads} awaiting contact</p>
 {inquiries.length > 0 && <button onClick={() => { clearInquiries(); toast({ icon: 'check', title: 'Register cleared', body: 'All inquiries archived.' }); }} className="m3-focus text-[9px] font-extrabold uppercase tracking-[0.26em] text-mauve-300 transition hover:text-red-300">Clear register</button>}
 </div>
 {inquiries.length === 0 ? (
 <div className="mt-8 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-wine-700 py-16 text-center">
 <Inbox className="h-10 w-10 text-mauve-400" strokeWidth={1.4} />
 <p className="font-display text-xl text-cream-100">The register is quiet — for now</p>
 <p className="max-w-sm text-[12px] text-mauve-200">Reservation inquiries sent from the bag, the contact page or the quiz land here with a direct wa.me link to the guest.</p>
 </div>
 ) : (
 <ul className="mt-4 grid gap-4 md:grid-cols-2">
 {inquiries.map((lead) => (
 <li key={lead.id} className="rounded-3xl border border-gold-400/22 bg-wine-900 p-5 ">
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0">
 <p className="flex items-center gap-2 text-[13px] font-bold text-cream-50">{lead.name}<span className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.2em] ${lead.status === 'new' ? 'bg-gold-400 text-wine-950' : lead.status === 'contacted' ? 'border border-gold-400/50 text-gold-300' : lead.status === 'reserved' ? 'bg-[#10341f] text-[#7ef0ae]' : 'border border-wine-700 text-mauve-200'}`}>{lead.status}</span></p>
 <p className="mt-0.5 text-[10px] text-mauve-300">{new Date(lead.createdAt).toLocaleString('fr-FR')} · {lead.method === 'boutique' ? 'Boutique pickup' : `Rendez-vous${lead.date ? ` · ${lead.date}` : ''}`}</p>
 </div>
 <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${lead.name}`} className="m3-focus flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#25D366]/45 bg-[#25D366]/10 transition hover:scale-110"><WhatsAppIcon className="h-6 w-6" /></a>
 </div>
 <p className="mt-3 line-clamp-3 whitespace-pre-line rounded-2xl bg-wine-850 p-3 font-mono text-[10px] leading-relaxed text-mauve-100/90">{lead.summary}</p>
 <div className="mt-3 flex items-center justify-between gap-2">
 <p className="font-display text-lg font-semibold text-gold-300">{formatDH(lead.total)}</p>
 <div className="flex gap-1.5">
 {(['new', 'contacted', 'reserved', 'closed'] as const).map((st) => (
 <button key={st} onClick={() => setLeadStatus(lead.id, st)} className={`m3-focus rounded-full border px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.16em] transition ${lead.status === st ? 'border-gold-400 bg-gold-400 text-wine-950' : 'border-wine-700 text-mauve-200 hover:text-gold-200'}`}>{st}</button>
 ))}
 </div>
 </div>
 </li>
 ))}
 </ul>
 )}
 </div>
 )}

 {/* ── SETTINGS ── */}
 {tab === 'settings' && (
 <div className="mt-6 grid gap-4 md:grid-cols-2">
 <div className="rounded-3xl border border-wine-800 bg-wine-900 p-6">
 <p className="field-label flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Security model</p>
 <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-mauve-100/90">
 <li>· Passphrase verified against a SHA-256 hash with a constant-time comparator — the secret itself is never stored.</li>
 <li>· Token-bucket rate limit: 5 attempts per 5 minutes per browser, with exponential courtesy backoff.</li>
 <li>· {SESSION_KEY_NOTE}.</li>
 <li>· Catalog mutations stay on this device (localStorage) — clear with “Restore” in the Catalog tab.</li>
 </ul>
 </div>
 <div className="rounded-3xl border border-wine-800 bg-wine-900 p-6">
 <p className="field-label">Home facts</p>
 <ul className="mt-3 space-y-2 text-[12px] text-mauve-100/90">
 <li className="flex justify-between gap-4"><span>Founded</span><span className="text-cream-100">1987 · Casablanca</span></li>
 <li className="flex justify-between gap-4"><span>Concentration range</span><span className="text-cream-100">18% – 40% oils</span></li>
 <li className="flex justify-between gap-4"><span>Checkout model</span><span className="text-cream-100">WhatsApp inquiry only — no online payment</span></li>
 <li className="flex justify-between gap-4"><span>Fulfilment</span><span className="text-cream-100">Boutique pickup · private rendez-vous</span></li>
 <li className="flex justify-between gap-4"><span>Certificates</span><span className="text-cream-100"><BadgeCheck className="mr-1 inline h-4 w-4 text-gold-400" />Wax seal + engraved Nº</span></li>
 </ul>
 <a href="https://anzee.collection" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-gold-300 transition hover:text-gold-200">anzee.collection <ExternalLink className="h-4 w-4" /></a>
 </div>
 </div>
 )}

 {/* ── EDIT MODAL ── */}
 {editing && <EditModal initial={editing} isNew={isNew} onClose={() => setEditing(null)} onSave={(p) => { upsert(p, isNew); setEditing(null); toast({ icon: 'check', title: isNew ? 'Flacon created' : `${p.name} updated`, body: 'The collection has been renumbered.' }) }} />}
 </div>
 );
}

/* ═══════════════ Flacon editor modal ═══════════════ */
function EditModal({ initial, isNew, onClose, onSave }: { initial: Perfume; isNew: boolean; onClose: () => void; onSave: (p: Perfume) => void }) {
 const [p, setP] = useState<Perfume>(initial);
 useEffect(() => {
 const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
 window.addEventListener('keydown', onKey);
 return () => window.removeEventListener('keydown', onKey);
 }, [onClose]);
 const set = (patch: Partial<Perfume>) => setP((prev) => ({ ...prev, ...patch }));
 const setNote = (act: 'top' | 'heart' | 'base', idx: number, value: string) =>
 setP((prev) => ({ ...prev, notes: { ...prev.notes, [act]: prev.notes[act].map((n, i) => (i === idx ? value : n)) } }));

 return (
 <div className="fixed inset-0 z-[80] flex items-end justify-center bg-wine-950/78 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={isNew ? 'Create flacon' : `Edit ${initial.name}`} onClick={onClose}>
 <div className="max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-[32px] border border-gold-400/40 bg-wine-900 p-6 sm:rounded-[32px]" onClick={(e) => e.stopPropagation()}>
 <div className="flex items-center justify-between">
 <p className="font-display text-2xl text-cream-50">{isNew ? 'A new flacon' : `Refine ${initial.name}`}</p>
 <button onClick={onClose} aria-label="Close editor" className="m3-focus rounded-full p-2 text-mauve-100 transition hover:bg-wine-800"><X className="h-5 w-5" /></button>
 </div>
 <div className="mt-5 grid gap-4 sm:grid-cols-2">
 <div className="sm:col-span-2 flex items-center gap-4">
 <img loading="lazy" src={p.image} alt={p.name || 'New flacon'} className="h-24 w-20 rounded-2xl border border-gold-400/30 object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).src = '/images/parfum-sennour-rose.webp'; }} />
 <div className="flex-1">
 <label htmlFor="ed-img" className="field-label">Image path</label>
 <input id="ed-img" value={p.image} onChange={(e) => set({ image: e.target.value })} className="field-input mt-1.5 font-mono text-[11px]" placeholder="/images/parfum-….webp" />
 </div>
 </div>
 <div><label htmlFor="ed-name" className="field-label">Name</label><input id="ed-name" value={p.name} onChange={(e) => set({ name: e.target.value })} className="field-input mt-1.5" /></div>
 <div><label htmlFor="ed-arabic" className="field-label">Arabic</label><input id="ed-arabic" value={p.arabic} onChange={(e) => set({ arabic: e.target.value })} className="field-input mt-1.5" dir="auto" /></div>
 <div><label htmlFor="ed-family" className="field-label">Family</label><select id="ed-family" value={p.family} onChange={(e) => set({ family: e.target.value })} className="field-input mt-1.5 [&>option]:bg-wine-850">{FAMILIES.map((f) => <option key={f}>{f}</option>)}</select></div>
 <div><label htmlFor="ed-conc" className="field-label">Concentration</label><select id="ed-conc" value={p.concentration} onChange={(e) => set({ concentration: e.target.value as Perfume['concentration'] })} className="field-input mt-1.5 [&>option]:bg-wine-850">{['Parfum', 'Extrait de Parfum', 'Eau de Parfum'].map((c) => <option key={c}>{c}</option>)}</select></div>
 <div><label htmlFor="ed-gender" className="field-label">Gender</label><select id="ed-gender" value={p.gender} onChange={(e) => set({ gender: e.target.value as Perfume['gender'] })} className="field-input mt-1.5 [&>option]:bg-wine-850">{['Women', 'Men', 'Unisex'].map((g) => <option key={g}>{g}</option>)}</select></div>
 <div><label htmlFor="ed-oils" className="field-label">Oils %</label><input id="ed-oils" type="number" min={5} max={50} value={p.oils} onChange={(e) => set({ oils: Number(e.target.value) })} className="field-input mt-1.5" /></div>
 <div className="sm:col-span-2"><label htmlFor="ed-tag" className="field-label">Tagline</label><input id="ed-tag" value={p.tagline} onChange={(e) => set({ tagline: e.target.value })} className="field-input mt-1.5" /></div>
 <div className="sm:col-span-2"><label htmlFor="ed-story" className="field-label">Story</label><textarea id="ed-story" rows={2} value={p.story} onChange={(e) => set({ story: e.target.value })} className="field-input mt-1.5 resize-none" /></div>
 {(['top', 'heart', 'base'] as const).map((act) => (
 <fieldset key={act} className="rounded-2xl border border-wine-800 p-3">
 <legend className="px-2 text-[8px] font-extrabold uppercase tracking-[0.26em] text-gold-300">{act} notes</legend>
 {p.notes[act].map((n, i) => <input key={i} value={n} onChange={(e) => setNote(act, i, e.target.value)} aria-label={`${act} note ${i + 1}`} className="field-input mb-1.5 text-[11px]" />)}
 </fieldset>
 ))}
 <div><label htmlFor="ed-stock" className="field-label">Stock</label><input id="ed-stock" type="number" min={0} value={p.stock} onChange={(e) => set({ stock: Number(e.target.value) })} className="field-input mt-1.5" /></div>
 <div><label htmlFor="ed-price" className="field-label">Price (DH · 50/75 ml)</label><input id="ed-price" type="number" min={0} value={p.price[0]} onChange={(e) => set({ price: [Number(e.target.value), ...p.price.slice(1)] })} className="field-input mt-1.5" /></div>
 <div><label htmlFor="ed-size2" className="field-label">Second size (ml)</label><input id="ed-size2" type="number" min={0} value={p.sizes[1] ?? ''} onChange={(e) => { const v = Number(e.target.value); set(v > 0 ? { sizes: [p.sizes[0], v], price: [p.price[0], p.price[1] ?? 0] } : { sizes: [p.sizes[0]], price: [p.price[0]] }); }} className="field-input mt-1.5" placeholder="optional" /></div>
 <div><label htmlFor="ed-price2" className="field-label">Second size price</label><input id="ed-price2" type="number" min={0} value={p.price[1] ?? ''} onChange={(e) => set({ price: [p.price[0], Number(e.target.value)] })} className="field-input mt-1.5" placeholder="optional" /></div>
 <div><label htmlFor="ed-rating" className="field-label">Rating</label><input id="ed-rating" type="number" step="0.1" min={0} max={5} value={p.rating} onChange={(e) => set({ rating: Number(e.target.value) })} className="field-input mt-1.5" /></div>
 <div><label htmlFor="ed-reviews" className="field-label">Reviews</label><input id="ed-reviews" type="number" min={0} value={p.reviews} onChange={(e) => set({ reviews: Number(e.target.value) })} className="field-input mt-1.5" /></div>
 </div>
 <div className="mt-6 flex justify-end gap-2">
 <button onClick={onClose} className="m3-focus rounded-full border border-wine-700 px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-mauve-100 transition hover:border-gold-400 hover:text-gold-200">Cancel</button>
 <button onClick={() => onSave({ ...p, notes: { top: p.notes.top.filter(Boolean), heart: p.notes.heart.filter(Boolean), base: p.notes.base.filter(Boolean) } })} className="btn-sheen m3-focus rounded-full bg-gold-400 px-7 py-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-wine-950 transition hover:bg-gold-300">Seal the flacon</button>
 </div>
 </div>
 </div>
 );
}
