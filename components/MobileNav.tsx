'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Settings, User } from 'lucide-react';
import { useLanguage } from '../app/context/LanguageContext';

export default function MobileNav() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const navItems = [
        { name: t.dashboard.nav_dashboard, href: '/dashboard', icon: Home },
        { name: t.dashboard.nav_analytics, href: '/dashboard/analytics', icon: BarChart2 },
        { name: t.dashboard.nav_settings, href: '/dashboard/settings', icon: Settings },
        { name: t.dashboard.nav_profile, href: '/dashboard/profile', icon: User },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-white/10 z-[60] pb-safe">
            <div className="flex justify-around items-center h-20">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive ? 'text-primary' : 'text-white/40'
                                }`}
                        >
                            <div className={`p-1 rounded-xl ${isActive ? 'bg-primary/10' : ''}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
