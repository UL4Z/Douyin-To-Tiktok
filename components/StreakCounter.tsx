'use client';

import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import StreakCalendarModal from './StreakCalendarModal';

interface StreakCounterProps {
    streak: number;
    className?: string;
}

export default function StreakCounter({ streak, className = '' }: StreakCounterProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center gap-1 hover:bg-white/5 rounded-lg px-2 py-1 transition-colors ${className}`}
            >
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -5, 5, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Flame
                        className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`}
                    />
                </motion.div>
                <span className={`font-bold font-mono ${streak > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                    {streak}
                </span>
            </button>

            <StreakCalendarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentStreak={streak}
            />
        </>
    );
}
