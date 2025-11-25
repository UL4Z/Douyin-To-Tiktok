'use client';

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react'

export default function Home() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''

    return (
        <main className="min-h-screen bg-gradient-to-br from-secondary via-surface to-secondary text-accent">
            {/* Header Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-white/5 shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-xl font-bold gradient-text">
                        Douyin↔TikTok
                    </div>
                    <Link
                        href="/login"
                        className="px-6 py-2 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                    >
                        Login
                    </Link>
                </div>
            </nav>

            {/* Hero Section with gradient background */}
            <section className="container mx-auto px-6 py-20 mt-16 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-orange-900/20 rounded-3xl -z-10" />
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-6xl font-bold mb-6 text-accent"
                    >
                        <span className="gradient-text">Douyin to TikTok</span>
                        <br />
                        <span className="text-accent-light">Content Bridge</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-accent-light mb-12 max-w-2xl mx-auto"
                    >
                        Automatically transfer and repurpose your Douyin (抖音) content for English-speaking
                        audiences on TikTok. Seamless automation, customizable branding, zero manual work.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex gap-4 justify-center"
                    >
                        <Link
                            href="/login?mode=signup"
                            className="group px-8 py-4 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#features"
                            className="px-8 py-4 border-2 border-accent-light/20 text-accent font-semibold rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                        >
                            Learn More
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section with enhanced cards */}
            <section id="features" className="container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                >
                    <FeatureCard
                        icon={<Zap className="w-10 h-10" />}
                        title="Automated Transfer"
                        description="Monitors your Douyin profile and automatically downloads, optimizes, and publishes to TikTok"
                        color="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 text-blue-400"
                    />
                    <FeatureCard
                        icon={<Sparkles className="w-10 h-10" />}
                        title="Brand Consistency"
                        description="Customize captions, hashtags, and posting schedules to maintain your unique brand voice"
                        color="bg-gradient-to-br from-pink-900/50 to-rose-900/50 text-pink-400"
                    />
                    <FeatureCard
                        icon={<TrendingUp className="w-10 h-10" />}
                        title="Growth Analytics"
                        description="Track your TikTok growth with detailed analytics and performance insights"
                        color="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 text-purple-400"
                    />
                    <FeatureCard
                        icon={<Zap className="w-10 h-10" />}
                        title="Smart Scheduling"
                        description="Post at optimal times with random, scheduled, or immediate publishing options"
                        color="bg-gradient-to-br from-orange-900/50 to-amber-900/50 text-orange-400"
                    />
                    <FeatureCard
                        icon={<Sparkles className="w-10 h-10" />}
                        title="Global Reach"
                        description="Expand from Chinese to English-speaking markets without manual re-uploading"
                        color="bg-gradient-to-br from-green-900/50 to-emerald-900/50 text-green-400"
                    />
                    <FeatureCard
                        icon={<Shield className="w-10 h-10" />}
                        title="Secure & Private"
                        description="OAuth 2.0 authentication, encrypted tokens, and full data privacy"
                        color="bg-gradient-to-br from-red-900/50 to-pink-900/50 text-red-400"
                    />
                </motion.div>
            </section>

            {/* CTA Section with gradient */}
            <section className="container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 via-surface to-secondary rounded-2xl p-12 text-center border border-primary/20 card-shadow"
                >
                    <h2 className="text-4xl font-bold mb-4 gradient-text">
                        Ready to Go Global?
                    </h2>
                    <p className="text-accent-light mb-8 text-lg">
                        Join creators who are expanding their reach with automated content transfer
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        Start Automation Now
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </section>
        </main>
    )
}

function FeatureCard({ icon, title, description, color }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-surface p-6 rounded-2xl border border-gray-200 hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer group"
        >
            <motion.div
                className={`w-16 h-16 rounded-xl ${color} p-3 mb-4 group-hover:scale-110 transition-transform flex items-center justify-center shadow-lg`}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    {icon}
                </div>
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-accent">{title}</h3>
            <p className="text-accent-light">{description}</p>
        </motion.div>
    )
}
