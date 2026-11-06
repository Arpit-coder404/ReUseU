import React from 'react';
import { MultiStepListingForm } from '@/components/forms/MultiStepListingForm';
import { Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

export const CreateListingPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold text-lime-text bg-lime/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Campus Circular Economy
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-forest-dark">
          Give an item a second life
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          Sell, donate, lend, or swap with peers. List in under 2 minutes and keep useful items
          circulating on campus.
        </p>
      </div>

      {/* Multi-step Flow */}
      <MultiStepListingForm />

      {/* Trust & Safe Exchange Reminders */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-ivory-border text-xs text-charcoal-muted">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Campus ID verified students only. Monitored public pickup spots.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <HeartHandshake className="w-4 h-4 text-forest shrink-0 mt-0.5" />
          <span>Set student-friendly prices. No platform seller commission fees.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-lime-text shrink-0 mt-0.5" />
          <span>Auto-matching notifies peers searching on the Wanted board.</span>
        </div>
      </div>
    </div>
  );
};
