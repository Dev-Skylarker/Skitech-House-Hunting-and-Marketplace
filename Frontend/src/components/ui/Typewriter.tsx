import { useState, useEffect } from 'react';

interface TypewriterProps {
    texts: string[];
    delay?: number;
    infinite?: boolean;
}

export function Typewriter({ texts, delay = 150, infinite = true }: TypewriterProps) {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const fullText = texts[textIndex];

            if (!isDeleting) {
                setCurrentText(fullText.substring(0, currentIndex + 1));
                setCurrentIndex(prev => prev + 1);

                if (currentIndex === fullText.length) {
                    setIsDeleting(true);
                }
            } else {
                setCurrentText(fullText.substring(0, currentIndex - 1));
                setCurrentIndex(prev => prev - 1);

                if (currentIndex === 0) {
                    setIsDeleting(false);
                    setTextIndex(prev => (prev + 1) % texts.length);
                }
            }
        }, isDeleting ? delay / 2 : delay);

        return () => clearTimeout(timeout);
    }, [currentIndex, isDeleting, texts, textIndex, delay]);

    return (
        <span className="inline-block min-h-[1em]">
            {currentText}
            <span className="ml-1 inline-block w-0.5 h-4 bg-[#FF7A00] animate-pulse align-middle" />
        </span>
    );
}
