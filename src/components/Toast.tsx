import { useMaison } from '../lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ShieldAlert, Info, X } from 'lucide-react';

const ICONS: Record<string, typeof Check> = { check: Check, shield: ShieldAlert, info: Info };

export default function Toasts() {
 const toasts = useMaison((s) => s.toasts);
 const dismiss = useMaison((s) => s.dismissToast);
 return (
 <div className="pointer-events-none fixed bottom-24 left-1/2 z-[70] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
 <AnimatePresence>
 {toasts.map((t) => {
 const Icon = (t.icon && ICONS[t.icon]) || Info;
 return (
 <motion.div
 key={t.id}
 layout
 initial={{ opacity: 0, y: 24, scale: 0.96 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, x: 48 }}
 role="status"
 className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-gold-400/35 bg-wine-850/95 p-3 "
 >
 <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-wine-900 text-gold-300">
 <Icon className="h-4 w-4" strokeWidth={2} />
 </span>
 <span className="min-w-0 flex-1">
 <span className="block text-[13px] font-semibold text-cream-50">{t.title}</span>
 {t.body && <span className="mt-0.5 block text-[11px] leading-snug text-mauve-100/85">{t.body}</span>}
 </span>
 <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="m3-focus rounded-full p-1 text-mauve-200/70 transition hover:bg-wine-800 hover:text-cream-50">
 <X className="h-4 w-4" />
 </button>
 </motion.div>
 );
 })}
 </AnimatePresence>
 </div>
 );
}
