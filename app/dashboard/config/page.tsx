'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ConfigPage() {
    const [config, setConfig] = useState({
        douyin_url: '',
        rapid_api_key: '',
        hashtags: '',
        caption_template: '{original_title} {no caption}'
    })
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSaving(false)
        alert('Configuration saved!')
    }

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
                    <h1 className="text-3xl font-bold gradient-text">Configuration</h1>
                </div>

                <div className="grid gap-8">
                    {/* Douyin Source */}
                    <div className="bg-tiktok-dark-card p-8 rounded-2xl border border-gray-800">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="text-2xl">🎵</span> Douyin Source
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Douyin Profile URL</label>
                                <input
                                    type="text"
                                    value={config.douyin_url}
                                    onChange={(e) => setConfig({ ...config, douyin_url: e.target.value })}
                                    placeholder="https://www.douyin.com/user/..."
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-tiktok-cyan focus:outline-none transition-colors"
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                Paste the full URL of the Douyin profile you want to mirror.
                            </p>
                        </div>
                    </div>

                    {/* API Settings */}
                    <div className="bg-tiktok-dark-card p-8 rounded-2xl border border-gray-800">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="text-2xl">🔑</span> API Settings
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">RapidAPI Key</label>
                                <input
                                    type="password"
                                    value={config.rapid_api_key}
                                    onChange={(e) => setConfig({ ...config, rapid_api_key: e.target.value })}
                                    placeholder="sk_..."
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-tiktok-cyan focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Settings */}
                    <div className="bg-tiktok-dark-card p-8 rounded-2xl border border-gray-800">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="text-2xl">📝</span> Content Customization
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Hashtags (comma separated)</label>
                                <input
                                    type="text"
                                    value={config.hashtags}
                                    onChange={(e) => setConfig({ ...config, hashtags: e.target.value })}
                                    placeholder="fyp, dance, viral"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-tiktok-cyan focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Caption Template</label>
                                <textarea
                                    value={config.caption_template}
                                    onChange={(e) => setConfig({ ...config, caption_template: e.target.value })}
                                    rows={3}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-tiktok-cyan focus:outline-none transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Available variables: {'{original_title}'}, {'{no caption}'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-8 py-3 bg-gradient-to-r from-tiktok-cyan to-blue-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-tiktok-cyan/20 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
