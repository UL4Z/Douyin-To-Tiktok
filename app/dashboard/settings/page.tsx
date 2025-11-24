'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
    const [automationEnabled, setAutomationEnabled] = useState(false)
    const [schedule, setSchedule] = useState(['09:00', '14:00', '19:00'])

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/dashboard"
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        ← Back
                    </Link>
                    <h1 className="text-3xl font-bold gradient-text">Settings & Automation</h1>
                </div>

                <div className="grid gap-8">
                    {/* Automation Control */}
                    <div className="bg-tiktok-dark-card p-8 rounded-2xl border border-gray-800">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                    <span className="text-2xl">🤖</span> Automation Status
                                </h2>
                                <p className="text-gray-400">
                                    {automationEnabled ? 'Bot is currently running' : 'Bot is stopped'}
                                </p>
                            </div>
                            <button
                                onClick={() => setAutomationEnabled(!automationEnabled)}
                                className={`px-8 py-3 rounded-xl font-bold transition-all ${automationEnabled
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                                        : 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                                    }`}
                            >
                                {automationEnabled ? 'Stop Automation' : 'Start Automation'}
                            </button>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-tiktok-dark-card p-8 rounded-2xl border border-gray-800">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="text-2xl">⏰</span> Posting Schedule
                        </h2>
                        <div className="space-y-4">
                            {schedule.map((time, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => {
                                            const newSchedule = [...schedule]
                                            newSchedule[index] = e.target.value
                                            setSchedule(newSchedule)
                                        }}
                                        className="bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-tiktok-cyan focus:outline-none"
                                    />
                                    <button
                                        onClick={() => {
                                            const newSchedule = schedule.filter((_, i) => i !== index)
                                            setSchedule(newSchedule)
                                        }}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setSchedule([...schedule, '12:00'])}
                                className="text-tiktok-cyan hover:text-cyan-300 text-sm font-medium"
                            >
                                + Add Time Slot
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-900/10 p-8 rounded-2xl border border-red-900/30">
                        <h2 className="text-xl font-semibold mb-6 text-red-400">Danger Zone</h2>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-red-900/20">
                                <div>
                                    <h3 className="font-medium text-gray-200">Unlink Discord Account</h3>
                                    <p className="text-sm text-gray-500">Remove the link to your Discord account</p>
                                </div>
                                <button className="px-4 py-2 text-sm bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors">
                                    Unlink
                                </button>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-red-900/20">
                                <div>
                                    <h3 className="font-medium text-gray-200">Delete Account</h3>
                                    <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                                </div>
                                <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
