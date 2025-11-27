'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
    )
}

function ConfigToggle({ label, description, enabled, onChange }: { label: string, description: string, enabled: boolean, onChange: (val: boolean) => void }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <div>
                <div className="font-bold mb-1">{label}</div>
                <div className="text-xs text-white/40">{description}</div>
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${enabled ? 'bg-bamboo' : 'bg-white/10'
                    }`}
            >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${enabled ? 'left-6' : 'left-1'
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
