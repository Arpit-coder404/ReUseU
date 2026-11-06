import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Leaf, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-dark text-ivory border-t border-forest-light/30 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-forest-surface">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-forest flex items-center justify-center text-lime">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                ReUse<span className="text-lime">U</span>
              </span>
            </div>
            <p className="text-base font-editorial italic text-ivory-warm">
              “Your next find. Someone else’s second chance.”
            </p>
            <p className="text-xs text-sage leading-relaxed max-w-sm">
              A student-designed campus circular ecosystem. Empowering peers to buy less new,
              prevent dorm move-out waste, and exchange essentials safely within our campus gates.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-lime">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              <span>Smart Campus & Student Life Problem Statement</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sage">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/marketplace" className="text-ivory-soft hover:text-lime transition-colors">
                  Browse All Finds
                </Link>
              </li>
              <li>
                <Link to="/marketplace?exchangeType=donate" className="text-ivory-soft hover:text-lime transition-colors">
                  Free Student Donations
                </Link>
              </li>
              <li>
                <Link to="/wanted" className="text-ivory-soft hover:text-lime transition-colors">
                  Campus Wanted Board
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-ivory-soft hover:text-lime transition-colors">
                  List Item (Sell / Lend / Swap)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sage">
              Campus Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/impact" className="text-ivory-soft hover:text-lime transition-colors">
                  Sustainability Methodology
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-ivory-soft hover:text-lime transition-colors">
                  Safe Exchange Guidelines
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-ivory-soft hover:text-lime transition-colors flex items-center gap-1">
                  <span>Student Moderation Desk</span>
                  <ArrowUpRight className="w-3 h-3 text-sage" />
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-ivory-soft hover:text-lime transition-colors">
                  Campus ID Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Guiding Principles */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sage">
              Student Commitments
            </h4>
            <div className="space-y-2.5 text-xs text-ivory-soft">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                <span>100% verified student community inside campus gates.</span>
              </div>
              <div className="flex items-start gap-2">
                <HeartHandshake className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                <span>Zero packaging waste — hand-to-hand campus pickup.</span>
              </div>
              <div className="flex items-start gap-2">
                <Leaf className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                <span>Extending product lifecycles semester after semester.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sage">
          <p>© 2026 ReUseU — Built for Campus Circular Sustainability.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="bg-forest-surface px-2.5 py-1 rounded text-ivory-soft">
              Demo Environment: Reactive Local Storage Active
            </span>
            <Link to="/admin" className="hover:text-lime underline">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
