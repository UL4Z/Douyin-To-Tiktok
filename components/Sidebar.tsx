'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Settings, User, LogOut, Zap } from 'lucide-react';
import { useLanguage } from '../app/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

import StreakCounter from './StreakCounter';
import { useEffect, useState } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        fetch('/api/user/profile')
            .then(res => res.json())
            .then(data => {
                if (data.streak) setStreak(data.streak);
            })
            .catch(err => console.error('Failed to fetch streak:', err));
    }, []);

    const navItems = [
        { name: t.dashboard.nav_dashboard, href: '/dashboard', icon: Home },
        { name: 'Automation', href: '/dashboard/automation', icon: Zap },
        { name: t.dashboard.nav_analytics, href: '/dashboard/analytics', icon: BarChart2 },
        { name: t.dashboard.nav_settings, href: '/dashboard/settings', icon: Settings },
        { name: t.dashboard.nav_profile, href: '/dashboard/profile', icon: User },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/10 bg-[#0A0A0A] z-30">
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <img src="/icon.png" alt="Mochi Mirror Logo" className="w-12 h-12 rounded-xl object-cover" />
                        <span className="font-bold text-xl tracking-tight text-white">Mochi Mirror</span>
                    </Link>
                    <StreakCounter streak={streak} />
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-bold uppercase tracking-wide text-sm ${isActive
                                    ? 'bg-white/10 text-primary border-2 border-primary/50'
                                    : 'text-white/40 hover:bg-white/5 hover:text-white border-2 border-transparent'
                                    }`}
                            >
                                <item.icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-white/10 space-y-4">
                <div className="px-4">
                    <LanguageSwitcher />
                </div>
                <button
                    onClick={() => window.location.href = '/api/auth/logout'}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all w-full font-bold uppercase tracking-wide text-sm"
                >
                    <LogOut className="w-6 h-6" />
                    {t.dashboard.logout}
                </button>
            </div>
        </aside>
    );
}
