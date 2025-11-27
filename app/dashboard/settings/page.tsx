'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, User, Moon, Shield, LogOut, ChevronRight, Smartphone, Globe } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function SettingsPage() {
    const { t } = useLanguage()
    const [notifications, setNotifications] = useState({ push: true, email: false })
    const [loading, setLoading] = useState(true)
    const [showUnlinkModal, setShowUnlinkModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/user/settings')
            if (res.ok) {
                const data = await res.json()
                setNotifications(data.notifications)
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateNotifications = async (key: string, value: boolean) => {
        const newSettings = { ...notifications, [key]: value }
        setNotifications(newSettings)
        try {
            await fetch('/api/user/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notifications: newSettings })
            })
        } catch (error) {
            console.error('Failed to update settings:', error)
        }
    }

    const handleUnlink = async () => {
        if (!confirm('Are you sure you want to unlink your TikTok account?')) return
        try {
            const res = await fetch('/api/user/unlink', { method: 'POST' })
            if (res.ok) {
                window.location.href = '/dashboard'
            }
        } catch (error) {
            console.error('Unlink failed:', error)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to DELETE your account? This is irreversible.')) return
        try {
            const res = await fetch('/api/user/delete', { method: 'DELETE' })
            if (res.ok) {
                window.location.href = '/'
            }
        } catch (error) {
            console.error('Delete failed:', error)
        }
    }

    if (loading) return <div className="text-white">Loading...</div>

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-white/40">Manage your account preferences</p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Account Section */}
                <SettingsSection title="Account" icon={<User className="w-6 h-6" />}>
                    <SettingsItem
                        icon={<Globe className="w-5 h-5" />}
                        label="Language"
                        value="English"
                        onClick={() => { }}
                    />
                    <SettingsItem
                        icon={<Smartphone className="w-5 h-5" />}
                        label="Connected Devices"
                        value="2 Active"
                        onClick={() => { }}
                    />
                </SettingsSection>

                {/* Notifications Section */}
                <SettingsSection title="Notifications" icon={<Bell className="w-6 h-6" />}>
                    <ToggleItem
                        label="Push Notifications"
                        description="Receive alerts on your device"
                        checked={notifications.push}
                        onChange={(val) => updateNotifications('push', val)}
                    />
                    <ToggleItem
                        label="Email Updates"
                        description="Get weekly performance reports"
                        checked={notifications.email}
                        onChange={(val) => updateNotifications('email', val)}
                    />
                </SettingsSection>

                {/* Appearance Section */}
                <SettingsSection title="Appearance" icon={<Moon className="w-6 h-6" />}>
                    <SettingsItem
                        icon={<Moon className="w-5 h-5" />}
                        label="Theme"
                        value="Dark Mode"
                        onClick={() => { }}
                    />
                </SettingsSection>

                {/* Danger Zone */}
                <div className="bg-red-500/5 border-2 border-red-500/20 rounded-3xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
                            <p className="text-white/40 text-sm">Irreversible actions</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/10">
                            <div>
                                <div className="font-bold text-white">Unlink TikTok Account</div>
                                <div className="text-xs text-white/40">Disconnect your TikTok profile</div>
                            </div>
                            <button
                                onClick={handleUnlink}
                                className="px-4 py-2 bg-bamboo-red/20 text-bamboo-red font-bold rounded-lg hover:bg-bamboo-red/30 transition-colors text-sm"
                            >
                                Unlink
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/10">
                            <div>
                                <div className="font-bold text-white">Delete Account</div>
                                <div className="text-xs text-white/40">Permanently delete all data</div>
                            </div>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-bamboo-red text-white font-bold rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SettingsSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="bg-[#0A0A0A] border-2 border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                    {icon}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    )
}

function SettingsItem({ icon, label, value, onClick }: { icon: React.ReactNode, label: string, value: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors group"
        >
            <div className="flex items-center gap-4">
                <div className="text-white/40 group-hover:text-bamboo transition-colors">
                    {icon}
                </div>
                <span className="font-bold">{label}</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
                <span className="text-sm font-medium">{value}</span>
                <ChevronRight className="w-5 h-5" />
            </div>
        </button>
    )
}

function ToggleItem({ label, description, checked, onChange }: { label: string, description: string, checked: boolean, onChange: (val: boolean) => void }) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors">
            <div>
                <div className="font-bold">{label}</div>
                <div className="text-xs text-white/40">{description}</div>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-bamboo' : 'bg-white/10'
                    }`}
            >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${checked ? 'left-6' : 'left-1'
                    }`} />
            </button>
        </div>
    )
}
