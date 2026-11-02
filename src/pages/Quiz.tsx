/* ─────────────────────────────────────────────────────────────────────
 AN'ZEE COLLECTION · Fragrance Discovery Quiz
 Five questions → your signature family → your flacon → WhatsApp concierge
 ───────────────────────────────────────────────────────────────────── */

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
 Sun, Moon, CloudSun, Flame, Briefcase, Sparkles, Heart, Crown, Flower2, CakeSlice, CloudRain, Wind, Feather, Zap, Flower, Eye, MessageCircle, Volume2, Mountain,
 RotateCcw, ArrowRight, Star, ShoppingBag,
} from 'lucide-react';
import { QUIZ_QUESTIONS, scoreQuiz, formatDH, type QuizOption } from '../lib/data';
import { useCatalog, useMaison } from '../lib/store';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { buildQuizInquiry, waLink } from '../lib/whatsapp';

const ICONS: Record<string, typeof Sun> = {
 Sun, Moon, CloudSun, Flame, Briefcase, Sparkles, Heart, Crown, Flower2, CakeSlice, CloudRain, Wind, Feather, Zap, Flower, Eye, MessageCircle, Volume2, Mountain,
};

export default function Quiz() {
 const catalog = useCatalog();
 const addToCart = useMaison((s) => s.addToCart);
 const toast = useMaison((s) => s.toast);
 const navigate = useNavigate();

 const [step, setStep] = useState(0);
 const [answers, setAnswers] = useState<QuizOption[]>([]);
 const [finished, setFinished] = useState(false);

 const { winner, familyScores } = useMemo(() => scoreQuiz(answers), [answers]);
 const topPick = useMemo(() => catalog.find((p) => p.family === winner) ?? catalog[0], [catalog, winner]);
 const runnerUp = useMemo(() => catalog.find((p) => p.family !== winner && (familyScores[p.family] ?? 0) > 0) ?? catalog[1], [catalog, winner, familyScores]);

 const choose = (option: QuizOption) => {
 const next = [...answers, option];
 setAnswers(next);
 if (step + 1 < QUIZ_QUESTIONS.length) {
 setStep(step + 1);
 } else {
 setFinished(true);
 }
 };
 const restart = () => {
 setAnswers([]);
 setStep(0);
 setFinished(false);
 };

 const progress = finished ? 1 : step / QUIZ_QUESTIONS.length;
 const question = QUIZ_QUESTIONS[Math.min(step, QUIZ_QUESTIONS.length - 1)];

 return (
 <div className="relative isolate overflow-hidden">
 {/* Ambient backdrop — real roses photograph */}
 <img loading="lazy" src="/images/ingredients-roses.webp" alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" />
 <div className="absolute inset-0 -z-10 bg-gradient-to-b from-wine-950/80 via-wine-950/72 to-wine-950" />

 <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
 <p className="field-label text-center">La Découverte · 60 Seconds</p>
 <h1 className="mt-2 text-center font-display text-4xl font-semibold text-cream-50 sm:text-5xl">Which flacon<br /><span className="gold-text italic">has been waiting for you?</span></h1>
 <p className="mx-auto mt-3 max-w-md text-center font-serif text-lg italic text-mauve-100/90">Five questions, one gesture — the home reveals your signature family.</p>

 {/* Progress rail */}
 <div className="mt-8 flex items-center gap-3" aria-hidden>
 <span className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-mauve-300">{finished ? 'Complete' : `Question ${step + 1} / ${QUIZ_QUESTIONS.length}`}</span>
 <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-wine-800">
 <motion.div className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200" animate={{ width: `${progress * 100}%` }} transition={{ type: 'spring', stiffness: 90, damping: 20 }} />
 </div>
 </div>

 <AnimatePresence mode="wait">
 {!finished ? (
 <motion.fieldset
 key={question.id}
 initial={{ opacity: 0, x: 56 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -56 }}
 transition={{ duration: 0.38, ease: 'easeOut' }}
 className="mt-8"
 >
 <legend className="sr-only">{question.question}</legend>
 <p className="text-center font-serif text-2xl italic text-cream-100">{question.question}</p>
 <div className="mt-6 grid gap-3 sm:grid-cols-2">
 {question.options.map((option) => {
 const Icon = ICONS[option.icon] ?? Sparkles;
 return (
 <button
 key={option.label}
 onClick={() => choose(option)}
 className="m3-focus state-layer group flex items-center gap-4 rounded-3xl border border-gold-400/25 bg-wine-850/85 p-4 text-left transition hover:-translate-y-0.5 hover:border-gold-400 hover:"
 >
 <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold-400/40 bg-wine-900 text-gold-300 transition group-hover:bg-gold-400 group-hover:text-wine-950">
 <Icon className="h-6 w-6" strokeWidth={1.6} />
 </span>
 <span className="text-[13px] font-semibold leading-snug text-cream-100">{option.label}</span>
 </button>
 );
 })}
 </div>
 </motion.fieldset>
 ) : (
 /* ─────────── RESULT ─────────── */
 <motion.div key="result" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mt-8">
 <div className="overflow-hidden rounded-[36px] border border-gold-400/40 bg-wine-900/90 ">
 <div className="border-b border-wine-800 bg-gradient-to-r from-gold-500/15 via-transparent to-gold-500/15 px-6 py-4 text-center">
 <p className="text-[9px] font-extrabold uppercase tracking-[0.34em] text-gold-300">Your signature family</p>
 <p className="mt-1 font-display text-4xl font-semibold text-cream-50">{winner}</p>
 </div>
 <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
 <Link to={`/fragrance/${topPick.id}`} className="m3-focus group mx-auto block">
 <img loading="lazy" src={topPick.image} alt={`${topPick.name} — your recommended flacon`} className="h-72 w-48 rounded-3xl border border-gold-400/35 object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
 </Link>
 <div className="flex flex-col">
 <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-mauve-300">The home recommends</p>
 <h2 className="mt-1 font-display text-3xl font-semibold text-cream-50">{topPick.name}</h2>
 <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-mauve-200">{topPick.concentration} · {topPick.oils}% oils</p>
 <div className="mt-2 flex items-center gap-2 text-[12px] font-bold text-gold-300"><Star className="h-4 w-4 fill-gold-400 text-gold-400" />{topPick.rating.toFixed(1)} <span className="font-sans font-medium text-mauve-300">· {topPick.reviews.toLocaleString()} reviews</span></div>
 <p className="mt-3 font-serif text-base italic leading-snug text-cream-200/90">“{topPick.tagline}”</p>
 <p className="mt-2 font-display text-2xl font-semibold text-gold-300">{formatDH(topPick.price[0])} <span className="text-xs text-mauve-300">· {topPick.sizes[0]} ml</span></p>

 <div className="mt-5 flex flex-wrap gap-2">
 <button
 onClick={() => {
 addToCart(topPick.id, topPick.sizes[0], 1);
 toast({ icon: 'check', title: `${topPick.name} sealed in your bag`, body: 'Reserve on WhatsApp when you are ready.' });
 navigate('/cart');
 }}
 className="m3-focus inline-flex items-center gap-2 rounded-full bg-gold-400 py-3 pl-5 pr-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-wine-950 transition hover:bg-gold-300"
 >
 <ShoppingBag className="h-4 w-4" /> Add & Reserve
 </button>
 <a
 href={waLink(buildQuizInquiry(winner, topPick))}
 target="_blank"
 rel="noreferrer"
 className="m3-focus inline-flex items-center gap-2 rounded-full border-2 border-[#25D366] bg-[#25D366]/10 py-3 pl-4 pr-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#7ef0ae] transition hover:bg-[#25D366] hover:text-[#10341f]"
 >
 <WhatsAppIcon className="h-4 w-4" /> Book a Try-On Session
 </a>
 </div>
 <button onClick={restart} className="m3-focus mt-4 inline-flex w-fit items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.26em] text-mauve-300 transition hover:text-gold-200"><RotateCcw className="h-3.5 w-3.5" /> Retake the quiz</button>
 </div>
 </div>
 {/* Runner-up */}
 <div className="flex flex-wrap items-center justify-between gap-3 border-t border-wine-800 px-6 py-4">
 <p className="text-[10px] text-mauve-200">Also aligned with your answers — <span className="font-bold text-cream-100">{runnerUp.name}</span> ({runnerUp.family})</p>
 <Link to={`/fragrance/${runnerUp.id}`} className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.24em] text-gold-300 transition hover:text-gold-200">Discover it <ArrowRight className="h-4 w-4" /></Link>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 );
}
