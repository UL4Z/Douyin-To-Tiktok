'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import SpeechBubble from './SpeechBubble';

type MochiState = 'idle' | 'talking' | 'waving' | 'excited' | 'success' | 'celebrating' | 'coding' | 'thinking' | 'teacher' | 'sleeping' | 'angry' | 'pointing';

interface MochiMascotProps {
    messageEn?: string;
    messageCn?: string;
    autoTalk?: boolean;
    state?: MochiState;
    position?: 'bottom-left' | 'bottom-right' | 'top-left';
    size?: 'sm' | 'md' | 'lg';
}

const RANDOM_LINES = [
    { en: "Did you know? I run on bamboo and code! 🎋", cn: "你知道吗？我是靠竹子和代码运行的！🎋" },
    state: propState,
    position: propPosition,
    size = 'md'
}: MochiMascotProps) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [currentState, setCurrentState] = useState<MochiState>('idle');
    const [currentMessage, setCurrentMessage] = useState({ en: '', cn: '' });
    const [currentPosition, setCurrentPosition] = useState<'bottom-left' | 'bottom-right' | 'top-left'>('bottom-right');
    const [isMouthOpen, setIsMouthOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [shouldBlink, setShouldBlink] = useState(false);

    // Track last few line indices to prevent repeats
    const lastLineIndicesRef = useRef<number[]>([]);

    useEffect(() => {
        setMounted(true);

        // Initial random position if not specified
        if (!propPosition) {
            const randomPos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
            setCurrentPosition(randomPos);
        } else {
            setCurrentPosition(propPosition);
        }
    }, [propPosition]);

    // Guided Tour Logic based on Pathname
    useEffect(() => {
        if (!mounted) return;

        let tourMessage = { en: '', cn: '' };
        let tourState: MochiState = 'idle';

        // Override based on route
        switch (pathname) {
            case '/':
                tourMessage = { en: "Welcome! Click Login to get started. 🚀", cn: "欢迎！点击登录开始使用。🚀" };
                tourState = 'waving';
                break;
            case '/login':
                tourMessage = { en: "Enter your details to access the dashboard. 🔐", cn: "输入您的详细信息以访问仪表板。🔐" };
                tourState = 'teacher';
                break;
            case '/dashboard':
                tourMessage = { en: "This is your command center! 🎮", cn: "这是你的指挥中心！🎮" };
                tourState = 'success';
                break;
            default:
                // Fallback to props or random
                if (propMessageEn) {
                    tourMessage = { en: propMessageEn, cn: propMessageCn || propMessageEn };
                    tourState = propState || 'idle';
                }
                break;
        }

        // Only auto-talk if we have a message (tour or prop) AND autoTalk is true
        // OR if it's a specific tour page where we ALWAYS want him to greet
        const isTourPage = ['/', '/login', '/dashboard'].includes(pathname);

        if (tourMessage.en && (autoTalk || isTourPage)) {
            setCurrentMessage(tourMessage);
            setCurrentState(tourState);
            setShowBubble(true);
            setIsTyping(true);
        } else {
            setCurrentState(propState || 'idle');
            setShowBubble(false);
        }

    }, [pathname, mounted, propMessageEn, propMessageCn, autoTalk, propState]);

    const handleMochiClick = () => {
        // If already talking, close bubble
        if (showBubble) {
            setShowBubble(false);
            setIsTyping(false);
            setCurrentState(propState || 'idle');
            return;
        }

        // Pick a random line that isn't in the last 3 lines
        let nextIndex;
        let attempts = 0;
        do {
            nextIndex = Math.floor(Math.random() * RANDOM_LINES.length);
            attempts++;
        } while (lastLineIndicesRef.current.includes(nextIndex) && attempts < 20);

        // Update history
        const newHistory = [...lastLineIndicesRef.current, nextIndex];
        if (newHistory.length > 3) newHistory.shift();
        lastLineIndicesRef.current = newHistory;

        const randomLine = RANDOM_LINES[nextIndex];

        setCurrentMessage(randomLine);
        setCurrentState('talking');
        setShowBubble(true);
        setIsTyping(true);
    };

    // Talking animation: Toggle mouth open/closed while typing
    useEffect(() => {
        let mouthInterval: NodeJS.Timeout;

        if (isTyping) {
            // Start with mouth open
            setIsMouthOpen(true);

            // Toggle mouth every 150ms
            mouthInterval = setInterval(() => {
                setIsMouthOpen(prev => !prev);
            }, 150);
        } else {
            setIsMouthOpen(false);
        }

        return () => {
            if (mouthInterval) clearInterval(mouthInterval);
        };
    }, [isTyping]);

    // Blink animation
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setShouldBlink(true);
            setTimeout(() => setShouldBlink(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(blinkInterval);
    }, []);

    const handleTypingComplete = useCallback(() => {
        setIsTyping(false);
        setIsMouthOpen(false);

        // Return to idle/prop state after a delay if it was a random click
        // For tour messages, we might want to keep the bubble a bit longer or let user close it
        if (!showBubble) return; // Already closed

        // If we want him to stop "talking" body animation but keep bubble:
        if (currentState === 'talking') {
            setCurrentState(propState || 'idle');
        }
    }, [showBubble, currentState, propState]);

    if (!mounted) return null;

    const positions = {
        'bottom-right': 'fixed bottom-8 right-8 z-50',
        'bottom-left': 'fixed bottom-8 left-8 z-50',
        'top-left': 'fixed top-24 left-8 z-50'
    };

    const sizes = {
        'sm': 'w-32 h-32',
        'md': 'w-48 h-48',
        'lg': 'w-64 h-64'
    };

    const getImageForState = (s: MochiState, mouthOpen: boolean, blink: boolean) => {
        if (blink && s === 'idle') return '/mochi-blink.png';

        switch (s) {
            case 'teacher':
                return mouthOpen ? '/mochi-teacher-talking.png' : '/mochi-teacher.png';
            case 'coding':
                return '/mochi-coding.png';
            case 'success':
            case 'celebrating':
                return '/mochi-success.png';
            case 'thinking':
                return mouthOpen ? '/mochi-thinking-talking.png' : '/mochi-thinking.png';
            case 'sleeping':
                return '/mochi-sleeping-snot.png';
            case 'angry':
                return '/mochi-angry.png';
            case 'excited':
                return '/mochi-success.png';
            case 'pointing':
                return '/mochi-teacher.png';
            case 'talking':
                return mouthOpen ? '/mochi-talking.png' : '/mochi-idle.png';
            case 'waving':
                return '/mochi-idle.png';
            default:
                return mouthOpen ? '/mochi-talking.png' : '/mochi-idle.png';
        }
    };

    const variants = {
        idle: { y: [0, -6, 0], scaleY: [1, 1.02, 1], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
        talking: {
            y: [0, -8, 0],
            rotate: [0, -2, 2, 0],
            scale: [1, 1.05, 1],
            transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
        },
        waving: { rotate: [0, -10, 10, -10, 0], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } },
        pointing: { x: [0, 5, 0], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } },
        excited: { y: [0, -15, 0], scaleX: [1, 0.95, 1.05, 1], scaleY: [1, 1.05, 0.95, 1], transition: { duration: 0.5, repeat: Infinity } },
        success: { y: [0, -10, 0], scale: [1, 1.1, 1], rotate: [0, -5, 5, 0], transition: { duration: 0.8, repeat: Infinity, repeatDelay: 1 } },
        celebrating: { y: [0, -10, 0], scale: [1, 1.1, 1], rotate: [0, -5, 5, 0], transition: { duration: 0.8, repeat: Infinity, repeatDelay: 1 } },
        coding: { y: [0, 2, 0], transition: { duration: 0.2, repeat: Infinity } },
        thinking: { rotate: [0, 5, 0, -5, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
        teacher: { x: [0, 2, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
        sleeping: { scale: [1, 1.05, 1], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
        angry: { x: [-2, 2, -2, 2, 0], transition: { duration: 0.2, repeat: Infinity } }
    };

    // Determine which animation variant to use
    const getAnimationVariant = () => {
        if (isTyping) return 'talking';
        return currentState;
    };

    return (
        <div className={positions[currentPosition]}>
            <div className="relative">
                <AnimatePresence>
                    {showBubble && (
                        <SpeechBubble
                            messageEn={currentMessage.en}
                            messageCn={currentMessage.cn}
                            position={currentPosition}
                            onTypingComplete={handleTypingComplete}
                        />
                    )}
                </AnimatePresence>

                <motion.div
                    className={`${sizes[size]} cursor-pointer relative z-40 filter drop-shadow-2xl hover:scale-105 transition-transform duration-300`}
                    onClick={handleMochiClick}
                    variants={variants as any}
                    animate={getAnimationVariant()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <img
                        src={getImageForState(currentState, isMouthOpen, shouldBlink)}
                        alt="Mochi Mascot"
                        className="w-full h-full object-contain"
                        style={{
                            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))',
                            mixBlendMode: 'normal'
                        }}
                    />
                </motion.div>
            </div>
        </div>
    );
}
