'use client';

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Globe, Zap, Shield } from 'lucide-react'
import { useLanguage } from './context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Home() {
    const { t } = useLanguage();
    const [platformIndex, setPlatformIndex] = useState(0);
    const platforms = ['TikTok', 'Instagram', 'Facebook', 'YouTube'];

    useEffect(() => {
        const interval = setInterval(() => {
            setPlatformIndex((prev) => (prev + 1) % platforms.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary selection:text-black font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/icon.png" alt="Mochi Mirror Logo" className="w-12 h-12 rounded-lg object-cover" />
                        <span className="font-bold text-xl tracking-tight">Mochi Mirror</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <Link
                            href="/login"
                            className="text-sm font-medium text-white/60 hover:text-white transition-colors"
                        >
                            {t.landing.nav_login}
                        </Link>
                        <Link
                            href="/login?mode=signup"
                            className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-all transform hover:scale-105 active:scale-95"
                        >
                            {t.landing.nav_signup}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-20 container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                            Douyin to <span className="relative inline-flex flex-col justify-center px-2 h-[1.2em] overflow-hidden align-bottom perspective-[1000px] align-text-bottom">
                                {/* Invisible spacer for width */}
                                <span className="opacity-0 relative z-0" aria-hidden="true">{platforms[platformIndex]}</span>

                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={platformIndex}
                                        initial={{ opacity: 0, rotateX: -90, y: '100%' }}
                                        animate={{ opacity: 1, rotateX: 0, y: 0 }}
                                        exit={{ opacity: 0, rotateX: 90, y: '-100%' }}
                                        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                                        className="absolute inset-0 z-10 text-white flex items-center justify-center"
                                    >
                                        {platforms[platformIndex]}
                                    </motion.span>
                                </AnimatePresence>
                                <motion.span
                                    layoutId="highlight"
                                    className="absolute inset-0 bg-primary -skew-y-2 rounded-lg -z-10"
                                />
                            </span> <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">{t.landing.hero_subtitle}</span>
                        </h1>
                        <p className="text-xl text-white/40 mb-12 max-w-2xl mx-auto leading-relaxed">
                            {t.landing.hero_desc}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link
                            href="/login?mode=signup"
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold text-lg rounded-2xl hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {t.landing.cta_start}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/login"
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-bold text-lg rounded-2xl hover:bg-white/10 border border-white/10 transition-all"
                        >
                            {t.landing.cta_login}
                        </Link>
                    </motion.div>

                    {/* Social Proof / Trust */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-20 pt-10 border-t border-white/5"
                    >
                        <p className="text-sm text-white/20 uppercase tracking-widest mb-8">
                            {t.landing.social_proof}
                        </p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale">
                            {/* Placeholders for logos */}
                            <div className="flex items-center gap-2 text-xl font-bold"><Globe className="w-6 h-6" /> GlobalReach</div>
                            <div className="flex items-center gap-2 text-xl font-bold"><Zap className="w-6 h-6" /> AutoSync</div>
                            <div className="flex items-center gap-2 text-xl font-bold"><Shield className="w-6 h-6" /> SecureAuth</div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Value Props */}
            <section className="py-32 border-t border-white/5 bg-white//[0.02]">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        <Feature
                            title={t.landing.feature_friction}
                            desc={t.landing.feature_friction_desc}
                        />
                        <Feature
                            title={t.landing.feature_translation}
                            desc={t.landing.feature_translation_desc}
                        />
                        <Feature
                            title={t.landing.feature_analytics}
                            desc={t.landing.feature_analytics_desc}
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-[#0A0A0A] pb-32 md:pb-12">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-white/40 text-sm">
                        © {new Date().getFullYear()} Mochi Mirror. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-white/40 hover:text-white text-sm transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-white/40 hover:text-white text-sm transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function Feature({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-white/40 leading-relaxed">{desc}</p>
        </div>
    )
}
