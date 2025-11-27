'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check } from 'lucide-react';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    step?: number;
    totalSteps?: number;
    onNext?: () => void;
    onSkip?: () => void;
    isTutorial?: boolean;
}

export default function ChatModal({
    isOpen,
    onClose,
    title = "Mochi says:",
    message,
    step = 0,
    totalSteps = 0,
    onNext,
    onSkip,
    isTutorial = false
}: ChatModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute bottom-full right-0 mb-4 w-[280px] md:w-[320px] z-50"
                >
                    <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-[#e5e5e5] relative">
                        {/* Tail */}
                        <div className="absolute -bottom-2.5 right-8 w-5 h-5 bg-white border-b-2 border-r-2 border-[#e5e5e5] transform rotate-45"></div>

                        {/* Header */}
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-[#afafaf] text-xs uppercase tracking-wider">
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-[#afafaf] hover:text-[#3c3c3c] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                            <p className="text-[#3c3c3c] font-bold text-lg leading-snug">
                                {message}
                            </p>
                        </div>

                        {/* Footer / Navigation */}
                        {isTutorial && (
                            <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                    {Array.from({ length: totalSteps }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full ${i === step ? 'bg-[#1cb0f6]' : 'bg-[#e5e5e5]'}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    {step < totalSteps - 1 ? (
                                        <>
                                            <button
                                                onClick={onSkip}
                                                className="text-[#afafaf] font-bold text-sm hover:text-[#3c3c3c] px-3 py-2"
                                            >
                                                Skip
                                            </button>
                                            <button
                                                onClick={onNext}
                                                className="bg-[#1cb0f6] text-white font-bold rounded-xl px-4 py-2 shadow-[0_4px_0_0_#1899d6] hover:bg-[#1899d6] active:shadow-none active:translate-y-[4px] transition-all flex items-center gap-1"
                                            >
                                                Next <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={onClose}
                                            className="bg-[#58cc02] text-white font-bold rounded-xl px-6 py-2 shadow-[0_4px_0_0_#46a302] hover:bg-[#46a302] active:shadow-none active:translate-y-[4px] transition-all flex items-center gap-1"
                                        >
                                            Got it! <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
