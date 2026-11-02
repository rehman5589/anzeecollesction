import { ATELIER_GALLERY, HOUSE } from '../lib/data';
import { Instagram, BadgeCheck } from 'lucide-react';

export default function InstagramPage() {
 return (
 <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
 <div className="flex flex-col items-center gap-4 border-b border-wine-800 pb-8 text-center">
 <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-gold-600 via-mauve-400 to-gold-300 p-[3px]">
 <img loading="lazy" src="/images/parfum-oud-imperial.webp" alt="AN’Zee Collection — official account" className="h-full w-full rounded-full border-4 border-wine-950 object-cover object-top" />
 </span>
 <div>
 <p className="flex items-center justify-center gap-2 font-display text-2xl text-cream-50">{HOUSE.instagram}<BadgeCheck className="h-5 w-5 fill-gold-400 text-wine-950" /></p>
 <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-mauve-200">14.2K followers · Casablanca, since 1987</p>
 </div>
 <p className="max-w-md font-serif text-base italic text-cream-200/90">The notebook of the home — harvests, numberings, wax seals and the occasional midnight batch.</p>
 <a href={HOUSE.instagramUrl} target="_blank" rel="noreferrer" className="m3-focus inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 via-mauve-400 to-gold-500 bg-[length:200%_100%] px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-wine-950 transition hover:bg-[position:100%_0]">
 <Instagram className="h-5 w-5" /> Follow the home
 </a>
 </div>
 <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
 {[...ATELIER_GALLERY, ...ATELIER_GALLERY.slice(0, 3)].map((item, i) => (
 <a key={i} href={HOUSE.instagramUrl} target="_blank" rel="noreferrer" className="group relative m3-focus overflow-hidden rounded-2xl border border-gold-400/20" aria-label={`Open the maison’s Instagram — ${item.caption}`}>
 <img src={item.src} alt={item.caption} loading="lazy" className="aspect-square h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
 <div className="absolute inset-0 flex items-end bg-gradient-to-t from-wine-950/85 to-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
 <span className="flex items-center gap-1.5 text-[10px] font-semibold leading-snug text-cream-100"><Instagram className="h-3.5 w-3.5 shrink-0" />{item.caption}</span>
 </div>
 </a>
 ))}
 </div>
 </div>
 );
}
