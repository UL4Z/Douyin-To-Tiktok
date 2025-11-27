'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Clock, Play, Pause, Settings, Calendar, Zap, AlertCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AutomationPage() {
    const [automationEnabled, setAutomationEnabled] = useState(false)
    const [schedule, setSchedule] = useState(['09:00', '14:00', '19:00'])
    const { t } = useLanguage()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Automation Center</h1>
                    <p className="text-white/40">Manage your bot's activity and schedule</p>
                </div>
                <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${automationEnabled
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${automationEnabled ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                    <span className="font-bold uppercase text-sm">
                        {automationEnabled ? 'Active' : 'Paused'}
                    </span>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Main Control Card */}
                <div className="bg-[#0A0A0A] border-2 border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-start gap-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-colors ${automationEnabled ? 'bg-primary text-black' : 'bg-white/10 text-white/40'
                                }`}>
                                <Bot className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Bot Status</h2>
                                <p className="text-white/40 max-w-md">
                                    {automationEnabled
                                        ? 'Your bot is currently active and will post according to your schedule.'
                                        : 'Automation is paused. No actions will be taken until you resume.'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setAutomationEnabled(!automationEnabled)}
                            className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 active:scale-95 ${automationEnabled
                                    ? 'bg-white/10 text-white hover:bg-white/20'
                                    : 'bg-primary text-black hover:bg-primary/90 shadow-[0_4px_0_0_rgba(var(--primary-rgb),0.5)]'
                                }`}
                        >
                            {automationEnabled ? (
                                <>
                                    <Pause className="w-6 h-6" />
                                    Pause Automation
                                </>
                            ) : (
                                <>
                                    <Play className="w-6 h-6" />
                                    Start Automation
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Schedule Card */}
                    <div className="bg-[#0A0A0A] border-2 border-white/10 rounded-3xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Posting Schedule</h3>
                                <p className="text-white/40 text-sm">When your bot is active</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {schedule.map((time, index) => (
                                <div key={index} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => {
                                            const newSchedule = [...schedule]
                                            newSchedule[index] = e.target.value
                                            setSchedule(newSchedule)
                                        }}
                                        className="bg-transparent text-xl font-mono font-bold text-white focus:outline-none flex-1"
                                    />
                                    <button
                                        onClick={() => {
                                            const newSchedule = schedule.filter((_, i) => i !== index)
                                            setSchedule(newSchedule)
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setSchedule([...schedule, '12:00'])}
                                className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-white/40 font-bold hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add Time Slot
                            </button>
                        </div>
                    </div>

                    {/* Configuration Card */}
                    <div className="bg-[#0A0A0A] border-2 border-white/10 rounded-3xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Configuration</h3>
                                <p className="text-white/40 text-sm">Bot behavior settings</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <ConfigToggle
                                label="Auto-Reply to Comments"
                                description="Use AI to reply to comments on your videos"
                                enabled={true}
                            />
                            <ConfigToggle
                                label="Cross-Platform Posting"
                                description="Automatically post to Instagram Reels"
                                enabled={false}
                            />
                            <ConfigToggle
                                label="Smart Hashtags"
                                description="Generate trending hashtags for posts"
                                enabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ConfigToggle({ label, description, enabled }: { label: string, description: string, enabled: boolean }) {
    const [isOn, setIsOn] = useState(enabled)

    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <div>
                <div className="font-bold mb-1">{label}</div>
                <div className="text-xs text-white/40">{description}</div>
            </div>
            <button
                onClick={() => setIsOn(!isOn)}
                className={`w-12 h-7 rounded-full transition-colors relative ${isOn ? 'bg-primary' : 'bg-white/10'
                    }`}
            >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${isOn ? 'left-6' : 'left-1'
                    }`} />
            </button>
        </div>
    )
}

function Plus({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}
