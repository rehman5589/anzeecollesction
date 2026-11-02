/* ─────────────────────────────────────────────────────────────────────
 AN'ZEE COLLECTION · Home
 Full-bleed sliding perfume photography hero + 3D home invitation
 ───────────────────────────────────────────────────────────────────── */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
 ArrowRight, Star, Sparkles, BadgeCheck, ChevronRight, ChevronLeft, Leaf, FlaskConical, HandHeart, Droplets, Beaker, Package, Award,
} from 'lucide-react';
import { FAMILIES, HERO_SLIDES } from '../lib/data';
import { useCatalog } from '../lib/store';
import PerfumeCard from '../components/PerfumeCard';
import WhatsAppIcon from '../components/WhatsAppIcon';


export default function Home() {
 const catalog = useCatalog();

 const [gallerySlide, setGallerySlide] = useState(0);

 const processSteps = [
 { icon: Leaf, title: 'Sourcing', text: 'Centifolia rose, neroli, Mysore sandalwood and oud are sourced from growers the Bensaïd family has known for three generations.', image: '/images/ingredients-roses.webp' },
 { icon: FlaskConical, title: 'Extraction', text: 'Petals and woods are distilled, enfleuraged or tinctured to release their absolute — the raw voice of the material.', image: '/images/hero-atelier.webp' },
 { icon: Beaker, title: 'Composition', text: 'One nose, one bench, one batch. Notes are weighed and blended by hand into a living accord.', image: '/images/maison-atelier.webp' },
 { icon: Droplets, title: 'Maceration', text: 'The blend rests six weeks in the dark so the materials can marry and become themselves.', image: '/images/hero-perfume.webp' },
 { icon: Package, title: 'Filtration & Bottling', text: 'Filtered, then hand-poured into numbered flacons, gilded, wax-sealed and certified.', image: '/images/boutique.webp' },
 { icon: Award, title: 'Numbering', text: 'Each flacon leaves with its Nº, batch code and the maison’s seal — signed, not printed.', image: '/images/atelier.webp' },
 ];

 const bestSellers = useMemo(() => catalog.filter((p) => p.bestSeller).slice(0, 4), [catalog]);




 return (
 <>
 {/* ════════════════ HERO — sliding perfume photography ════════════════ */}
 <section
 className="relative isolate flex min-h-[92svh] items-center overflow-hidden"
 style={{ willChange: 'auto', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
 aria-label="AN'Zee home photography"
 >
 {/* Static hero image (no auto-slider for performance) */}
 <img
 src={HERO_SLIDES[0].src}
 srcSet={HERO_SLIDES[0].src.replace('.webp', '-720.webp') + ' 720w, ' + HERO_SLIDES[0].src.replace('.webp', '-1920.webp') + ' 1920w'}
 sizes="100vw"
 alt={HERO_SLIDES[0].alt}
 loading="eager"
 fetchPriority="high"
 decoding="async"
 className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
 />
 {/* Cinematic vignette layers */}
 <div className="absolute inset-0 -z-10 bg-gradient-to-r from-wine-950/92 via-wine-950/58 to-wine-950/8" />
 <div className="absolute inset-0 -z-10 bg-gradient-to-t from-wine-950 via-transparent to-wine-950/55" />
 <div className="absolute inset-0 -z-10 noise" />

 {/* Copy */}
 <div className="mx-auto w-full max-w-7xl px-4 pb-28 pt-16 sm:px-6 lg:px-8">
 <div className="max-w-2xl">
 <motion.p
 initial={{ opacity: 0, y: 18 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.7, delay: 0.1 }}
 className="flex items-center gap-3 text-[9px] font-extrabold uppercase tracking-[0.4em] text-gold-300"
 >
 <span className="h-px w-10 bg-gold-400/70" /> Haute Parfumerie Artisanale · Est. 1987
 </motion.p>

 <motion.h1
 initial={{ opacity: 0, y: 26 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, delay: 0.22 }}
 className="mt-5 font-display text-[42px] font-semibold leading-[1.04] text-cream-50 sm:text-6xl lg:text-[64px]"
 >
 The Art of the <span className="gold-text italic">Numbered Flacon</span>
 </motion.h1>

 <motion.p
 initial={{ opacity: 0, y: 26 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, delay: 0.34 }}
 className="mt-6 max-w-md font-serif text-lg italic leading-snug text-cream-200/95"
 >
 Concentrated extracts composed in Casablanca — thirty years of gesture, one drop at a time. Reserve your flacon on WhatsApp; we wrap it by hand.
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 26 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, delay: 0.46 }}
 className="mt-9 flex flex-wrap items-center gap-3"
 >
 <Link to="/collection" className="btn-sheen m3-focus group inline-flex items-center gap-2 rounded-full bg-gold-400 py-3.5 pl-6 pr-5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-wine-950 transition hover:bg-gold-300">
 Explore the Collection
 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
 </Link>

 </motion.div>

 {/* Trust row */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ duration: 0.9, delay: 0.62 }}
 className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream-200/85"
 >
 <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-gold-400" /> Numbered & certified</span>
 <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-gold-400 text-gold-400" /> 4.9 · 7,400+ reviews</span>
 <span className="flex items-center gap-2"><WhatsAppIcon className="h-4 w-4" /> Reserved on WhatsApp</span>
 </motion.div>
 </div>
 </div>

 </section>

 {/* ════════════════ STATS RIBBON ════════════════ */}
 <section className="border-y border-gold-400/25 bg-wine-900">
 <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-wine-800 md:grid-cols-4">
 {[
 ['1987', 'The home was founded'],
 ['39 years', 'Of uninterrupted composition'],
 ['7', 'Signature numbered flacons'],
 ['40%', 'Peak concentration — Parfum'],
 ].map(([value, label]) => (
 <div key={label as string} className="px-3 py-6 text-center sm:px-6">
 <p className="font-display text-2xl font-semibold text-gold-300 sm:text-3xl">{value}</p>
 <p className="mt-1.5 text-[8.5px] font-bold uppercase tracking-[0.2em] text-mauve-200">{label}</p>
 </div>
 ))}
 </div>
 </section>

 {/* ════════════════ SIGNATURE FLACONS ════════════════ */}
 <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
 <div className="flex flex-wrap items-end justify-between gap-4">
 <div>
 <p className="field-label">The Best Sellers</p>
 <h2 className="mt-2 font-display text-3xl font-semibold text-cream-50 sm:text-4xl">Signatures of the <span className="gold-text italic">Home</span></h2>
 </div>
 <Link to="/collection" className="m3-focus group flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.26em] text-gold-300 transition hover:text-gold-200">
 View all {catalog.length} flacons <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
 </Link>
 </div>
 <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ contentVisibility: 'auto' }}>
 {bestSellers.map((p, i) => (
 <PerfumeCard key={p.id} perfume={p} index={i} />
 ))}
 </div>
 </section>

 {/* ════════════════ HOW A PERFUME IS MADE — sliding procedure ════════════════ */}
 <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
 <div className="flex flex-wrap items-end justify-between gap-4">
 <div>
 <p className="field-label">The Process</p>
 <h2 className="mt-2 font-display text-3xl font-semibold text-cream-50 sm:text-4xl">How a perfume is <span className="gold-text italic">made</span></h2>
 </div>
 <div className="flex items-center gap-2">
 <button onClick={() => setGallerySlide((s) => (s - 1 + processSteps.length) % processSteps.length)} aria-label="Previous step" className="m3-focus flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 bg-wine-850/90 text-gold-300 transition hover:border-gold-400 hover:text-gold-200">
 <ChevronLeft className="h-5 w-5" />
 </button>
 <button onClick={() => setGallerySlide((s) => (s + 1) % processSteps.length)} aria-label="Next step" className="m3-focus flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 bg-wine-850/90 text-gold-300 transition hover:border-gold-400 hover:text-gold-200">
 <ChevronRight className="h-5 w-5" />
 </button>
 </div>
 </div>
 <div className="relative mt-8 overflow-hidden rounded-[32px] border border-gold-400/25 bg-wine-900/60 ">
 <AnimatePresence mode="sync">
 <motion.div
 key={gallerySlide}
 initial={{ opacity: 0, x: 60 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -60 }}
 transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
 className="grid min-h-[360px] grid-cols-1 items-center gap-8 px-6 py-10 md:grid-cols-2"
 >
 <div className="overflow-hidden rounded-3xl border border-gold-400/30 ">
 <img src={processSteps[gallerySlide].image} alt={processSteps[gallerySlide].title} className="h-64 w-full object-cover object-center transition-transform duration-700 hover:scale-105" loading="lazy" />
 </div>
 <div className="flex flex-col items-start gap-4 text-left">
 {(() => {
 const StepIcon = processSteps[gallerySlide].icon;
 return <StepIcon className="h-10 w-10 text-gold-400" strokeWidth={1.4} />;
 })()}
 <p className="text-[9px] font-extrabold uppercase tracking-[0.34em] text-gold-300">Step {gallerySlide + 1} of {processSteps.length}</p>
 <h3 className="font-display text-3xl font-semibold text-cream-50">{processSteps[gallerySlide].title}</h3>
 <p className="font-serif text-lg italic leading-snug text-cream-200/90">{processSteps[gallerySlide].text}</p>
 </div>
 </motion.div>
 </AnimatePresence>
 <div className="absolute bottom-6 right-6 flex items-center gap-2" role="tablist" aria-label="Choose step">
 {processSteps.map((_, i) => (
 <button
 key={i}
 role="tab"
 aria-selected={i === gallerySlide}
 aria-label={`Step ${i + 1} of ${processSteps.length}`}
 onClick={() => setGallerySlide(i)}
 className="group py-2"
 >
 <span className={`block h-[3px] rounded-full transition-all duration-500 ${i === gallerySlide ? 'w-10 bg-gold-400' : 'w-5 bg-cream-100/35 group-hover:bg-cream-100/60'}`} />
 </button>
 ))}
 </div>
 </div>
 </section>


 {/* ════════════════ FAMILIES ════════════════ */}
 <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
 <p className="field-label text-center">Olfactory Families</p>
 <h2 className="mt-2 text-center font-display text-2xl font-semibold text-cream-50">Eight signatures, <span className="gold-text italic">one home</span></h2>
 <div className="mt-7 flex flex-wrap justify-center gap-2.5">
 {FAMILIES.map((f) => (
 <Link key={f} to={`/collection?family=${encodeURIComponent(f)}`} className="m3-focus state-layer rounded-full border border-mauve-500/40 bg-wine-850 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cream-100 transition hover:border-gold-400 hover:text-gold-200">
 {f}
 </Link>
 ))}
 </div>
 </section>

 {/* ════════════════ CRAFT TRIPTYCH ════════════════ */}
 <section className="border-t border-wine-800 bg-wine-900/60">
 <div className="mx-auto grid max-w-7xl gap-px overflow-hidden sm:grid-cols-3">
 {[
 { icon: Leaf, title: 'Grasse & Dades, sourced', text: 'Centifolia rose, neroli and Mysore sandalwood — sourced from growers the Bensaïd family has known for three generations.' },
 { icon: FlaskConical, title: 'Composed, never assembled', text: 'One nose, one bench, one batch. Every extrait rests six weeks before numbering, so the blend can become itself.' },
 { icon: HandHeart, title: 'Numbered & certified', text: 'Each flacon leaves with its Nº, its batch code and the maison’s wax seal — signed, not printed.' },
 ].map(({ icon: Icon, title, text }) => (
 <div key={title} className="group bg-wine-900 p-8 transition-colors hover:bg-wine-850">
 <Icon className="h-6 w-6 text-gold-400 transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.6} />
 <h3 className="mt-4 font-display text-lg text-cream-50">{title}</h3>
 <p className="mt-2 text-[12px] leading-relaxed text-mauve-100/85">{text}</p>
 </div>
 ))}
 </div>
 <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 border-t border-wine-800 px-4 py-6">
 <Sparkles className="h-4 w-4 text-gold-400" />
 <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mauve-100/85">Not sure where to begin?</p>
 <Link to="/quiz" className="m3-focus rounded-full border border-gold-400/55 px-5 py-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold-300 transition hover:bg-gold-400 hover:text-wine-950">Take the 60-second Discovery Quiz</Link>
 </div>
 </section>
 </>
 );
}
