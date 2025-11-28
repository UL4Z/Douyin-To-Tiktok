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

        timerRef.current = setInterval(() => {
            if (indexRef.current < currentMessage.length) {
                const nextChar = currentMessage.charAt(indexRef.current);
                textRef.current += nextChar;
                setDisplayedText(textRef.current);
                indexRef.current++;
            } else {
                if (timerRef.current) clearInterval(timerRef.current);
                setIsTyping(false);
                if (onTypingComplete) {
                    onTypingComplete();
                }
            }
        }, 40);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentMessage, onTypingComplete]);

    const toggleLanguage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLanguage(prev => prev === 'en' ? 'cn' : 'en');
    };

    // Duolingo-style: White bubble, light gray border, bold text
    const bubbleStyles = {
        'bottom-right': {
            container: 'absolute bottom-full left-1/2 -translate-x-1/2 mb-4', // Position above with spacing
            bubble: 'bg-white border-2 border-[#e5e5e5] shadow-sm',
            tail: 'absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-b-2 border-r-2 border-[#e5e5e5] transform rotate-45'
        },
        'bottom-left': {
            container: 'absolute bottom-full left-1/2 -translate-x-1/2 mb-4',
            bubble: 'bg-white border-2 border-[#e5e5e5] shadow-sm',
            tail: 'absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-b-2 border-r-2 border-[#e5e5e5] transform rotate-45'
        },
        'top-left': {
            container: 'absolute top-full left-1/2 -translate-x-1/2 mt-4',
            bubble: 'bg-white border-2 border-[#e5e5e5] shadow-sm',
            tail: 'absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-t-2 border-l-2 border-[#e5e5e5] transform rotate-45'
        }
    };

    const currentStyle = bubbleStyles[position];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`${currentStyle.container} w-[160px] md:w-[200px] z-50`}
        >
            <div className={`${currentStyle.bubble} rounded-2xl p-4 text-[#3c3c3c] relative`}>
                {/* Header with Language Switch */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-[#afafaf] uppercase tracking-wider">Mochi</span>
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 text-[10px] font-bold text-[#afafaf] hover:text-[#1cb0f6] transition-colors bg-[#f7f7f7] px-2 py-1 rounded-full uppercase tracking-wide"
                    >
                        <Globe className="w-3 h-3" />
                        {language === 'en' ? 'EN' : 'CN'}
                    </button>
                </div>

                {/* Text Content */}
                <p className="text-[15px] font-bold leading-snug min-h-[2rem]">
                    {displayedText}
                    {isTyping && <span className="inline-block w-1.5 h-4 bg-[#1cb0f6] ml-1 animate-pulse align-middle rounded-full" />}
                </p>

                {/* Tail */}
                <div className={currentStyle.tail} />
            </div>
        </motion.div>
    );
}
