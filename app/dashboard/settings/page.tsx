'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, User, Moon, Shield, LogOut, ChevronRight, Smartphone, Globe, Monitor } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function SettingsPage() {
    const { t, language, setLanguage } = useLanguage()
    const [notifications, setNotifications] = useState({ push: true, email: false })
    const [loading, setLoading] = useState(true)
    const [showUnlinkModal, setShowUnlinkModal] = useState(false)
    const [username, setUsername] = useState('')
    const [devices, setDevices] = useState<any[]>([])
    const [theme, setTheme] = useState('dark')

    useEffect(() => {
        fetchSettings()
        fetchDevices()
        fetchProfile()
        setTheme(localStorage.getItem('theme') || 'dark')
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile')
            if (res.ok) {
                const data = await res.json()
                if (data.username) setUsername(data.username)
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err)
        }
    }

    const fetchDevices = async () => {
        try {
            const res = await fetch('/api/user/devices')
            if (res.ok) {
                const data = await res.json()
                setDevices(data)
            }
        } catch (error) {
            console.error('Failed to fetch devices:', error)
        }
    }

    const handleUpdateUsername = async () => {
        try {
            const res = await fetch('/api/user/username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            })
            if (res.ok) {
                alert('Username updated!')
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to update username')
            }
        } catch (err) {
            console.error('Failed to update username:', err)
        }
    }

    const handleRemoveDevice = async (id: number) => {
        if (!confirm('Are you sure you want to remove this device?')) return
        try {
            const res = await fetch('/api/user/devices', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            if (res.ok) {
                fetchDevices()
            }
        } catch (err) {
            console.error('Failed to remove device:', err)
        }
    }

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-accent mb-2">Settings</h1>
                    <p className="text-accent/40 text-sm md:text-base">Manage your account preferences</p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Account Section */}
                <SettingsSection title="Account" icon={<User className="w-6 h-6" />}>
                    <SettingsItem
                        icon={<Globe className="w-5 h-5" />}
                        label="Language"
                        value={language === 'en' ? 'English' : '中文'}
                        onClick={() => setLanguage(language === 'en' ? 'cn' : 'en')}
                    />


                    {/* Connected Devices */}
                    <div className="p-4 border-t border-white/5 mt-2">
                        <div className="flex items-center gap-2 mb-3 text-sm font-bold text-white/60">
                            <Smartphone className="w-4 h-4" />
                            Connected Devices
                        </div>
                        <div className="space-y-2">
                            {devices.length > 0 ? (
                                devices.map((device) => (
                                    <div key={device.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white/5 rounded-xl gap-3">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                                {device.type === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm truncate">{device.device_name}</div>
                                                <div className="text-xs text-white/40 truncate">
                                                    {device.ip_address} • {new Date(device.last_active).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveDevice(device.id)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors self-end sm:self-center"
                                            title="Revoke Access"
                                        >
                                            <LogOut className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-white/40 text-sm italic">No devices found</div>
                            )}
                        </div>
                    </div>
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
                        value={theme === 'light' ? 'Light Mode' : 'Dark Mode'}
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

                    function ToggleItem({label, description, checked, onChange}: {label: string, description: string, checked: boolean, onChange: (val: boolean) => void }) {
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
