import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
}

interface MarketingSlideshowProps {
    slides: Slide[];
    to: string;
    autoplayInterval?: number;
    delay?: number;
}

export function MarketingSlideshow({ slides, to, autoplayInterval = 5000, delay = 0 }: MarketingSlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;

        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setDirection(1);
                setCurrentIndex((prev) => (prev + 1) % slides.length);
            }, autoplayInterval);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [slides.length, autoplayInterval, delay]);

    const goTo = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const currentSlide = slides[currentIndex];

    return (
        /* Uniform 3:1 slider height across all instances */
        <div className="relative w-full overflow-hidden rounded-2xl shadow-lg" style={{ aspectRatio: '3 / 1', minHeight: '120px', maxHeight: '220px' }}>
            <Link to={to} className="block w-full h-full relative">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={currentSlide.image}
                                alt={currentSlide.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            {/* Visible warm-brown sepia overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#1a0c06]/95 via-[#3E2723]/65 to-[#2D1B13]/20" />
                            {/* Vertical vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                            {/* Warm brown bokeh glow — visible blur orb bottom-left */}
                            <div className="absolute bottom-0 left-0 w-[70%] h-full bg-[#8B4513]/30 blur-[56px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />
                            {/* Golden-hour rim glow top-right */}
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#C0622A]/20 blur-[44px] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 text-white">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-lg sm:text-2xl md:text-3xl font-heading font-medium mb-2 leading-[1.1] max-w-[85%] relative z-10 min-h-[60px]"
                            >
                                {currentSlide.title}
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-[11px] sm:text-base font-heading font-semibold text-white/90 max-w-[80%] leading-snug"
                            >
                                {currentSlide.subtitle}
                            </motion.p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </Link>

            {/* Navigation Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => { e.preventDefault(); goTo(index); }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-white w-5'
                                : 'bg-white/40 hover:bg-white/70 w-1.5'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
