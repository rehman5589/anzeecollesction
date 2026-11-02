/* ─────────────────────────────────────────────────────────────────────
 AN'ZEE COLLECTION · Legacy — the story of the home since 1987
 ───────────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom';
import { MapPin, FlaskConical, Fingerprint, Gem, ArrowRight } from 'lucide-react';
import { ATELIER_GALLERY, HOUSE } from '../lib/data';
import { useCatalog } from '../lib/store';

export default function Legacy() {
 const catalog = useCatalog();
 const signature = catalog.find((p) => p.id === 'santal-arab') ?? catalog[0];

 return (
 <div>
 {/* ── Hero band ── */}
 <section className="relative isolate flex min-h-[62svh] items-end overflow-hidden">
 <img loading="lazy" src="/images/hero-atelier.webp" alt="Inside the AN’Zee home — copper stills at dusk in Casablanca" className="absolute inset-0 -z-10 h-full w-full object-cover" />
 <div className="absolute inset-0 -z-10 bg-gradient-to-t from-wine-950 via-wine-950/45 to-wine-950/10" />
 <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-32 sm:px-6 lg:px-8">
 <p className="field-label">Depuis {HOUSE.since} · Casablanca</p>
 <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold leading-[1.05] text-cream-50 sm:text-6xl">Three generations,<br /><span className="gold-text italic">one formula</span></h1>
 </div>
 </section>

 {/* ── Founding story ── */}
 <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
 <div>
 <p className="field-label">The Founding</p>
 <h2 className="mt-2 font-display text-3xl font-semibold text-cream-50">Founded on a blotter<br /><span className="gold-text italic">dipped at dawn</span></h2>
 <p className="mt-5 font-serif text-lg leading-relaxed text-cream-200/92">{HOUSE.foundedStory}</p>
 <Link to="/collection" className="m3-focus group mt-6 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.28em] text-gold-300 transition hover:text-gold-200">
 Discover the collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
 </Link>
 </div>
 <figure className="overflow-hidden rounded-[32px] border border-gold-400/30 ">
 <img loading="lazy" src="/images/boutique.webp" alt="The AN’Zee boutique — salon de thé and flacon library, Derb Moulay Charif" className="h-full min-h-72 w-full object-cover" />
 <figcaption className="border-t border-wine-800 bg-wine-900 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.24em] text-mauve-200">La Boutique · Derb Moulay Charif · Casablanca</figcaption>
 </figure>
 </section>

 {/* ── Ritual timeline ── */}
 <section className="border-y border-gold-400/20 bg-wine-900/70">
 <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
 <p className="field-label text-center">Le Rituel · The Making of a Flacon</p>
 <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-wine-800 sm:grid-cols-4">
 {[
 { n: '01', icon: MapPin, title: 'Sourcing', text: 'Centifolia roses of the Dades valley, neroli from Tunisian groves, Mysore sandalwood — contracted, never brokered.' },
 { n: '02', icon: FlaskConical, title: 'Composition', text: 'Weeks of maceration, one nose, one copper bench. The extrait rests six weeks before it may be numbered.' },
 { n: '03', icon: Fingerprint, title: 'Numbering', text: 'Each flacon is engraved with its own Nº and batch code — wax-sealed, signed, never printed.' },
 { n: '04', icon: Gem, title: 'The Handover', text: 'Reserved on WhatsApp, prepared by hand, collected in the boutique — or gifted in a private home rendez-vous.' },
 ].map(({ n, icon: Icon, title, text }) => (
 <div key={n} className="group bg-wine-900 p-6 transition-colors hover:bg-wine-850">
 <p className="font-display text-sm text-gold-500">{n}</p>
 <Icon className="mt-3 h-6 w-6 text-gold-400" strokeWidth={1.6} />
 <h3 className="mt-2 font-display text-lg text-cream-50">{title}</h3>
 <p className="mt-1.5 text-[11.5px] leading-relaxed text-mauve-100/85">{text}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* ── Photo gallery ── */}
 <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
 <div className="flex flex-wrap items-end justify-between gap-4">
 <div>
 <p className="field-label">L’Home · Gallery</p>
 <h2 className="mt-2 font-display text-3xl font-semibold text-cream-50">Moments from<br /><span className="gold-text italic">the home</span></h2>
 </div>
 <p className="max-w-56 text-right text-[10px] uppercase tracking-[0.2em] text-mauve-300">Photography from the home, the boutique & the harvest</p>
 </div>
 <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
 {ATELIER_GALLERY.map((item, i) => (
 <figure key={i} className="group relative overflow-hidden rounded-3xl border border-gold-400/22 ">
 <img src={item.src} alt={item.caption} loading="lazy" className="aspect-[3/4] h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108 sm:aspect-[4/5]" />
 <div className="absolute inset-0 bg-gradient-to-t from-wine-950/88 via-wine-950/15 to-transparent" />
 <figcaption className="absolute bottom-0 left-0 right-0 p-4 text-[10px] font-semibold leading-snug text-cream-100">{item.caption}</figcaption>
 </figure>
 ))}
 </div>
 </section>

 {/* ── Signature flacon callout ── */}
 <section className="relative overflow-hidden border-t border-gold-400/25">
 <img loading="lazy" src={signature.image} alt={signature.name} className="absolute inset-0 h-full w-full object-cover object-top opacity-40" />
 <div className="absolute inset-0 bg-gradient-to-r from-wine-950/95 via-wine-950/70 to-transparent" />
 <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
 <p className="field-label">The House Signature</p>
 <h2 className="mt-2 font-display text-4xl font-semibold text-cream-50">{signature.name}</h2>
 <p className="mt-1 font-serif text-xl italic text-cream-200/90">“{signature.tagline}”</p>
 <Link to={`/fragrance/${signature.id}`} className="btn-sheen m3-focus mt-6 inline-flex items-center gap-2 rounded-full bg-gold-400 py-3.5 pl-6 pr-5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-wine-950 transition hover:bg-gold-300">Meet the flacon <ArrowRight className="h-4 w-4" strokeWidth={2.4} /></Link>
 </div>
 </section>
 </div>
 );
}
