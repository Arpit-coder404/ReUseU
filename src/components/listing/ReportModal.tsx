import React, { useState } from 'react';
import { Listing, Report } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Flag, AlertTriangle } from 'lucide-react';

interface ReportModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ listing, isOpen, onClose }) => {
  const { currentUser } = useAuthStore();
  const { createReport } = useStore();

  const [reason, setReason] = useState('Prohibited item or violation of campus rules');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    'Prohibited item or violation of campus rules',
    'Honor Code / Academic Integrity Violation (e.g. test leaks)',
    'Commercial or non-student bulk resale',
    'Suspicious or fraudulent listing',
    'Misleading item condition or counterfeit goods',
    'Inappropriate language or imagery',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const report: Report = {
      id: 'rep-' + Math.random().toString(36).substring(2, 9),
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      targetType: 'listing',
      targetId: listing.id,
      targetTitle: listing.title,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      createReport(report);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report this Listing"
      description="Help maintain a trusted, safe campus reuse environment."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Reports are immediately reviewed by the student moderation board and campus safety team.
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
            Reason for reporting
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none"
          >
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
            Additional details
          </label>
          <textarea
            rows={3}
            required
            placeholder="Please describe why this item should be reviewed by moderators..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none resize-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            isLoading={isSubmitting}
            leftIcon={<Flag className="w-4 h-4" />}
          >
            Submit Report
          </Button>
        </div>
      </form>
    </Modal>
  );
};

