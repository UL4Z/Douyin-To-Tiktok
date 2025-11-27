'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TikTokLoader from '../components/TikTokLoader'
import { motion } from 'framer-motion'
import { Check, Plus, RefreshCw, AlertCircle, Zap, TrendingUp, Shield, Flame, Clock, ArrowRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import Link from 'next/link'

interface ProfileData {
    display_name: string
    avatar: string | null
    follower_count: number
    following_count: number
    likes_count: number
    video_count: number
    bio_description: string
    is_verified: boolean
    discord_username?: string | null
    is_tiktok_connected: boolean
    streak?: number
}

function DashboardContent() {
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { t } = useLanguage()

    const [manualCode, setManualCode] = useState('')
    const [connecting, setConnecting] = useState(false)
    const searchParams = useSearchParams()
    const codeParam = searchParams.get('code')

    useEffect(() => {
        fetchProfile()
    }, [])

    useEffect(() => {
        if (codeParam && !profile && !connecting) {
            handleAutoConnect(codeParam)
        }
    }, [codeParam, profile])

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
                credentials: 'include'
            })

            if (res.status === 401) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('⚠️ Auth failed (401), but using mock data for development')
                    throw new Error('Unauthorized (Mock fallback)')
                }
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/tiktok`
                return
            }

            if (!res.ok) {
                throw new Error('Failed to fetch profile')
            }

            const data = await res.json()
            setProfile(data)
        } catch (err) {
            console.error('Profile fetch failed:', err)
            if (process.env.NODE_ENV === 'development') {
                console.log('⚠️ Using mock profile data for development')
                setProfile({
                    display_name: 'Dev User',
                    avatar: null,
                    follower_count: 12500,
                    following_count: 42,
                    likes_count: 50000,
                    video_count: 128,
                    bio_description: 'Mock profile for offline testing 🛠️',
                    is_verified: true,
                    discord_username: 'DevDiscord#1234',
                    is_tiktok_connected: false,
                    streak: 5
                })
            } else {
                setError(err instanceof Error ? err.message : 'Unknown error')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleAutoConnect = async (code: string) => {
        setConnecting(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/tiktok/manual`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
                credentials: 'include'
            })

            if (res.ok) {
                router.replace('/dashboard')
                fetchProfile()
            } else {
                const data = await res.json()
                if (data.code === 'TIKTOK_ACCOUNT_ALREADY_LINKED') {
                    setError(t.errors.tiktok_linked)
                } else {
                    setError(data.details ? `${data.error}: ${data.details}` : (data.error || t.errors.connection_failed))
                }
            }
        } catch (err) {
            setError(t.errors.connection_failed)
        } finally {
            setConnecting(false)
        }
    }

    const handleConnectTikTok = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/tiktok`
    }

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <TikTokLoader />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t.dashboard.title}</h1>
                    <p className="text-white/40">{t.dashboard.subtitle}</p>
                </div>
                {profile && (
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black font-bold">
                            {profile.display_name.charAt(0)}
                        </div>
                        <span className="font-bold">{profile.display_name}</span>
                    </div>
                )}
            </div>

            {/* Error Banner */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400"
                >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </motion.div>
            )}

            {/* Main Feed */}
            <div className="grid gap-6">
                {/* Streak Card */}
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/30 rounded-3xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500 text-black flex items-center justify-center">
                            <Flame className="w-8 h-8 fill-black" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-orange-400">{profile?.streak || 0} Day Streak!</h3>
                            <p className="text-white/40">You're on fire! Keep it up.</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-400 transition-colors">
                        View Calendar
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* 1. TikTok Connection Card */}
                    <Card
                        title={t.dashboard.connect_tiktok}
                        description={profile?.is_tiktok_connected ? t.dashboard.connected_desc : t.dashboard.connect_desc}
                        icon={<Zap className="w-6 h-6" />}
                        status={profile?.is_tiktok_connected ? 'completed' : 'active'}
                    >
                        {profile?.is_tiktok_connected ? (
                            <div className="flex items-center gap-2 text-green-400 font-bold bg-green-400/10 px-4 py-2 rounded-xl w-fit">
                                <Check className="w-5 h-5" />
                                {t.dashboard.connected_status}
                            </div>
                        ) : (
                            <button
                                onClick={handleConnectTikTok}
                                disabled={connecting}
                                className="bg-primary text-black font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 w-full justify-center"
                            >
                                {connecting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                {t.dashboard.connect_tiktok}
                            </button>
                        )}
                    </Card>

                    {/* 2. Analytics Snapshot */}
                    <Card
                        title={t.dashboard.analytics_title}
                        description={t.dashboard.analytics_desc}
                        icon={<TrendingUp className="w-6 h-6" />}
                        status={profile?.is_tiktok_connected ? 'active' : 'locked'}
                    >
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <StatBox label={t.dashboard.followers} value={profile?.follower_count || 0} />
                            <StatBox label={t.dashboard.likes} value={profile?.likes_count || 0} />
                        </div>
                        <Link
                            href="/dashboard/analytics"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm uppercase tracking-wide transition-colors"
                        >
                            View Full Report
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#0A0A0A] border-2 border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Recent Activity</h3>
                    </div>

                    <div className="space-y-4">
                        <ActivityItem
                            icon={<Check className="w-4 h-4" />}
                            title="Profile Synced"
                            time="2 minutes ago"
                            color="green"
                        />
                        <ActivityItem
                            icon={<Zap className="w-4 h-4" />}
                            title="Automation Started"
                            time="1 hour ago"
                            color="yellow"
                        />
                        <ActivityItem
                            icon={<Shield className="w-4 h-4" />}
                            title="Security Check Passed"
                            time="5 hours ago"
                            color="blue"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function Card({ title, description, icon, children, status = 'active' }: {
    title: string,
    description: string,
    icon: React.ReactNode,
    children: React.ReactNode,
    status?: 'active' | 'completed' | 'locked'
}) {
    const isLocked = status === 'locked';

    return (
        <div className={`
            relative p-6 rounded-3xl border-2 transition-all h-full flex flex-col
            ${status === 'completed' ? 'bg-[#0A0A0A] border-white/10' : ''}
            ${status === 'active' ? 'bg-white/5 border-primary/50 shadow-[0_4px_0_0_rgba(var(--primary-rgb),0.5)]' : ''}
            ${status === 'locked' ? 'bg-[#0A0A0A] border-white/5 opacity-50' : ''}
        `}>
            <div className="flex items-start gap-4 mb-4">
                <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0
                    ${status === 'completed' ? 'bg-green-500 text-black' : ''}
                    ${status === 'active' ? 'bg-primary text-black' : ''}
                    ${status === 'locked' ? 'bg-white/10 text-white/40' : ''}
                `}>
                    {status === 'completed' ? <Check className="w-6 h-6" /> : icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-1">{title}</h3>
                    <p className="text-white/40 text-sm">{description}</p>
                </div>
            </div>
            <div className="mt-auto">
                {!isLocked && children}
            </div>
        </div>
    )
}

function StatBox({ label, value }: { label: string, value: number }) {
    return (
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <div className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</div>
            <div className="text-xl font-bold font-mono">{value.toLocaleString()}</div>
        </div>
    )
}

function ActivityItem({ icon, title, time, color }: { icon: React.ReactNode, title: string, time: string, color: 'green' | 'yellow' | 'blue' }) {
    const colors = {
        green: 'bg-green-500/20 text-green-400',
        yellow: 'bg-yellow-500/20 text-yellow-400',
        blue: 'bg-blue-500/20 text-blue-400'
    }

    return (
        <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
                    {icon}
                </div>
                <span className="font-medium group-hover:text-white transition-colors text-white/80">{title}</span>
            </div>
            <span className="text-sm text-white/40">{time}</span>
        </div>
    )
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <DashboardContent />
        </Suspense>
    )
}
