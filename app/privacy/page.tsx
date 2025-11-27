'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <p className="text-white/60 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
                        <p>
                            Welcome to Mochi Mirror! We care about your privacy as much as we care about your content.
                            This policy explains how we handle your data when you use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">2. Information We Collect</h2>
                        <p className="mb-4">We collect minimal information to make Mochi Mirror work for you:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Account Info:</strong> Your name, email, and profile picture from Google/TikTok.</li>
                            <li><strong>Content Data:</strong> Public video metadata needed for synchronization.</li>
                            <li><strong>Usage Data:</strong> How you interact with our dashboard (to make Mochi smarter!).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">3. How We Use Your Data</h2>
                        <p>
                            We use your data solely to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Automate the transfer of your videos.</li>
                            <li>Provide analytics and insights.</li>
                            <li>Improve our services and fix bugs.</li>
                        </ul>
                        <p className="mt-4">
                            We <strong>never</strong> sell your personal data to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">4. Data Security</h2>
                        <p>
                            We use industry-standard encryption to protect your data. Your tokens are stored securely
                            and are only used for the permissions you explicitly grant.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">5. Contact Us</h2>
                        <p>
                            Have questions? Reach out to our team (and Mochi!) at support@mochimirror.com.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
