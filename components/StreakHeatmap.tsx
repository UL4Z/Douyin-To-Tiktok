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

    // Generate last 180 days (approx 6 months)
    const days: string[] = []
    const today = new Date()
    for (let i = 179; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        days.push(d.toISOString().split('T')[0])
    }

    const getColor = (count: number) => {
        if (count === 0) return 'bg-accent/5'
        if (count <= 2) return 'bg-orange-200/40'
        if (count <= 4) return 'bg-orange-400/60'
        if (count <= 6) return 'bg-orange-500/80'
        return 'bg-[#FF5E3A]' // Primary Red Panda color
    }

    if (loading) return <div className="h-32 bg-accent/5 animate-pulse rounded-3xl" />

    return (
        <div className="bg-secondary border-2 border-white/10 rounded-3xl p-6 overflow-x-auto card-shadow">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-accent">
                <span className="text-[#FF5E3A]">Activity</span>
                <span className="text-accent/40 text-sm font-normal">Last 6 Months</span>
            </h3>

            <div className="flex gap-1.5 min-w-max">
                {/* We need to group by weeks for the vertical layout like GitHub */}
                {Array.from({ length: 26 }).map((_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1.5">
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
                                    className={`w-3.5 h-3.5 rounded-md ${getColor(count)} hover:scale-110 transition-transform cursor-default`}
                                />
                            )
                        })}
                    </div>
                ))}
            </div>
            <Tooltip id="heatmap-tooltip" className="z-50 !bg-secondary !text-accent !border !border-white/10 !rounded-xl !text-xs !px-3 !py-2 !shadow-xl" />
        </div>
    )
}
