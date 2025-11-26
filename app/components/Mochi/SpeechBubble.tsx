'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

interface SpeechBubbleProps {
    messageEn: string;
    messageCn: string;
    position: 'bottom-left' | 'bottom-right' | 'top-left';
    onTypingComplete?: () => void;
}

export default function SpeechBubble({ messageEn, messageCn, position, onTypingComplete }: SpeechBubbleProps) {
    const [language, setLanguage] = useState<'en' | 'cn'>('en');
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    // Use refs to track state without triggering re-renders or effect dependencies
    const textRef = useRef('');
    const indexRef = useRef(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const currentMessage = language === 'en' ? messageEn : messageCn;

    useEffect(() => {
        // Reset for new message
        setDisplayedText('');
        setIsTyping(true);
        textRef.current = '';
        indexRef.current = 0;

        if (timerRef.current) clearInterval(timerRef.current);

        console.log(`🎤 Speech Bubble: Starting typing (${language})`);

        timerRef.current = setInterval(() => {
            if (indexRef.current < currentMessage.length) {
                const nextChar = currentMessage.charAt(indexRef.current);
                textRef.current += nextChar;
                setDisplayedText(textRef.current);
                indexRef.current++;
            } else {
                if (timerRef.current) clearInterval(timerRef.current);
                setIsTyping(false);
                console.log('✅ Speech Bubble: Typing complete');
                if (onTypingComplete) {
                    onTypingComplete();
                }
            }
        }, 40); // Slightly slower for better readability

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentMessage, onTypingComplete]); // Only restart if message changes

    const toggleLanguage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLanguage(prev => prev === 'en' ? 'cn' : 'en');
    };

    // Adjusted positions to overlap Mochi
    const bubbleStyles = {
        'bottom-right': {
            container: 'absolute bottom-full left-1/2 -translate-x-1/2 mb-[-10px]', // Overlapping Mochi (negative margin)
            bubble: 'bg-gradient-to-br from-surface to-secondary border-primary/20', // Original gradient style
            tail: 'absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-secondary border-b border-r border-primary/20 transform rotate-45'
        },
        'bottom-left': {
            container: 'absolute bottom-full left-1/2 -translate-x-1/2 mb-[-10px]', // Overlapping Mochi
            bubble: 'bg-gradient-to-br from-surface to-secondary border-primary/20',
            tail: 'absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-secondary border-b border-r border-primary/20 transform rotate-45'
        },
        'top-left': {
            container: 'absolute top-full left-1/2 -translate-x-1/2 mt-[-10px]', // Overlapping Mochi
            bubble: 'bg-gradient-to-br from-surface to-secondary border-primary/20',
            tail: 'absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-secondary border-t border-l border-primary/20 transform rotate-45'
        }
    };

    const currentStyle = bubbleStyles[position];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`${currentStyle.container} w-[180px] z-50`} // Smaller width
        >
            <div className={`${currentStyle.bubble} rounded-2xl p-3 text-accent`}>
                {/* Header with Language Switch */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Mochi</span>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 text-[10px] font-bold text-white hover:text-primary transition-colors bg-white/10 border border-white/20 px-3 py-1 rounded-full shadow-sm" // More apparent button
                    >
                        <Globe className="w-3 h-3" />
                        {language === 'en' ? 'EN' : '中文'}
                    </button>
                </div>

                {/* Text Content */}
                <p className="text-base font-medium leading-relaxed min-h-[3rem]"> {/* Larger text */}
                    {displayedText}
                    {isTyping && <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse align-middle" />}
                </p>

                {/* Tail */}
                <div className={currentStyle.tail} />
            </div>
        </motion.div>
    );
}
