import React, { useState } from 'react';
import { WantedPost, CategoryId, ItemCondition } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Send, AlertCircle } from 'lucide-react';

interface CreateWantedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateWantedModal: React.FC<CreateWantedModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuthStore();
  const { addWantedPost } = useStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryId>('textbooks');
  const [minBudget, setMinBudget] = useState<number | undefined>(15);
  const [maxBudget, setMaxBudget] = useState<number | undefined>(35);
  const [preferredCondition, setPreferredCondition] = useState<ItemCondition | 'any'>('good');
  const [urgency, setUrgency] = useState<'normal' | 'high'>('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    const newPost: WantedPost = {
      id: 'wanted-' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      user: currentUser,
      title,
      description,
      category,
      minBudget: minBudget ? Number(minBudget) : undefined,
      maxBudget: maxBudget ? Number(maxBudget) : undefined,
      preferredCondition,
      status: 'open',
      urgency,
      createdAt: new Date().toISOString(),
      responsesCount: 0,
    };

    setTimeout(() => {
      addWantedPost(newPost);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post a Wanted Request"
      description="Looking for course materials, lab equipment or hostel gear? Ask your peers."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
            What are you looking for? *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Need a lab coat for BioChem lab (Size M)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none"
          />
        </div>

        {/* Category & Urgency */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
              Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as 'normal' | 'high')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none"
            >
              <option value="normal">Normal (Next 1-2 weeks)</option>
              <option value="high">High (Needed within 48h)</option>
            </select>
          </div>
        </div>

        {/* Budget Range */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
              Min Budget ($)
            </label>
            <input
              type="number"
              min="0"
              value={minBudget ?? ''}
              onChange={(e) => setMinBudget(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="0"
              className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
              Max Budget ($)
            </label>
            <input
              type="number"
              min="0"
              value={maxBudget ?? ''}
              onChange={(e) => setMaxBudget(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="30"
              className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none"
            />
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
            Preferred Condition
          </label>
          <select
            value={preferredCondition}
            onChange={(e) => setPreferredCondition(e.target.value as ItemCondition | 'any')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none"
          >
            <option value="any">Any Condition (Working order)</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
            Details & Campus Context *
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mention which course, dorm or test you need it for, and when you can meet for campus pickup..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none resize-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Send className="w-4 h-4 text-lime" />}
          >
            Post to Wanted Board
          </Button>
        </div>
      </form>
    </Modal>
  );
};

