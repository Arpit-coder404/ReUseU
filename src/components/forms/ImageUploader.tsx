import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const SAMPLE_PHOTO_PRESETS = [
  { label: 'Engineering Book', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Calculator', url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Lab Coat', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Electronics', url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Campus Bike', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Desk Lamp', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80' },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 4,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (images.length >= maxImages) return;
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange([...images, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleAddPreset = (url: string) => {
    if (images.length >= maxImages) return;
    onChange([...images, url]);
  };

  return (
    <div className="space-y-4">
      {/* Upload Drop Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-forest/30 hover:border-forest bg-white/60 hover:bg-white rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 group shadow-subtle"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-2xl bg-forest/10 group-hover:bg-forest text-forest group-hover:text-lime flex items-center justify-center mx-auto mb-3 transition-colors">
          <Upload className="w-6 h-6" />
        </div>

        <h4 className="text-sm font-bold text-forest-dark mb-1">
          Click to upload photos from your device
        </h4>
        <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
          JPG, PNG or WEBP up to 5MB. Take clear photos in natural light showing any wear.
        </p>

        <span className="inline-block mt-3 text-[11px] font-semibold text-forest bg-forest/5 px-3 py-1 rounded-full">
          {images.length} of {maxImages} images added
        </span>
      </div>

      {/* Preset Student Sample Photos Quick-Picker */}
      <div className="p-4 rounded-2xl bg-ivory-soft border border-ivory-border">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-forest-dark mb-2">
          <Sparkles className="w-3.5 h-3.5 text-lime-text" />
          <span>Demo Shortcut: Pick standard campus item image</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PHOTO_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleAddPreset(preset.url)}
              disabled={images.length >= maxImages || images.includes(preset.url)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white border border-ivory-border hover:border-forest text-charcoal hover:text-forest disabled:opacity-40 transition-colors"
            >
              + {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl overflow-hidden border border-ivory-border group shadow-xs"
            >
              <img src={img} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
              {index === 0 && (
                <span className="absolute bottom-2 left-2 bg-forest-dark/80 text-lime text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-forest-dark/80 text-white hover:bg-red-600 transition-colors shadow-xs"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
