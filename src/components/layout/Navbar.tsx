import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Heart,
  MessageSquare,
  PlusCircle,
  Menu,
  X,
  Shield,
  User,
  ShoppingBag,
  Leaf,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoSwitcherOpen, setDemoSwitcherOpen] = useState(false);

  const { currentUser, users, switchUser } = useAuthStore();
  const { favorites, conversations } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const activeConversations = conversations.filter((c) =>
    c.participantIds.includes(currentUser.id)
  );
  const unreadMsgCount = activeConversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navLinks = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Wanted Board', path: '/wanted', badge: 'Active' },
    { name: 'Impact', path: '/impact' },
    { name: 'Orders', path: '/orders' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-ivory-border">
      {/* Top Demo Bar */}
      <div className="bg-forest-dark text-ivory text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="flex items-center gap-1.5 font-medium text-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Circular Demo:</span>
          </span>
          <span className="text-ivory-soft hidden sm:inline">
            Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.major || currentUser.role})
          </span>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setDemoSwitcherOpen(!demoSwitcherOpen)}
              className="text-xs bg-forest hover:bg-forest-light text-ivory px-2 py-0.5 rounded border border-forest-light flex items-center gap-1"
            >
              <span>Switch User</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <Link to="/admin" className="text-lime hover:underline flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Demo Switcher Dropdown */}
      {demoSwitcherOpen && (
        <div className="absolute right-4 top-8 z-50 bg-white rounded-2xl shadow-lifted border border-ivory-border p-3 w-72 text-charcoal">
          <div className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2 px-2">
            Switch Demo Account
          </div>
          <div className="space-y-1">
            {Object.values(users).map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  setDemoSwitcherOpen(false);
                }}
                className={`w-full text-left p-2 rounded-xl flex items-center gap-3 transition-colors ${
                  u.id === currentUser.id
                    ? 'bg-ivory-soft text-forest font-semibold'
                    : 'hover:bg-ivory text-charcoal'
                }`}
              >
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  className="w-8 h-8 rounded-full object-cover border border-ivory-border"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate flex items-center gap-1">
                    {u.name}
                    {u.role === 'admin' && (
                      <span className="bg-forest text-lime text-[10px] px-1.5 py-0.2 rounded font-mono">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-charcoal-muted truncate">
                    {u.major || u.role}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-forest flex items-center justify-center text-lime shadow-subtle group-hover:scale-105 transition-transform duration-200">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-editorial text-2xl font-bold tracking-tight text-forest-dark">
                  ReUse<span className="text-forest underline decoration-lime decoration-4 underline-offset-4">U</span>
                </span>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-charcoal-muted block -mt-1">
                Campus Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors relative ${
                  isActive(link.path)
                    ? 'text-forest font-semibold bg-white/70 shadow-xs'
                    : 'text-charcoal-muted hover:text-forest hover:bg-white/40'
                }`}
              >
                {link.name}
                {link.badge && (
                  <span className="ml-1.5 text-[10px] bg-lime text-forest-dark px-1.5 py-0.5 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Search shortcut button */}
            <button
              onClick={() => navigate('/marketplace')}
              className="p-2.5 text-charcoal-muted hover:text-forest hover:bg-ivory-soft rounded-xl transition-colors"
              title="Search items"
              aria-label="Search items"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Saved items */}
            <Link
              to="/favorites"
              className="relative p-2.5 text-charcoal-muted hover:text-forest hover:bg-ivory-soft rounded-xl transition-colors"
              title="Saved items"
              aria-label="Saved items"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-forest text-lime text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Messages */}
            <Link
              to="/messages"
              className="relative p-2.5 text-charcoal-muted hover:text-forest hover:bg-ivory-soft rounded-xl transition-colors"
              title="Messages"
              aria-label="Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMsgCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-lime text-forest-dark text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadMsgCount}
                </span>
              )}
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-ivory-soft transition-colors border border-transparent hover:border-ivory-border"
                aria-label="User menu"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-forest/20"
                />
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lifted border border-ivory-border p-2 z-50 text-charcoal"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="p-3 border-b border-ivory-border">
                    <p className="text-sm font-bold text-forest-dark truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-charcoal-muted truncate">{currentUser.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                      <Shield className="w-3 h-3 text-emerald-600" />
                      <span>{currentUser.verifiedLabel}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-ivory-soft text-charcoal hover:text-forest"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Seller Dashboard</span>
                    </Link>
                    <Link
                      to={`/profile/${currentUser.id}`}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-ivory-soft text-charcoal hover:text-forest"
                    >
                      <User className="w-4 h-4" />
                      <span>Public Profile</span>
                    </Link>
                    <Link
                      to="/impact"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-ivory-soft text-charcoal hover:text-forest"
                    >
                      <Leaf className="w-4 h-4 text-forest" />
                      <span>Sustainability Impact</span>
                    </Link>
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-ivory-soft text-charcoal hover:text-forest"
                    >
                      <Shield className="w-4 h-4 text-forest" />
                      <span>Campus Admin Desk</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-ivory-border">
                    <Link
                      to="/auth"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-red-50 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign In / Switch Accounts</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* List an item CTA */}
            <Link to="/sell">
              <Button
                variant="primary"
                size="md"
                leftIcon={<PlusCircle className="w-4 h-4 text-lime" />}
                className="font-medium shadow-subtle hover:shadow-card"
              >
                List an item
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link to="/sell">
              <Button variant="primary" size="sm" className="px-3">
                Sell
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-forest hover:bg-ivory-soft rounded-xl"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-ivory-border bg-ivory px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-ivory-border">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white text-xs font-semibold text-center text-forest border border-ivory-border"
            >
              Explore Items
            </Link>
            <Link
              to="/wanted"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white text-xs font-semibold text-center text-forest border border-ivory-border"
            >
              Wanted Board
            </Link>
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white text-xs font-semibold text-center text-forest border border-ivory-border flex items-center justify-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Saved ({favorites.length})</span>
            </Link>
            <Link
              to="/messages"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white text-xs font-semibold text-center text-forest border border-ivory-border flex items-center justify-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-forest" />
              <span>Messages</span>
            </Link>
          </div>

          <div className="space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-charcoal hover:bg-white rounded-xl"
            >
              Seller Dashboard & Offers
            </Link>
            <Link
              to={`/profile/${currentUser.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-charcoal hover:bg-white rounded-xl"
            >
              My Profile
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-charcoal hover:bg-white rounded-xl"
            >
              Transactions & History
            </Link>
            <Link
              to="/impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-charcoal hover:bg-white rounded-xl"
            >
              Sustainability Impact
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-charcoal hover:bg-white rounded-xl text-forest font-semibold"
            >
              Admin Moderation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
