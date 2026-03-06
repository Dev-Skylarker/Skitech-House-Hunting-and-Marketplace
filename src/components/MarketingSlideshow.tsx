import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

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
        <div className="relative w-full overflow-hidden rounded-2xl aspect-[21/9] sm:aspect-[24/8] shadow-lg">
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
                            />
                            {/* Gradient Overlay for legibility */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 text-white">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 leading-tight max-w-[80%]"
                            >
                                {currentSlide.title}
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-sm sm:text-base text-white/90 font-medium max-w-[70%]"
                            >
                                {currentSlide.subtitle}
                            </motion.p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </Link>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                            ? 'bg-white w-6'
                            : 'bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
