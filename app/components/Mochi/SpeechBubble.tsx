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

    // Adjusted positions to be MUCH closer to Mochi
    const bubbleStyles = {
        'bottom-right': {
            container: 'absolute bottom-full right-0 mb-[-40px]',
            bubble: 'bg-gradient-to-br from-surface to-secondary border-primary/20',
            tail: 'absolute -bottom-3 right-16 w-6 h-6 bg-secondary border-b border-r border-primary/20 transform rotate-45' // Centered on Mochi
        },
        'bottom-left': {
            container: 'absolute bottom-full left-0 mb-[-40px]',
            bubble: 'bg-gradient-to-br from-surface to-secondary border-primary/20',
            tail: 'absolute -bottom-3 left-16 w-6 h-6 bg-secondary border-b border-r border-primary/20 transform rotate-45' // Centered on Mochi
        },
        'top-left': {
            container: 'absolute top-full left-0 mt-[-12px]',
            bubble: 'bg-gradient-to-br from-surface to-secondary border-primary/20',
            tail: 'absolute -top-3 left-16 w-6 h-6 bg-secondary border-t border-l border-primary/20 transform rotate-45'
        }
    };

    const currentStyle = bubbleStyles[position];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`${currentStyle.container} w-80 max-w-md z-50`}
        >
            <div className={`${currentStyle.bubble} rounded-2xl p-4 shadow-2xl border relative text-accent`}>
                {/* Header with Language Switch */}
                <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Mochi</span>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 text-[10px] font-medium text-accent-light hover:text-primary transition-colors bg-black/10 px-2 py-0.5 rounded-full"
                    >
                        <Globe className="w-3 h-3" />
                        {language === 'en' ? 'EN' : '中文'}
                    </button>
                </div>

                {/* Text Content */}
                <p className="text-sm font-medium leading-relaxed min-h-[2.5rem]">
                    {displayedText}
                    {isTyping && <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse align-middle" />}
                </p>

                {/* Tail */}
                <div className={currentStyle.tail} />
            </div>
        </motion.div>
    );
}
