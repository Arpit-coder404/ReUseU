import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency, formatRelativeTime } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';
import {
  ShieldAlert,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Users,
  ShoppingBag,
  Flag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { listings, reports, updateReportStatus, deleteListing, resetDemoData, transactions } =
    useStore();
  const { users, currentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'reports' | 'listings' | 'users'>('reports');

  const pendingReports = reports.filter((r) => r.status === 'pending');
  const activeListings = listings.filter((l) => l.status === 'active');
  const userCount = Object.keys(users).length;
  const completedTxCount = transactions.filter((t) => t.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-forest text-lime px-2.5 py-0.5 rounded font-mono">
              CAMPUS MODERATOR DESK
            </span>
            <span className="text-xs text-charcoal-muted">
              Role: <strong>{currentUser.role.toUpperCase()}</strong>
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-forest-dark">
            Campus Moderation & Governance
          </h1>
          <p className="text-xs text-charcoal-muted">
            Protecting academic integrity, preventing commercial spam, and maintaining student trust.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={resetDemoData}
          leftIcon={<RotateCcw className="w-3.5 h-3.5 text-forest" />}
          className="text-xs shrink-0"
        >
          Reset Demo Seed State
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-ivory-border shadow-subtle space-y-1">
          <span className="text-xs font-semibold text-charcoal-muted uppercase">Total Users</span>
          <div className="font-editorial text-3xl font-bold text-forest-dark">{userCount}</div>
          <p className="text-[11px] text-charcoal-muted">Campus ID verified accounts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-ivory-border shadow-subtle space-y-1">
          <span className="text-xs font-semibold text-charcoal-muted uppercase">Active Listings</span>
          <div className="font-editorial text-3xl font-bold text-forest-dark">
            {activeListings.length}
          </div>
          <p className="text-[11px] text-charcoal-muted">Across 8 categories</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-ivory-border shadow-subtle space-y-1">
          <span className="text-xs font-semibold text-charcoal-muted uppercase">Exchanges Done</span>
          <div className="font-editorial text-3xl font-bold text-forest-dark">
            {completedTxCount}
          </div>
          <p className="text-[11px] text-charcoal-muted">Campus handovers</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-ivory-border shadow-subtle space-y-1">
          <span className="text-xs font-semibold text-charcoal-muted uppercase">
            Pending Reports
          </span>
          <div
            className={`font-editorial text-3xl font-bold ${
              pendingReports.length > 0 ? 'text-amber-600' : 'text-emerald-700'
            }`}
          >
            {pendingReports.length}
          </div>
          <p className="text-[11px] text-charcoal-muted">Require moderator review</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ivory-border">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'border-forest text-forest'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Reported Listings ({pendingReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'border-forest text-forest'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>All Marketplace Items ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-forest text-forest'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Demo Student Accounts ({userCount})</span>
        </button>
      </div>

      {/* Tab 1: Reports Moderation Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-xl font-bold text-forest-dark">
              Active Content Reports
            </h3>
            <span className="text-xs text-charcoal-muted">
              {pendingReports.length} item(s) pending review
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-ivory-border text-center text-xs text-charcoal-muted">
              No reports filed. The community is healthy!
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-5 rounded-3xl bg-white border border-ivory-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                        {report.reason}
                      </span>
                      <span className="text-[11px] text-charcoal-muted">
                        Reported by {report.reporterName} • {formatRelativeTime(report.createdAt)}
                      </span>
                    </div>

                    <h4 className="font-bold text-forest-dark text-sm">
                      Target: "{report.targetTitle}"
                    </h4>

                    <p className="text-xs text-charcoal-muted italic">
                      "{report.details}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                    {report.status === 'pending' ? (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => updateReportStatus(report.id, 'dismissed')}
                        >
                          Dismiss
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            deleteListing(report.targetId);
                            updateReportStatus(report.id, 'resolved');
                          }}
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Remove Listing
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-ivory-soft text-charcoal-muted capitalize">
                        Status: {report.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: All Listings Moderation */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-ivory-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-soft text-charcoal-muted uppercase tracking-wider font-semibold border-b border-ivory-border">
                <tr>
                  <th className="p-4">Listing Title</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Price / Mode</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-border">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-ivory/50">
                    <td className="p-4 font-bold text-forest-dark truncate max-w-xs">
                      {l.title}
                    </td>
                    <td className="p-4 text-charcoal-muted">{l.seller.name}</td>
                    <td className="p-4 font-bold text-forest">
                      {l.exchangeType === 'donate' ? 'Free' : formatCurrency(l.price)}
                    </td>
                    <td className="p-4 capitalize text-charcoal-muted">{l.status}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteListing(l.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Users */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(users).map((u) => (
            <div
              key={u.id}
              className="p-5 rounded-3xl bg-white border border-ivory-border shadow-xs flex items-center gap-3.5"
            >
              <img
                src={u.avatarUrl}
                alt={u.name}
                className="w-12 h-12 rounded-2xl object-cover border border-ivory-border"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-forest-dark truncate">{u.name}</h4>
                  {u.role === 'admin' && (
                    <span className="text-[10px] bg-forest text-lime px-1.5 py-0.2 rounded font-mono">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-charcoal-muted truncate">{u.email}</p>
                <p className="text-[10px] text-forest font-medium truncate mt-0.5">
                  {u.major || u.role} • {u.itemsReusedCount} reused
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
