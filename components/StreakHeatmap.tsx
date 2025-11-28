'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Tooltip } from 'react-tooltip'

interface HeatmapData {
    date: string
    count: number
}

export default function StreakHeatmap() {
    const [data, setData] = useState<HeatmapData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/user/heatmap')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setData(data)
                }
            })
            .catch(err => console.error('Failed to fetch heatmap:', err))
            .finally(() => setLoading(false))
    }, [])

    // Generate last 365 days
    const days: string[] = []
    const today = new Date()
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        days.push(d.toISOString().split('T')[0])
    }

    const getColor = (count: number) => {
        if (count === 0) return 'bg-white/5'
        if (count <= 2) return 'bg-green-900/40'
        if (count <= 4) return 'bg-green-700/60'
        if (count <= 6) return 'bg-green-500/80'
        return 'bg-green-400'
    }

    if (loading) return <div className="h-32 bg-white/5 animate-pulse rounded-3xl" />

    return (
        <div className="bg-[#0A0A0A] border-2 border-white/10 rounded-3xl p-6 overflow-x-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-green-400">Activity</span>
                <span className="text-white/40 text-sm font-normal">Last 365 Days</span>
            </h3>

            <div className="flex gap-1 min-w-max">
                {/* We need to group by weeks for the vertical layout like GitHub */}
                {Array.from({ length: 53 }).map((_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const dayOfYearIndex = weekIndex * 7 + dayIndex
                            if (dayOfYearIndex >= days.length) return null

                            const date = days[dayOfYearIndex]
                            const dayData = data.find(d => d.date === date)
                            const count = dayData?.count || 0

                            return (
                                <div
                                    key={date}
                                    data-tooltip-id="heatmap-tooltip"
                                    data-tooltip-content={`${count} posts on ${date}`}
                                    className={`w-3 h-3 rounded-sm ${getColor(count)} hover:border hover:border-white/50 transition-colors`}
                                />
                            )
                        })}
                    </div>
                ))}
            </div>
            <Tooltip id="heatmap-tooltip" className="z-50 !bg-gray-800 !text-white !rounded-lg !text-xs !px-2 !py-1" />
        </div>
    )
}
