import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { CATEGORIES } from '@/data/categories';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { WantedCard } from '@/components/wanted/WantedCard';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  ArrowRight,
  Gift,
  ShieldCheck,
  Leaf,
  Repeat,
  HeartHandshake,
  CheckCircle,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { listings, wantedPosts, transactions } = useStore();
  const navigate = useNavigate();

  const trendingListings = listings.filter((l) => l.isFeatured || l.status === 'active').slice(0, 4);
  const recentWanted = wantedPosts.slice(0, 3);

  // Demo stats
  const totalItemsReused = 124 + transactions.filter((t) => t.status === 'completed').length;
  const estimatedSavings = 3840 + (totalItemsReused * 25);
  const itemsDonated = 48 + listings.filter((l) => l.exchangeType === 'donate').length;
  const wasteAvoidedKg = Math.round(totalItemsReused * 3.2);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* =========================================================================
          1. HERO SECTION — EDITORIAL ASYMMETRIC LAUNCHPAD
      ========================================================================= */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Bold Editorial Typography & Vision */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10">
            {/* Campus Circular Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest text-lime text-xs font-bold uppercase tracking-wider shadow-subtle"
            >
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              <span>THE CAMPUS CIRCULAR MARKETPLACE</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-editorial text-5xl sm:text-6xl md:text-7xl font-bold text-forest-dark tracking-tight leading-[1.05]"
            >
              Good things <br />
              deserve a <br />
              <span className="italic font-normal text-forest underline decoration-lime decoration-8 underline-offset-8">
                second life.
              </span>
            </motion.h1>

            {/* Supporting Prose */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-charcoal-muted max-w-xl leading-relaxed"
            >
              Find what you need. Pass on what you don’t. A better way to exchange textbooks,
              electronics, lab gear, and dorm essentials with your campus community.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link to="/marketplace">
                <Button
                  variant="lime"
                  size="lg"
                  className="shadow-subtle hover:shadow-lime-glow text-base px-7"
                  rightIcon={<ArrowRight className="w-5 h-5 text-forest-dark" />}
                >
                  Explore the marketplace
                </Button>
              </Link>

              <Link to="/sell?mode=donate">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/80 hover:bg-white text-base px-6 border-ivory-border"
                  leftIcon={<Gift className="w-5 h-5 text-forest" />}
                >
                  Give something away
                </Button>
              </Link>
            </motion.div>

            {/* Trust highlights below CTAs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 pt-4 text-xs text-charcoal-muted border-t border-ivory-border/70"
            >
              <span className="flex items-center gap-1.5 font-medium text-forest-dark">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Student ID verified</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium text-forest-dark">
                <MapPin className="w-4 h-4 text-forest" />
                <span>Safe campus pickup points</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium text-forest-dark">
                <Leaf className="w-4 h-4 text-forest" />
                <span>Zero packaging waste</span>
              </span>
            </motion.div>
          </div>

          {/* Right Column: Dynamic Floating Composition */}
          <div className="lg:col-span-5 relative">
            {/* Background decorative blob */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-lime/20 via-sage/30 to-forest/10 rounded-[3rem] blur-2xl -z-10" />

            <div className="relative space-y-4">
              {/* Featured Hero Card 1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-5 border border-ivory-border shadow-lifted relative overflow-hidden"
              >
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 relative bg-ivory-soft">
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                    alt="Engineering Mathematics Textbook"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-forest text-lime text-xs font-bold px-2.5 py-1 rounded-full">
                    For Sale • Like New
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-forest-dark text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
                    Save $92 vs Bookstore
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-charcoal-muted uppercase">
                      Textbooks & Notes
                    </span>
                    <h3 className="font-editorial text-lg font-bold text-forest-dark">
                      Advanced Engineering Math (10th Ed)
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-editorial text-2xl font-bold text-forest-dark">$38</span>
                    <span className="block text-[11px] text-charcoal-muted line-through">$130</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-ivory-border flex items-center justify-between text-xs text-charcoal-muted">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>Maya Lin (Senior)</span>
                  </div>
                  <span>📍 Main Campus Library</span>
                </div>
              </motion.div>

              {/* Floating Pill Overlay Card 2 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="sm:-ml-8 bg-forest-dark text-ivory p-4 rounded-2xl shadow-lifted border border-forest-surface flex items-center gap-3 max-w-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-lime text-forest-dark flex items-center justify-center font-bold text-lg shrink-0">
                  🎁
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    Free 100% Cotton Lab Coat + Goggles
                  </p>
                  <p className="text-[11px] text-lime">Claimed within 18 minutes by a freshman</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. BROWSE BY CATEGORY — EDITORIAL TILES
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
              Curated by Campus Life
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-forest-dark mt-1">
              Explore by category
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="text-sm font-semibold text-forest hover:text-forest-dark flex items-center gap-1 group"
          >
            <span>View all items</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/marketplace?category=${cat.id}`}
              className="group p-5 sm:p-6 rounded-3xl bg-white border border-ivory-border hover:border-forest/40 hover:bg-ivory-soft transition-all duration-300 shadow-card hover:shadow-lifted flex flex-col justify-between min-h-[160px]"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-forest bg-forest/5 px-2.5 py-1 rounded-full group-hover:bg-lime group-hover:text-forest-dark transition-colors">
                  {cat.badgeCount || 15}+ items
                </span>
                <ArrowRight className="w-4 h-4 text-charcoal-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>

              <div>
                <h3 className="font-editorial text-lg sm:text-xl font-bold text-forest-dark group-hover:text-forest transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-charcoal-muted line-clamp-2 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          3. TRENDING FINDS
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest mb-1">
              <TrendingUp className="w-4 h-4 text-forest" />
              <span>Campus Buzz</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-forest-dark">
              Trending finds nearby
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="text-sm font-semibold text-forest hover:text-forest-dark flex items-center gap-1 group"
          >
            <span>See marketplace grid</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingListings.map((item) => (
            <ProductCard key={item.id} listing={item} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. HOW REUSEU WORKS — 3 STEP CAMPUS CYCLE
      ========================================================================= */}
      <section className="bg-forest-dark text-ivory py-20 my-12 rounded-[2.5rem] sm:rounded-[3.5rem] mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-lime uppercase tracking-widest">
              Simple, Local, Circular
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-white">
              How ReUseU works
            </h2>
            <p className="text-sm sm:text-base text-sage leading-relaxed">
              Exchanging items with peers doesn’t need couriers, high shipping fees, or strangers
              from outside campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
            {[
              {
                step: '01',
                title: 'Find something useful',
                desc: 'Browse textbook editions, electronics, drafters, or free move-out bundles listed by fellow students in your quad.',
                icon: <Sparkles className="w-6 h-6 text-lime" />,
              },
              {
                step: '02',
                title: 'Connect with a student',
                desc: 'Chat directly, make a reasonable offer, request to borrow, or propose a campus swap in real time.',
                icon: <HeartHandshake className="w-6 h-6 text-lime" />,
              },
              {
                step: '03',
                title: 'Exchange on campus',
                desc: 'Meet at monitored, well-lit campus landmarks like the Main Library or Student Activity Centre. Zero packaging, zero delay.',
                icon: <Repeat className="w-6 h-6 text-lime" />,
              },
            ].map((card) => (
              <div
                key={card.step}
                className="bg-forest/60 border border-forest-surface p-8 rounded-3xl space-y-4 hover:border-lime/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-forest-surface flex items-center justify-center">
                    {card.icon}
                  </div>
                  <span className="font-editorial text-3xl font-bold text-lime/40">
                    {card.step}
                  </span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-white">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-sage leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link to="/sell">
              <Button variant="lime" size="lg">
                Start by Listing an Item
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. THE WANTED BOARD HIGHLIGHT
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
              Community Requests
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-forest-dark mt-1">
              The Campus Wanted Board
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Have something sitting in your dorm? Help a student looking for it today.
            </p>
          </div>
          <Link
            to="/wanted"
            className="text-sm font-semibold text-forest hover:text-forest-dark flex items-center gap-1 group"
          >
            <span>Explore all requests</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentWanted.map((post) => (
            <WantedCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. SUSTAINABILITY IMPACT METRICS
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl sm:rounded-[3rem] p-8 sm:p-14 border border-ivory-border shadow-lifted">
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-forest bg-forest/5 px-2.5 py-1 rounded-full">
              Transparent Campus Impact
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-forest-dark">
              Small student habits. Massive campus change.
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              Every textbook passed forward, every bike exchanged, and every lab coat gifted
              diverts usable resources from dorm move-out dumpsters.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-ivory-soft border border-ivory-border space-y-1">
              <span className="font-editorial text-4xl sm:text-5xl font-bold text-forest-dark">
                {totalItemsReused}
              </span>
              <p className="text-xs font-bold text-forest uppercase tracking-wider">
                Items Reused
              </p>
              <p className="text-[11px] text-charcoal-muted">Passed between students</p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-soft border border-ivory-border space-y-1">
              <span className="font-editorial text-4xl sm:text-5xl font-bold text-forest-dark">
                ${estimatedSavings.toLocaleString()}
              </span>
              <p className="text-xs font-bold text-forest uppercase tracking-wider">
                Student Savings
              </p>
              <p className="text-[11px] text-charcoal-muted">Compared to retail retail</p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-soft border border-ivory-border space-y-1">
              <span className="font-editorial text-4xl sm:text-5xl font-bold text-forest-dark">
                {itemsDonated}
              </span>
              <p className="text-xs font-bold text-forest uppercase tracking-wider">
                Items Donated
              </p>
              <p className="text-[11px] text-charcoal-muted">$0 campus giveaways</p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-soft border border-ivory-border space-y-1">
              <span className="font-editorial text-4xl sm:text-5xl font-bold text-forest-dark">
                {wasteAvoidedKg} kg
              </span>
              <p className="text-xs font-bold text-forest uppercase tracking-wider">
                Waste Avoided
              </p>
              <p className="text-[11px] text-charcoal-muted">Estimated diversion model</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-ivory-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-charcoal-muted">
            <p>
              * Metrics generated dynamically based on active listings and completed campus
              exchanges. Transparent methodology documented on our Impact page.
            </p>
            <Link
              to="/impact"
              className="text-forest font-semibold hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View full impact dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. COMMUNITY SECTION
      ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-forest-dark max-w-2xl mx-auto leading-tight">
          “Your campus has everything. Sometimes, it just needs to find you.”
        </h2>
        <p className="text-sm sm:text-base text-charcoal-muted max-w-lg mx-auto">
          Join thousands of peers making everyday student life affordable, sustainable, and
          connected.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link to="/marketplace">
            <Button variant="primary" size="lg">
              Explore All Listings
            </Button>
          </Link>
          <Link to="/sell">
            <Button variant="secondary" size="lg">
              List an Item Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
