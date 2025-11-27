'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center">
                    <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-20 container mx-auto px-6 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <p className="text-white/60 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">1. Acceptance of Terms</h2>
                        <p>
                            By accessing Mochi Mirror, you agree to be bound by these Terms of Service.
                            If you do not agree, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">2. Description of Service</h2>
                        <p>
                            Mochi Mirror provides automation tools to help creators synchronize content between platforms.
                            We are not affiliated with Douyin, TikTok, or ByteDance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">3. User Responsibilities</h2>
                        <p className="mb-4">You are responsible for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Ensuring you own the rights to the content you transfer.</li>
                            <li>Maintaining the security of your account credentials.</li>
                            <li>Complying with the terms of service of connected platforms (TikTok/Douyin).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">4. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your access to Mochi Mirror at our sole discretion,
                            without notice, for conduct that we believe violates these Terms or is harmful to other users.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">5. Disclaimer</h2>
                        <p>
                            Mochi Mirror is provided "as is". We make no warranties regarding the reliability, accuracy,
                            or availability of the service.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
