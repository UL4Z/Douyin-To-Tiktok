'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TikTokLoader from '../components/TikTokLoader'

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
}

export default function Dashboard() {
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const [manualCode, setManualCode] = useState('')
    const [connecting, setConnecting] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            // In development, we might want to skip the API call entirely if we know it's offline
            // But let's try it, and fallback if it fails.

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
                credentials: 'include'
            })

            if (res.status === 401) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('⚠️ Auth failed (401), but using mock data for development')
                    throw new Error('Unauthorized (Mock fallback)')
                }
                // Not authenticated, redirect to OAuth
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
            // Mock data for offline development
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
                    discord_username: 'DevDiscord#1234'
                })
            } else {
                setError(err instanceof Error ? err.message : 'Unknown error')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })
            router.push('/')
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }

    const handleUnlinkTikTok = async () => {
        if (!confirm('Are you sure you want to unlink your TikTok account? This will remove all your data.')) return
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/tiktok/unlink`, {
                method: 'POST',
                credentials: 'include'
            })
            if (res.ok) {
                router.push('/')
            } else {
                alert('Failed to unlink TikTok')
            }
        } catch (err) {
            console.error('Unlink failed:', err)
            alert('Failed to unlink TikTok')
        }
    }

    const handleUnlinkDiscord = async () => {
        if (!confirm('Are you sure you want to unlink your Discord account?')) return
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/discord/unlink`, {
                method: 'POST',
                credentials: 'include'
            })
            if (res.ok) {
                // Refresh to show updated state
                fetchProfile()
            } else {
                alert('Failed to unlink Discord')
            }
        } catch (err) {
            console.error('Unlink failed:', err)
            alert('Failed to unlink Discord')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <TikTokLoader />
                    <p className="text-gray-400 mt-4">Loading your profile...</p>
                </div>
            </div>
        )
    }



    const handleManualConnect = async () => {
        if (!manualCode) return
        setConnecting(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/tiktok/manual`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: manualCode }),
                credentials: 'include'
            })

            if (res.ok) {
                window.location.reload()
            } else {
                const data = await res.json()
                setError(data.error || 'Connection failed')
            }
        } catch (err) {
            setError('Connection failed')
        } finally {
            setConnecting(false)
        }
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-tiktok-dark-card border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold gradient-text mb-2">Connect TikTok</h1>
                        <p className="text-gray-400">Sandbox Mode: Manual Connection Required</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                            <h3 className="font-semibold mb-2 text-tiktok-cyan">Step 1: Authorize</h3>
                            <p className="text-sm text-gray-400 mb-3">
                                Click below to open TikTok authorization in a new tab.
                            </p>
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/tiktok`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 bg-gray-800 hover:bg-gray-700 text-center rounded-lg transition-colors font-medium"
                            >
                                Open Authorization ↗
                            </a>
                        </div>

                        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                            <h3 className="font-semibold mb-2 text-tiktok-pink">Step 2: Enter Code</h3>
                            <p className="text-sm text-gray-400 mb-3">
                                Copy the <code>code</code> from the URL you are redirected to (e.g. <code>.../?code=THIS_PART&...</code>)
                            </p>
                            <input
                                type="text"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                placeholder="Paste code here..."
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-tiktok-pink focus:outline-none mb-3"
                            />
                            <button
                                onClick={handleManualConnect}
                                disabled={connecting || !manualCode}
                                className="w-full py-3 bg-gradient-to-r from-tiktok-cyan to-tiktok-pink text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {connecting ? 'Connecting...' : 'Verify & Connect'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                    >
                        Logout
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-tiktok-dark-card rounded-2xl p-8 mb-8 border border-gray-800">
                    <div className="flex items-center gap-6">
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-2 border-tiktok-cyan"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-tiktok-cyan to-tiktok-pink flex items-center justify-center text-4xl">
                                👤
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                Welcome, {profile.display_name}! 👋
                                {profile.is_verified && <span className="ml-2 text-blue-400">✓</span>}
                            </h2>
                            <p className="text-gray-400 mb-4">
                                {profile.bio_description || 'Your TikTok account is connected and ready to automate'}
                            </p>

                            {/* Discord Linking Status */}
                            <div className="flex items-center gap-3 flex-wrap">
                                {profile.discord_username ? (
                                    <>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#5865F2]/20 border border-[#5865F2]/50 rounded-lg text-[#5865F2]">
                                            <span className="text-lg">👾</span>
                                            <span className="font-medium">Linked as {profile.discord_username}</span>
                                        </div>
                                        <button
                                            onClick={handleUnlinkDiscord}
                                            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 rounded-lg transition-all text-sm"
                                        >
                                            Unlink Discord
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/discord`}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-all font-medium"
                                    >
                                        <span>👾</span>
                                        Link Discord Account
                                    </button>
                                )}
                                <button
                                    onClick={handleUnlinkTikTok}
                                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 rounded-lg transition-all text-sm"
                                >
                                    Unlink TikTok
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        label="Followers"
                        value={profile.follower_count}
                        icon="👥"
                    />
                    <StatCard
                        label="Total Likes"
                        value={profile.likes_count}
                        icon="❤️"
                    />
                    <StatCard
                        label="Videos"
                        value={profile.video_count}
                        icon="🎥"
                    />
                </div>

                {/* Quick Actions */}
                <div className="bg-tiktok-dark-card rounded-2xl p-8 border border-gray-800">
                    <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <ActionButton
                            label="Configure Douyin Source"
                            description="Set the Douyin profile to monitor"
                            onClick={() => window.location.href = '/dashboard/config'}
                        />
                        <ActionButton
                            label="Customize Content"
                            description="Set hashtags and caption templates"
                            onClick={() => window.location.href = '/dashboard/config'}
                        />
                        <ActionButton
                            label="View Analytics"
                            description="Track your growth and performance"
                            onClick={() => window.location.href = '/dashboard/analytics'}
                        />
                        <ActionButton
                            label="Automation Settings"
                            description="Configure posting schedule"
                            onClick={() => window.location.href = '/dashboard/settings'}
                        />
                    </div>
                </div>

                {/* Success Notice */}
                <div className="mt-8 bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-2 text-green-400">✅ Phase 2A Complete!</h4>
                    <p className="text-gray-300">
                        Your TikTok account is now connected with real data from the database.
                        Configuration pages and analytics charts are coming in Phase 2B.
                    </p>
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toLocaleString()
    }

    return (
        <div className="bg-tiktok-dark p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{icon}</span>
                <span className="text-gray-400">{label}</span>
            </div>
            <div className="text-3xl font-bold gradient-text">
                {formatNumber(value)}
            </div>
        </div>
    )
}

function ActionButton({ label, description, onClick }: { label: string; description: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="p-4 bg-tiktok-dark rounded-lg border border-gray-800 hover:border-tiktok-cyan/50 transition-all group text-left"
        >
            <h4 className="font-semibold mb-1 group-hover:text-tiktok-cyan transition-colors">
                {label}
            </h4>
            <p className="text-sm text-gray-400">{description}</p>
        </button>
    )
}
