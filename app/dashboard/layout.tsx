'use client';

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Sidebar />

            <main className="md:ml-64 min-h-screen pb-24 md:pb-0">
                <div className="max-w-4xl mx-auto p-6 md:p-10">
                    {children}
                </div>
            </main>

            <MobileNav />
        </div>
    );
}
