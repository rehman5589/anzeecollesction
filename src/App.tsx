import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

const Collection = lazy(() => import('./pages/Collection'));
const FragranceDetail = lazy(() => import('./pages/FragranceDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Legacy = lazy(() => import('./pages/Heritage'));
const Contact = lazy(() => import('./pages/Contact'));
const InstagramPage = lazy(() => import('./pages/Instagram'));
const Admin = lazy(() => import('./pages/Admin'));

const PageFallback = () => (
 <div className="flex min-h-[40svh] flex-col items-center justify-center gap-3" role="status" aria-label="Loading">
 <span className="h-10 w-10 animate-spin rounded-full border-2 border-gold-400/30 border-t-gold-400" />
 <span className="text-[9px] font-extrabold uppercase tracking-[0.34em] text-gold-400">AN’Zee</span>
 </div>
);

export default function App() {
 return (
 <HashRouter>
 <Routes>
 <Route element={<Layout />}>
 <Route path="/" element={<Home />} />
 <Route path="/collection" element={<Suspense fallback={<PageFallback />}><Collection /></Suspense>} />
 <Route path="/fragrance/:id" element={<Suspense fallback={<PageFallback />}><FragranceDetail /></Suspense>} />
 <Route path="/cart" element={<Suspense fallback={<PageFallback />}><Cart /></Suspense>} />
 <Route path="/quiz" element={<Suspense fallback={<PageFallback />}><Quiz /></Suspense>} />
 <Route path="/legacy" element={<Suspense fallback={<PageFallback />}><Legacy /></Suspense>} />
 <Route path="/contact" element={<Suspense fallback={<PageFallback />}><Contact /></Suspense>} />
 <Route path="/instagram" element={<Suspense fallback={<PageFallback />}><InstagramPage /></Suspense>} />
 <Route path="/admin" element={<Suspense fallback={<PageFallback />}><Admin /></Suspense>} />
 <Route path="*" element={<Home />} />
 </Route>
 </Routes>
 </HashRouter>
 );
}
