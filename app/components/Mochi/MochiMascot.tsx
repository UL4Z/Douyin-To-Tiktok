'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import ChatModal from './ChatModal';
import { useLanguage } from '../../context/LanguageContext';

type MochiState = 'idle' | 'talking' | 'waving' | 'excited' | 'success' | 'celebrating' | 'coding' | 'thinking' | 'teacher' | 'sleeping' | 'angry' | 'pointing';

interface MochiMascotProps {
    messageEn?: string;
    messageCn?: string;
    autoTalk?: boolean;
    state?: MochiState;
    className?: string;
}

const RANDOM_LINES = [
    { en: "Did you know? I run on bamboo and code! 🎋", cn: "你知道吗？我是靠竹子和代码运行的！🎋" },
    { en: "Need help? I'm just a click away!", cn: "需要帮助吗？点击我就行！" },
    { en: "Automating your content is my superpower! ⚡", cn: "自动化你的内容是我的超能力！⚡" },
    { en: "I'm watching your growth stats go up! 📈", cn: "我正在看着你的增长数据上升！📈" },
    { en: "Don't forget to hydrate while you create! 💧", cn: "创作时别忘了喝水！💧" },
    { en: "Is it time for a snack break yet? 🍪", cn: "是时候吃点零食了吗？🍪" },
    { en: "Your content is looking fire today! 🔥", cn: "你今天的内容看起来很火！🔥" },
    { en: "I love seeing your videos go viral! 🌟", cn: "我喜欢看你的视频爆火！🌟" },
];

const TUTORIAL_STEPS: Record<string, { en: string, cn: string, state: MochiState }[]> = {
    '/': [
        { en: "Hi! I'm Mochi, your AI assistant! 👋", cn: "嗨！我是 Mochi，你的 AI 助手！👋", state: 'waving' },
        { en: "I help you automate your content from Douyin to TikTok. 🚀", cn: "我帮你把内容从抖音自动化到 TikTok。🚀", state: 'excited' },
        { en: "Click 'Get Started' or 'Login' to begin! 🌟", cn: "点击“开始使用”或“登录”以开始！🌟", state: 'pointing' }
    ],
    '/login': [
        { en: "Welcome back! Or are you new here? 🤔", cn: "欢迎回来！还是你是新来的？🤔", state: 'thinking' },
        { en: "You can sign in with Google for instant access. ⚡", cn: "你可以使用 Google 快速登录。⚡", state: 'pointing' },
        { en: "Don't worry, your data is safe with me! 🛡️", cn: "别担心，你的数据在我这里很安全！🛡️", state: 'success' }
    ],
    '/dashboard': [
        { en: "This is your Dashboard! Command center ready! 🎮", cn: "这是你的仪表板！指挥中心准备就绪！🎮", state: 'teacher' },
        { en: "Connect your TikTok account to start syncing. 🔗", cn: "连接你的 TikTok 账号以开始同步。🔗", state: 'pointing' },
        { en: "Check 'Analytics' to see your growth explode! 💥", cn: "查看“分析”以见证你的增长爆发！💥", state: 'celebrating' }
    ],
    '/dashboard/analytics': [
        { en: "Look at all these numbers! 📊", cn: "看这些数字！📊", state: 'excited' },
        { en: "Here you can track your followers and likes. 📈", cn: "在这里你可以追踪你的粉丝和点赞。📈", state: 'teacher' },
        { en: "Keep posting to keep the streak alive! 🔥", cn: "坚持发布以保持连胜！🔥", state: 'success' }
    ],
    '/dashboard/profile': [
        { en: "This is you! Looking good! ✨", cn: "这是你！看起来不错！✨", state: 'waving' },
        { en: "You can see your achievements and stats here. 🏆", cn: "你可以在这里查看你的成就和统计数据。🏆", state: 'celebrating' },
        { en: "Don't forget to log out if you're on a public computer! 🔒", cn: "如果你在公共电脑上，别忘了退出登录！🔒", state: 'teacher' }
    ]
};

export default function MochiMascot({
    messageEn: propMessageEn,
    messageCn: propMessageCn,
    autoTalk = false,
    state: propState,
    className
}: MochiMascotProps) {
    const pathname = usePathname();
    const { language } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentState, setCurrentState] = useState<MochiState>('idle');
    const [currentMessage, setCurrentMessage] = useState({ en: '', cn: '' });
    const [isMouthOpen, setIsMouthOpen] = useState(false);
    const [shouldBlink, setShouldBlink] = useState(false);

    // Tutorial State
    const [tutorialStep, setTutorialStep] = useState(0);
    const [isTutorialActive, setIsTutorialActive] = useState(false);
    const [hasSeenTutorial, setHasSeenTutorial] = useState<Record<string, boolean>>({});

    // Track last few line indices to prevent repeats
    const lastLineIndicesRef = useRef<number[]>([]);

    useEffect(() => {
        setMounted(true);
        // Load tutorial history
        const saved = localStorage.getItem('mochi_tutorials');
        if (saved) {
            setHasSeenTutorial(JSON.parse(saved));
        }
    }, []);

    // Random Acts of Mochi (Idle Animations)
    useEffect(() => {
        if (!mounted || showModal || isTutorialActive) return;

        const idleStates: MochiState[] = ['idle', 'sleeping', 'coding', 'thinking', 'waving'];

        const randomEventInterval = setInterval(() => {
            // 30% chance to change state every 10 seconds if idle
            if (Math.random() > 0.7 && !showModal) {
                const randomState = idleStates[Math.floor(Math.random() * idleStates.length)];
                setCurrentState(randomState);

                // Reset to idle after a few seconds unless it's sleeping (which lasts longer)
                const duration = randomState === 'sleeping' ? 8000 : 4000;
                setTimeout(() => {
                    if (!showModal) setCurrentState('idle');
                }, duration);
            }
        }, 10000);

        return () => clearInterval(randomEventInterval);
    }, [mounted, showModal, isTutorialActive]);

    // Tutorial Logic
    useEffect(() => {
        if (!mounted) return;

        const steps = TUTORIAL_STEPS[pathname];
        const hasSeen = hasSeenTutorial[pathname];

        // If there are steps for this page and user hasn't seen them (or autoTalk is forced)
        if (steps && !hasSeen) {
            setIsTutorialActive(true);
            setTutorialStep(0);
            setCurrentMessage(steps[0]);
            setCurrentState(steps[0].state); // Set initial state from step
            setShowModal(true);
        } else if (propMessageEn && autoTalk) {
            // Fallback to prop message if provided
            setCurrentMessage({ en: propMessageEn, cn: propMessageCn || propMessageEn });
            setShowModal(true);
            setIsTutorialActive(false);
            setCurrentState(propState || 'talking');
        } else {
            setShowModal(false);
            setIsTutorialActive(false);
            // Don't force idle here, let the random idle logic take over or keep previous state
            if (currentState === 'idle') setCurrentState(propState || 'idle');
        }
    }, [pathname, mounted, propMessageEn, propMessageCn, autoTalk, propState, hasSeenTutorial]);

    const handleNextStep = () => {
        const steps = TUTORIAL_STEPS[pathname];
        if (!steps) return;

        if (tutorialStep < steps.length - 1) {
            const nextStep = tutorialStep + 1;
            setTutorialStep(nextStep);
            setCurrentMessage(steps[nextStep]);
            setCurrentState(steps[nextStep].state); // Update state for next step
        } else {
            completeTutorial();
        }
    };

    const completeTutorial = () => {
        setShowModal(false);
        setIsTutorialActive(false);
        setCurrentState('success'); // Celebrate completion
        setTimeout(() => setCurrentState('idle'), 3000);

        // Save to local storage
        const newHistory = { ...hasSeenTutorial, [pathname]: true };
        setHasSeenTutorial(newHistory);
        localStorage.setItem('mochi_tutorials', JSON.stringify(newHistory));
    };

    const handleMochiClick = () => {
        // If modal is open, close it
        if (showModal) {
            setShowModal(false);
            setIsTutorialActive(false);
            setCurrentState('idle');
            return;
        }

        // If tutorial exists for this page, restart it
        const steps = TUTORIAL_STEPS[pathname];
        if (steps) {
            setIsTutorialActive(true);
            setTutorialStep(0);
            setCurrentMessage(steps[0]);
            setCurrentState(steps[0].state);
            setShowModal(true);
            return;
        }

        // Otherwise, say something random
        let nextIndex;
        let attempts = 0;
        do {
            nextIndex = Math.floor(Math.random() * RANDOM_LINES.length);
            attempts++;
        } while (lastLineIndicesRef.current.includes(nextIndex) && attempts < 20);

        const newHistory = [...lastLineIndicesRef.current, nextIndex];
        if (newHistory.length > 3) newHistory.shift();
        lastLineIndicesRef.current = newHistory;

        const randomLine = RANDOM_LINES[nextIndex];
        setCurrentMessage(randomLine);
        setCurrentState('talking');
        setShowModal(true);
        setIsTutorialActive(false);
    };

    // Mouth animation when modal is open
    useEffect(() => {
        let mouthInterval: NodeJS.Timeout;
        if (showModal) {
            setIsMouthOpen(true);
            mouthInterval = setInterval(() => {
                setIsMouthOpen(prev => !prev);
            }, 200);
        } else {
            setIsMouthOpen(false);
        }
        return () => {
            if (mouthInterval) clearInterval(mouthInterval);
        };
    }, [showModal]);

    // Blink animation
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setShouldBlink(true);
            setTimeout(() => setShouldBlink(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(blinkInterval);
    }, []);

    if (!mounted) return null;

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

    const getAnimationVariant = () => {
        if (showModal) return 'talking';
        return currentState;
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 md:bottom-8 md:right-8 ${className}`}>
            <div className="relative">
                <ChatModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    message={language === 'cn' ? currentMessage.cn : currentMessage.en}
                    isTutorial={isTutorialActive}
                    step={tutorialStep}
                    totalSteps={TUTORIAL_STEPS[pathname]?.length || 0}
                    onNext={handleNextStep}
                    onSkip={completeTutorial}
                />

                <motion.div
                    className="w-24 h-24 md:w-48 md:h-48 cursor-pointer relative z-40 filter drop-shadow-2xl hover:scale-105 transition-transform duration-300"
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
