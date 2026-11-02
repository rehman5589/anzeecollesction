import type { Perfume } from '../lib/data';
import { Flame, Crown, Sparkles, Hourglass } from 'lucide-react';

const BADGES: Array<{ when: (p: Perfume) => boolean; label: string; icon: typeof Flame; cls: string }> = [
 { when: (p) => !!p.exclusif, label: 'Exclusif', icon: Crown, cls: 'border-gold-400/60 bg-gold-400/15 text-gold-300' },
 { when: (p) => !!p.limited, label: 'Édition Limitée', icon: Hourglass, cls: 'border-gold-500/60 bg-gold-500/12 text-gold-200' },
 { when: (p) => !!p.bestSeller, label: 'Best Seller', icon: Flame, cls: 'border-mauve-400/60 bg-mauve-500/20 text-mauve-100' },
 { when: (p) => !!p.newArrivee, label: 'New Arrivée', icon: Sparkles, cls: 'border-cream-300/50 bg-cream-100/10 text-cream-100' },
];

export default function PerfumeBadge({ perfume }: { perfume: Perfume }) {
 const badge = BADGES.find((b) => b.when(perfume));
 if (!badge) return null;
 const Icon = badge.icon;
 return (
 <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.22em] ${badge.cls}`}>
 <Icon className="h-3 w-3" strokeWidth={2.2} />
 {badge.label}
 </span>
 );
}
