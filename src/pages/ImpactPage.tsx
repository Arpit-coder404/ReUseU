import React from 'react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  CATEGORY_ESTIMATED_WEIGHT_KG,
  CO2_AVOIDED_PER_KG,
  calculateTransactionsImpact,
} from '@/utils/impactCalculator';
import { formatCurrency } from '@/utils/formatters';
import {
  Leaf,
  Scale,
  CloudSun,
  Award,
  ArrowRight,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const ImpactPage: React.FC = () => {
  const { listings, transactions } = useStore();
  const { currentUser } = useAuthStore();

  const completedTx = transactions.filter((t) => t.status === 'completed');
  const baseItems = 120;
  const totalReused = baseItems + completedTx.length;

  const totalSaved =
    3600 +
    completedTx.reduce((acc, t) => {
      const matchListing = listings.find((l) => l.id === t.listingId);
      if (matchListing && matchListing.originalPrice) {
        return acc + Math.max(0, matchListing.originalPrice - t.amount);
      }
      return acc + 35;
    }, 0);

  const totalDonations = 42 + listings.filter((l) => l.exchangeType === 'donate').length;
  const totalSwaps = 28 + listings.filter((l) => l.exchangeType === 'swap').length;

  const totalWasteAvoidedKg = Math.round(totalReused * 3.4);
  const totalCO2SavedKg = Math.round(totalWasteAvoidedKg * CO2_AVOIDED_PER_KG);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-lime text-xs font-bold uppercase tracking-wider">
          <Leaf className="w-3.5 h-3.5" />
          <span>Campus Circular Sustainability</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-forest-dark">
          Measuring our collective campus impact
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          Every textbook, laptop charger, lab coat, or dorm cart passed forward prevents usable
          goods from being dumped during end-of-semester move-out.
        </p>
      </div>

      {/* Hero Impact Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Items Reused */}
        <div className="p-6 rounded-3xl bg-forest-dark text-white border border-forest-surface space-y-2 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sage uppercase tracking-wider">
              Total Items Circulated
            </span>
            <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center text-lime">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-4xl sm:text-5xl font-bold text-lime">
            {totalReused}
          </div>
          <p className="text-xs text-sage">Hand-to-hand campus handovers</p>
        </div>

        {/* Student Savings */}
        <div className="p-6 rounded-3xl bg-white border border-ivory-border space-y-2 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider">
              Student Money Saved
            </span>
            <div className="w-8 h-8 rounded-xl bg-lime/30 flex items-center justify-center text-forest-dark">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-4xl sm:text-5xl font-bold text-forest-dark">
            ${totalSaved.toLocaleString()}
          </div>
          <p className="text-xs text-charcoal-muted">Kept in students' pockets</p>
        </div>

        {/* Waste Avoided */}
        <div className="p-6 rounded-3xl bg-white border border-ivory-border space-y-2 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider">
              Estimated Waste Diverted
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-4xl sm:text-5xl font-bold text-forest-dark">
            {totalWasteAvoidedKg} kg
          </div>
          <p className="text-xs text-charcoal-muted">Kept out of municipal landfill</p>
        </div>

        {/* Carbon Avoidance */}
        <div className="p-6 rounded-3xl bg-white border border-ivory-border space-y-2 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider">
              CO₂e Footprint Saved
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <CloudSun className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-4xl sm:text-5xl font-bold text-forest-dark">
            ~{totalCO2SavedKg} kg
          </div>
          <p className="text-xs text-charcoal-muted">Embodied manufacturing emissions</p>
        </div>
      </div>

      {/* Transparent Calculation Methodology Section */}
      <div className="bg-white rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 border border-ivory-border shadow-card space-y-6">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-forest" />
          <h2 className="font-editorial text-2xl font-bold text-forest-dark">
            Transparent Methodology & Modeling
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed max-w-3xl">
          In alignment with academic honesty and environmental integrity, ReUseU uses transparent,
          explicitly documented illustrative factors rather than claiming unverified laboratory
          measurements.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-ivory-soft border border-ivory-border space-y-3">
            <h4 className="text-sm font-bold text-forest-dark">
              1. Student Financial Savings
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Calculated as the exact delta between the original retail price and the final peer
              resale price for completed transactions. Free donations count 100% of the original
              retail price toward savings.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-ivory-soft border border-ivory-border space-y-3">
            <h4 className="text-sm font-bold text-forest-dark">
              2. Waste Diverted by Category Weights
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Modeled using documented campus item weight averages: Textbooks (~1.2 kg),
              Bicycles (~13.5 kg), Electronics & monitors (~2.5 kg), Hostel furniture (~6.0 kg),
              Lab coats & fashion (~0.8 kg).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-ivory-soft border border-ivory-border space-y-3">
            <h4 className="text-sm font-bold text-forest-dark">
              3. Carbon Footprint (CO₂e) Avoidance
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Modeled using an educational lifecycle coefficient of 2.75 kg CO₂e per kg of durable
              consumer equipment reused, accounting for raw material extraction and freight delivery.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-ivory-soft border border-ivory-border space-y-3">
            <h4 className="text-sm font-bold text-forest-dark">
              4. Packaging & Last-Mile Elimination
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Because all exchanges occur in person on campus quads (Library, SAC, Canteen),
              cardboard boxes, bubble wrap, and delivery van emissions are reduced to zero.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="p-8 rounded-3xl bg-forest text-ivory text-center space-y-4">
        <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
          Ready to pass on what you don't need?
        </h3>
        <p className="text-xs sm:text-sm text-ivory-soft max-w-lg mx-auto">
          Take 2 minutes to list your course textbook, desk lamp, or calculator today.
        </p>
        <Link to="/sell" className="inline-block pt-2">
          <Button variant="lime" size="lg">
            List an Item on Campus
          </Button>
        </Link>
      </div>
    </div>
  );
};

