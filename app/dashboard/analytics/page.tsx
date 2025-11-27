'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import BambooLoader from '@/components/BambooLoader'
import { Lock, ArrowLeft } from 'lucide-react'

interface AnalyticsData {
    date: string
    followers: number
    likes: number
    views: number
}

// Mock data generator based on real profile stats if available, otherwise generic mock
const generateMockData = (baseFollowers: number = 1000, days: number = 7): AnalyticsData[] => {
    const data: AnalyticsData[] = [];
    let currentFollowers = baseFollowers;
    let currentLikes = baseFollowers * 5;
    let currentViews = baseFollowers * 15;

    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));

        // Add some random growth
        currentFollowers += Math.floor(Math.random() * 50);
        currentLikes += Math.floor(Math.random() * 200);
        currentViews += Math.floor(Math.random() * 1000);

        data.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            followers: currentFollowers,
            likes: currentLikes,
            views: currentViews
        });
    }
    return data;
}

export default function AnalyticsPage() {
    const { t } = useLanguage();
    const [data, setData] = useState<AnalyticsData[]>([])
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
    const [loading, setLoading] = useState(true)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        // Fetch profile to check connection status
        fetch('/api/user/profile')
            .then(res => res.json())
            .then(profile => {
                if (profile.is_tiktok_connected) {
                    setIsConnected(true);
                    // In a real app, we would fetch real analytics here
                    // For now, generate mock data based on their follower count
                    setData(generateMockData(profile.follower_count, 7));
                } else {
                    setIsConnected(false);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // Regenerate data when time range changes (mock logic)
    useEffect(() => {
        if (!isConnected) return;
        const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        // Re-fetch or re-generate
        // For demo, just keeping the initial data or regenerating if we had real params
    }, [timeRange, isConnected]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <BambooLoader />
            </div>
        )
    }

    if (!isConnected) {
        return (
            <div className="min-h-screen p-8 flex flex-col items-center justify-center text-center">
                <div className="bg-[#1f1f1f] p-12 rounded-3xl border-2 border-white/10 max-w-md w-full">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-white/20" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{t.analytics.connect_prompt}</h2>
                    <Link
                        href="/dashboard"
                        className="inline-block bg-primary text-black font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-all transform hover:scale-105"
                    >
                        {t.analytics.connect_btn}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link
                            href="/dashboard"
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-3xl font-bold">{t.analytics.header}</h1>
                    </div>

                    <div className="flex gap-2 bg-[#1f1f1f] p-1 rounded-xl border border-white/10">
                        {(['24h', '7d', '30d', '90d'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeRange === range
                                    ? 'bg-white/10 text-primary shadow-sm'
                                    : 'text-white/40 hover:text-white'
                                    }`}
                            >
                                {t.analytics.time_ranges[range]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid gap-8">
                    {/* Follower Growth */}
                    <div className="bg-[#1f1f1f] p-6 rounded-3xl border-2 border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="text-2xl">👥</span> {t.analytics.follower_growth}
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00f2ea" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00f2ea" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="date" stroke="#888" axisLine={false} tickLine={false} />
                                    <YAxis stroke="#888" axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="followers"
                                        stroke="#00f2ea"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorFollowers)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Engagement Metrics */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Likes */}
                        <div className="bg-[#1f1f1f] p-6 rounded-3xl border-2 border-white/10">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="text-2xl">❤️</span> {t.analytics.total_likes}
                            </h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="date" stroke="#888" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#888" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="likes"
                                            stroke="#ff0050"
                                            strokeWidth={3}
                                            dot={{ fill: '#ff0050', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Views */}
                        <div className="bg-[#1f1f1f] p-6 rounded-3xl border-2 border-white/10">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="text-2xl">👁️</span> {t.analytics.video_views}
                            </h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="date" stroke="#888" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#888" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="views"
                                            stroke="#ffffff"
                                            strokeWidth={3}
                                            dot={{ fill: '#ffffff', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
