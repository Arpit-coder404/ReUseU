import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Lock,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { currentUser, users, switchUser, loginDemo } = useAuthStore();
  const { addToast } = useStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup' | 'demo'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [campusMajor, setCampusMajor] = useState('');

  const handleDemoSwitch = (userId: string) => {
    switchUser(userId);
    addToast({
      type: 'success',
      title: 'Switched Demo Persona',
      message: `Now browsing as ${users[userId]?.name}.`,
    });
    navigate('/marketplace');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const success = loginDemo(email);
    if (success) {
      addToast({
        type: 'success',
        title: 'Signed in successfully',
        message: 'Welcome back to ReUseU!',
      });
      navigate('/marketplace');
    } else {
      // Demo fallback login
      switchUser('user-arjun');
      addToast({
        type: 'info',
        title: 'Demo Session Active',
        message: 'Signed in as student demo user (Arjun Verma).',
      });
      navigate('/marketplace');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Campus Account Registered!',
      message: 'Student ID card verification email link simulated.',
    });
    navigate('/marketplace');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-forest flex items-center justify-center text-lime mx-auto shadow-card">
          <svg
            className="w-7 h-7"
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

        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-forest-dark">
          ReUseU Campus Access
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
          Campus-exclusive student sign-in with verified student identification.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ivory-border shadow-lifted space-y-6">
        {/* Toggle Mode */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-ivory-soft rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setMode('demo')}
            className={`py-2 rounded-xl transition-colors ${
              mode === 'demo'
                ? 'bg-forest text-lime shadow-xs font-bold'
                : 'text-charcoal hover:bg-white/50'
            }`}
          >
            Switch Persona
          </button>
          <button
            onClick={() => setMode('signin')}
            className={`py-2 rounded-xl transition-colors ${
              mode === 'signin'
                ? 'bg-forest text-lime shadow-xs font-bold'
                : 'text-charcoal hover:bg-white/50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`py-2 rounded-xl transition-colors ${
              mode === 'signup'
                ? 'bg-forest text-lime shadow-xs font-bold'
                : 'text-charcoal hover:bg-white/50'
            }`}
          >
            New Student
          </button>
        </div>

        {/* MODE 1: DEMO PERSONAS (Competition-Ready Fast Switching) */}
        {mode === 'demo' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-charcoal-muted">
              <Sparkles className="w-4 h-4 text-forest" />
              <span>Select any student or administrator account to test interactions:</span>
            </div>

            <div className="space-y-2.5">
              {Object.values(users).map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleDemoSwitch(u.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 group ${
                      isSelected
                        ? 'border-forest bg-forest text-ivory shadow-card'
                        : 'border-ivory-border bg-white hover:border-forest/40 hover:bg-ivory-soft text-charcoal'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-ivory-border"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4
                            className={`text-xs font-bold truncate ${
                              isSelected ? 'text-white' : 'text-forest-dark'
                            }`}
                          >
                            {u.name}
                          </h4>
                          {u.role === 'admin' ? (
                            <span className="text-[10px] bg-lime text-forest-dark font-mono px-1.5 py-0.2 rounded font-bold">
                              ADMIN
                            </span>
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </div>
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isSelected ? 'text-lime' : 'text-charcoal-muted'
                          }`}
                        >
                          {u.major || u.role} • {u.dormBlock || u.campus}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <span>{isSelected ? 'Active' : 'Switch'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 2: SIGN IN */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
                Campus Email Address (.edu)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-border bg-ivory-soft text-xs text-charcoal focus:border-forest outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-border bg-ivory-soft text-xs text-charcoal focus:border-forest outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full">
              Sign In to ReUseU
            </Button>
          </form>
        )}

        {/* MODE 3: SIGN UP */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-border bg-ivory-soft text-xs text-charcoal focus:border-forest outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
                Official Campus Email (.edu)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="student.id@campus.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-border bg-ivory-soft text-xs text-charcoal focus:border-forest outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
                Academic Department / Major
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={campusMajor}
                  onChange={(e) => setCampusMajor(e.target.value)}
                  placeholder="e.g. Computer Science (Junior)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-border bg-ivory-soft text-xs text-charcoal focus:border-forest outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="lime" size="md" className="w-full font-bold">
              Register Student Account
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
