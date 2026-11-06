import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExchangeType, CategoryId, ItemCondition, Listing } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { CAMPUS_LOCATIONS } from '@/data/campusLocations';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { ImageUploader } from './ImageUploader';
import { CampusLocationSelector } from '@/components/layout/CampusLocationSelector';
import { Button } from '@/components/ui/Button';
import { ExchangeBadge, ConditionBadge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/formatters';
import {
  Tag,
  Gift,
  Clock,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  MapPin,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MultiStepListingForm: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { addListing } = useStore();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [exchangeType, setExchangeType] = useState<ExchangeType>('sell');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryId>('textbooks');
  const [condition, setCondition] = useState<ItemCondition>('like_new');
  const [price, setPrice] = useState<number>(20);
  const [originalPrice, setOriginalPrice] = useState<number>(60);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['campus', 'student-reuse']);
  const [pickupLocation, setPickupLocation] = useState(CAMPUS_LOCATIONS[0].name);
  const [swapPreference, setSwapPreference] = useState('');
  const [lendDurationDays, setLendDurationDays] = useState(14);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPublishing, setIsPublishing] = useState(false);

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters.';
    }
    if (!description.trim() || description.trim().length < 15) {
      errs.description = 'Please provide a clear description (at least 15 characters).';
    }
    if (exchangeType === 'sell' && (price === undefined || price < 1)) {
      errs.price = 'Please set an asking price greater than $0.';
    }
    if (exchangeType === 'swap' && !swapPreference.trim()) {
      errs.swapPreference = 'Please specify what you would like in exchange.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (images.length === 0) {
      errs.images = 'Please upload or select at least 1 image.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    setCurrentStep((s) => Math.min(4, s + 1));
  };

  const handlePublish = () => {
    setIsPublishing(true);

    const newListingId = 'item-' + Math.random().toString(36).substring(2, 9);
    const newListing: Listing = {
      id: newListingId,
      sellerId: currentUser.id,
      seller: currentUser,
      title,
      description,
      category,
      exchangeType,
      price: exchangeType === 'donate' ? 0 : Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      condition,
      pickupLocation,
      status: 'active',
      images,
      tags,
      swapPreference: exchangeType === 'swap' ? swapPreference : undefined,
      lendDurationDays: exchangeType === 'lend' ? Number(lendDurationDays) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1,
      favoritesCount: 0,
      isFeatured: false,
    };

    setTimeout(() => {
      addListing(newListing);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#173F35', '#C6F36B', '#F7F5EF'],
        });
      } catch {}
      setIsPublishing(false);
      navigate(`/listing/${newListingId}`);
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Step Indicator */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-ivory-border shadow-subtle">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Mode' },
            { num: 2, label: 'Details' },
            { num: 3, label: 'Photos' },
            { num: 4, label: 'Publish' },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    currentStep === s.num
                      ? 'bg-forest text-lime ring-4 ring-forest/10'
                      : currentStep > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-ivory-soft text-charcoal-muted'
                  }`}
                >
                  {currentStep > s.num ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:inline ${
                    currentStep === s.num ? 'text-forest font-bold' : 'text-charcoal-muted'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 sm:mx-4 rounded-full transition-colors ${
                    currentStep > idx + 1 ? 'bg-emerald-500' : 'bg-ivory-border'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: Exchange Type */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-border shadow-subtle space-y-6">
          <div>
            <span className="text-xs font-semibold text-lime-text bg-lime/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Step 1 of 4
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-forest-dark mt-2">
              How would you like to pass this item on?
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Choose the exchange model that best fits your needs and helps your fellow students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              {
                type: 'sell' as ExchangeType,
                title: 'Sell to a Student',
                badge: 'Direct Sale',
                desc: 'Set an affordable student price. Recover value while helping a peer avoid bookstore retail.',
                icon: <Tag className="w-6 h-6 text-forest" />,
              },
              {
                type: 'donate' as ExchangeType,
                title: 'Free Donation',
                badge: '$0 Giveaway',
                desc: 'Moving out or finished a course? Gift your items to someone who truly needs them.',
                icon: <Gift className="w-6 h-6 text-lime-text" />,
              },
              {
                type: 'lend' as ExchangeType,
                title: 'Lend / Borrow',
                badge: 'Temporary Loan',
                desc: 'Lend expensive items like calculators, drafters, or lab kits for midterms or project weeks.',
                icon: <Clock className="w-6 h-6 text-forest" />,
              },
              {
                type: 'swap' as ExchangeType,
                title: 'Campus Swap',
                badge: 'Item-for-Item',
                desc: 'Trade equipment, textbooks, or electronics directly without exchanging money.',
                icon: <RefreshCw className="w-6 h-6 text-forest" />,
              },
            ].map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => setExchangeType(option.type)}
                className={`text-left p-5 rounded-3xl border-2 transition-all duration-200 relative group flex flex-col justify-between ${
                  exchangeType === option.type
                    ? 'border-forest bg-forest/5 shadow-card'
                    : 'border-ivory-border hover:border-forest/40 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-ivory-soft flex items-center justify-center">
                      {option.icon}
                    </div>
                    <span className="text-[11px] font-bold bg-ivory-soft px-2.5 py-1 rounded-full text-forest">
                      {option.badge}
                    </span>
                  </div>
                  <h3 className="font-editorial text-lg font-bold text-forest-dark mb-1">
                    {option.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">{option.desc}</p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-forest">
                  <span>{exchangeType === option.type ? 'Selected' : 'Select mode'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Details
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Item Details */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-border shadow-subtle space-y-6">
          <div>
            <span className="text-xs font-semibold text-lime-text bg-lime/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Step 2 of 4
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-forest-dark mt-2">
              Tell us about your item
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Provide accurate descriptions and pick safe pickup locations.
            </p>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advanced Engineering Mathematics (10th Ed) or Casio fx-991EX Calculator"
                className={`w-full px-4 py-3 rounded-2xl border text-sm text-charcoal focus:border-forest outline-none ${
                  errors.title ? 'border-red-400 bg-red-50/30' : 'border-ivory-border bg-white'
                }`}
              />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full px-4 py-3 rounded-2xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block mb-1.5">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ItemCondition)}
                  className="w-full px-4 py-3 rounded-2xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none"
                >
                  <option value="like_new">Like New (Immaculate, minimal to no marks)</option>
                  <option value="good">Good (Normal wear, fully functional)</option>
                  <option value="fair">Fair (Visible signs of use, works fine)</option>
                  <option value="refurbished">Refurbished / Repaired</option>
                </select>
              </div>
            </div>

            {/* Price Inputs if Sell */}
            {exchangeType === 'sell' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-ivory-soft border border-ivory-border">
                <div>
                  <label className="text-xs font-semibold text-forest-dark uppercase tracking-wider block mb-1.5">
                    Your Selling Price ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 font-bold text-forest">$</span>
                    <input
                      type="number"
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2 rounded-xl border border-ivory-border bg-white text-forest-dark font-bold text-base outline-none"
                    />
                  </div>
                  {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block mb-1.5">
                    Original Retail Price ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 font-bold text-charcoal-muted">$</span>
                    <input
                      type="number"
                      min="0"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      placeholder="Optional, shows savings"
                      className="w-full pl-8 pr-4 py-2 rounded-xl border border-ivory-border bg-white text-charcoal font-medium text-base outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-charcoal-muted mt-1">
                    Helps peers see how much they save compared to buying new!
                  </p>
                </div>
              </div>
            )}

            {/* Swap Preference if Swap */}
            {exchangeType === 'swap' && (
              <div className="p-4 rounded-2xl bg-sage/20 border border-sage/40 space-y-1.5">
                <label className="text-xs font-semibold text-forest-dark uppercase tracking-wider block">
                  What are you looking to swap this for? *
                </label>
                <input
                  type="text"
                  value={swapPreference}
                  onChange={(e) => setSwapPreference(e.target.value)}
                  placeholder="e.g. Seeking a compact 60% keyboard or Patagonia backpack"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sage/40 bg-white text-xs text-charcoal outline-none"
                />
                {errors.swapPreference && (
                  <p className="text-xs text-red-600 mt-1">{errors.swapPreference}</p>
                )}
              </div>
            )}

            {/* Lend Duration if Lend */}
            {exchangeType === 'lend' && (
              <div className="p-4 rounded-2xl bg-ivory-soft border border-ivory-border space-y-1.5">
                <label className="text-xs font-semibold text-forest-dark uppercase tracking-wider block">
                  Lend Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={lendDurationDays}
                  onChange={(e) => setLendDurationDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal outline-none"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block mb-1.5">
                Description & Condition Notes *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe condition, course relevance, features, battery health, or why you are passing it forward..."
                className={`w-full px-4 py-3 rounded-2xl border text-xs text-charcoal focus:border-forest outline-none resize-none ${
                  errors.description
                    ? 'border-red-400 bg-red-50/30'
                    : 'border-ivory-border bg-white'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block mb-1.5">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add search tag (e.g. chem-101, ti-84, hostel-bed)"
                  className="flex-1 px-4 py-2 rounded-xl border border-ivory-border bg-white text-xs text-charcoal outline-none"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs bg-ivory-soft text-forest px-2.5 py-1 rounded-full border border-ivory-border"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-red-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Campus Pickup Spot */}
            <div className="pt-2">
              <CampusLocationSelector
                selectedLocation={pickupLocation}
                onSelectLocation={(loc) => setPickupLocation(loc)}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-ivory-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCurrentStep(1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Upload Photos
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Upload Images */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-border shadow-subtle space-y-6">
          <div>
            <span className="text-xs font-semibold text-lime-text bg-lime/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Step 3 of 4
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-forest-dark mt-2">
              Add Item Photos
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Listings with authentic photos receive 3x more campus exchange inquiries.
            </p>
          </div>

          <ImageUploader images={images} onChange={setImages} />
          {errors.images && <p className="text-xs text-red-600 mt-1">{errors.images}</p>}

          <div className="pt-4 flex items-center justify-between border-t border-ivory-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCurrentStep(2)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Details
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Review Listing
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Review and Publish */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-border shadow-subtle space-y-6">
          <div>
            <span className="text-xs font-semibold text-lime-text bg-lime/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Step 4 of 4
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-forest-dark mt-2">
              Preview your campus listing
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Review details before publishing to the live campus marketplace.
            </p>
          </div>

          {/* Preview Card */}
          <div className="p-5 rounded-3xl bg-ivory-soft border border-ivory-border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white">
                <img
                  src={images[0]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <ExchangeBadge type={exchangeType} />
                  <ConditionBadge condition={condition} />
                  <span className="text-xs font-medium text-forest capitalize">
                    {category}
                  </span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-forest-dark">
                  {title || 'Untitled Listing'}
                </h3>

                <p className="text-xs text-charcoal-muted line-clamp-2">
                  {description}
                </p>

                <div className="pt-2 flex items-baseline gap-2">
                  {exchangeType === 'donate' ? (
                    <span className="text-lg font-bold text-forest bg-lime px-2.5 py-0.5 rounded-lg">
                      Free Donation
                    </span>
                  ) : exchangeType === 'swap' ? (
                    <span className="text-sm font-bold text-forest bg-sage/30 px-2.5 py-0.5 rounded-lg">
                      Swap: {swapPreference || 'Open to offers'}
                    </span>
                  ) : (
                    <>
                      <span className="font-editorial text-2xl font-bold text-forest-dark">
                        {formatCurrency(price)}
                      </span>
                      {originalPrice > price && (
                        <span className="text-xs text-charcoal-muted line-through">
                          {formatCurrency(originalPrice)}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="pt-2 text-xs text-charcoal-muted flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-forest" />
                  <span>Pickup: {pickupLocation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines agreement */}
          <div className="p-4 rounded-2xl bg-forest/5 border border-forest/15 text-xs text-charcoal-muted space-y-1">
            <p className="font-semibold text-forest-dark">Campus Guidelines Check:</p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li>You confirm this item is in working order and matches the condition stated.</li>
              <li>Exchanges will be completed in person at safe campus pickup locations.</li>
              <li>Academic integrity rules apply: no unauthorized exam leaks or prohibited materials.</li>
            </ul>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-ivory-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCurrentStep(3)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Photos
            </Button>
            <Button
              type="button"
              variant="lime"
              size="lg"
              isLoading={isPublishing}
              onClick={handlePublish}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Publish to Marketplace
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
