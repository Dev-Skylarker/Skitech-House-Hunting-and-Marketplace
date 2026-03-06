import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketingSide {
  message1: string;
  message2: string;
  cta: {
    label: string;
    onClick: () => void;
    color?: string;
  };
  bgImage: string;
}

interface MarketingSliderProps {
  slides: MarketingSide[];
  autoplayInterval?: number;
}

export function MarketingSlider({ slides, autoplayInterval = 5000 }: MarketingSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, autoplayInterval);
    return () => clearInterval(interval);
  }, [slides.length, autoplayInterval]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  if (!currentSlide) return null;

  return (
    <div className="relative w-full aspect-[3/1] rounded-2xl overflow-hidden shadow-lg group">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentSlide.bgImage}
          alt="Marketing slide"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
          {currentSlide.message1}
        </h2>
        <p className="text-sm md:text-base mb-6 text-white/90 max-w-md">
          {currentSlide.message2}
        </p>
        <Button
          onClick={currentSlide.cta.onClick}
          className={`rounded-full px-6 h-10 text-sm font-semibold ${
            currentSlide.cta.color || 'bg-[#FF7A00] hover:bg-[#E67E00]'
          } text-white`}
        >
          {currentSlide.cta.label}
        </Button>
      </div>

      {/* Navigation Arrows - only show if multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
