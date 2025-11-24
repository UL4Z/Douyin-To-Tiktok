'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import Link from 'next/link'

interface AnalyticsData {
    date: string
    followers: number
    likes: number
    views: number
}

// Mock data for now - will be replaced with real API data
const MOCK_DATA: AnalyticsData[] = [
    { date: 'Mon', followers: 1200, likes: 4500, views: 12000 },
    { date: 'Tue', followers: 1250, likes: 4800, views: 15000 },
    { date: 'Wed', followers: 1400, likes: 5200, views: 18000 },
    { date: 'Thu', followers: 1450, likes: 5900, views: 22000 },
    { date: 'Fri', followers: 1600, likes: 6500, views: 28000 },
    { date: 'Sat', followers: 1800, likes: 7200, views: 35000 },
    { date: 'Sun', followers: 2100, likes: 8500, views: 42000 },
]

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData[]>(MOCK_DATA)
    const [timeRange, setTimeRange] = useState('7d')

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            ← Back
                        </Link>
                        <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
                    </div>

                    <div className="flex gap-2 bg-tiktok-dark-card p-1 rounded-lg border border-gray-800">
                        {['24h', '7d', '30d', '90d'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${timeRange === range
                                        ? 'bg-gray-700 text-white shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid gap-8">
                    {/* Follower Growth */}
                    <div className="bg-tiktok-dark-card p-6 rounded-2xl border border-gray-800">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="text-2xl">👥</span> Follower Growth
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
                                        contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '8px' }}
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
                        <div className="bg-tiktok-dark-card p-6 rounded-2xl border border-gray-800">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="text-2xl">❤️</span> Total Likes
                            </h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="date" stroke="#888" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#888" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="likes"
                                            stroke="#ff0050"
                                            strokeWidth={3}
                                            dot={{ fill: '#ff0050', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Views */}
                        <div className="bg-tiktok-dark-card p-6 rounded-2xl border border-gray-800">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="text-2xl">👁️</span> Video Views
                            </h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="date" stroke="#888" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#888" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="views"
                                            stroke="#ffffff"
                                            strokeWidth={3}
                                            dot={{ fill: '#ffffff', strokeWidth: 2 }}
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
