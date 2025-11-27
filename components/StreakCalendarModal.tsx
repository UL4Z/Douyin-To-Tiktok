'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Calendar as CalendarIcon } from 'lucide-react';

interface StreakCalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentStreak: number;
}

export default function StreakCalendarModal({ isOpen, onClose, currentStreak }: StreakCalendarModalProps) {
    // Mock data generation based on current streak
    // In a real app, this would come from the backend
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    // Generate calendar days
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push({ day: 0, type: 'empty' });
    }

    for (let i = 1; i <= daysInMonth; i++) {
        // Mock logic: assume streak is contiguous ending today
        // Calculate if this day is part of the streak
        const date = new Date(today.getFullYear(), today.getMonth(), i);
        const diffTime = Math.abs(today.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If day is today or within streak range (mocked)
        // For demo purposes, let's just highlight the last 'currentStreak' days ending today
        // And maybe some random days before that to look realistic

        let isStreak = false;
        let isToday = i === today.getDate();

        // Simple mock: highlight today and previous (streak-1) days
        if (i <= today.getDate() && i > today.getDate() - currentStreak) {
            isStreak = true;
        }

        days.push({ day: i, type: 'day', isStreak, isToday });
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-md rounded-3xl p-6 pointer-events-auto shadow-2xl relative overflow-hidden">
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            {/* Header */}
                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                                        <Flame className="w-6 h-6 fill-current" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Streak Calendar</h2>
                                        <p className="text-white/40 text-xs font-bold uppercase tracking-wider">
                                            {currentStreak} Day Streak!
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="bg-black/20 rounded-2xl p-4 border border-white/5 relative z-10">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <span className="font-bold text-white">
                                        {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <CalendarIcon className="w-4 h-4 text-white/40" />
                                </div>

                                <div className="grid grid-cols-7 gap-2 mb-2">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                        <div key={i} className="text-center text-xs font-bold text-white/20 py-1">
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-2">
                                    {days.map((d, i) => {
                                        if (d.type === 'empty') return <div key={i} />;

                                        return (
                                            <div
                                                key={i}
                                                className={`
                                                    aspect-square rounded-xl flex items-center justify-center text-sm font-bold relative overflow-hidden transition-all
                                                    ${d.isStreak
                                                        ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] border border-orange-400/50'
                                                        : 'bg-white/5 text-white/40 border border-white/5'}
                                                    ${d.isToday && !d.isStreak ? 'border-primary text-primary' : ''}
                                                `}
                                            >
                                                {d.isStreak && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-yellow-400 opacity-80"
                                                    />
                                                )}
                                                <span className="relative z-10">{d.day}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer Message */}
                            <div className="mt-6 text-center relative z-10">
                                <p className="text-white/60 text-sm">
                                    Keep it up! You're on fire! 🔥
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
