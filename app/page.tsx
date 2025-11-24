import Link from 'next/link'

export default function Home() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''

    return (
        <main className="min-h-screen">
            {/* Header Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-tiktok-dark/80 backdrop-blur-md border-b border-gray-800">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-xl font-bold gradient-text">
                        Douyin↔TikTok
                    </div>
                    <a
                        href={`${apiUrl}/api/auth/tiktok`}
                        className="px-6 py-2 bg-gradient-to-r from-tiktok-cyan to-tiktok-pink text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-tiktok-cyan/30 transition-all"
                    >
                        Login
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 mt-16">{/* Added mt-16 for header spacing */}
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-6xl font-bold mb-6">
                        <span className="gradient-text">Douyin to TikTok</span>
                        <br />
                        <span className="text-white">Content Bridge</span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Automatically transfer and repurpose your Douyin (抖音) content for English-speaking
                        audiences on TikTok. Seamless automation, customizable branding, zero manual work.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/dashboard"
                            className="px-8 py-4 bg-gradient-to-r from-tiktok-cyan to-blue-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-tiktok-cyan/50 transition-all"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            href="#features"
                            className="px-8 py-4 border-2 border-gray-700 text-white font-semibold rounded-xl hover:border-tiktok-pink transition-all"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <FeatureCard
                        icon="🤖"
                        title="Automated Transfer"
                        description="Monitors your Douyin profile and automatically downloads, optimizes, and publishes to TikTok"
                    />
                    <FeatureCard
                        icon="🎨"
                        title="Brand Consistency"
                        description="Customize captions, hashtags, and posting schedules to maintain your unique brand voice"
                    />
                    <FeatureCard
                        icon="📊"
                        title="Growth Analytics"
                        description="Track your TikTok growth with detailed analytics and performance insights"
                    />
                    <FeatureCard
                        icon="⏰"
                        title="Smart Scheduling"
                        description="Post at optimal times with random, scheduled, or immediate publishing options"
                    />
                    <FeatureCard
                        icon="🌍"
                        title="Global Reach"
                        description="Expand from Chinese to English-speaking markets without manual re-uploading"
                    />
                    <FeatureCard
                        icon="🔐"
                        title="Secure & Private"
                        description="OAuth 2.0 authentication, encrypted tokens, and full data privacy"
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="max-w-3xl mx-auto bg-tiktok-dark-card rounded-2xl p-12 text-center border border-gray-800">
                    <h2 className="text-4xl font-bold mb-4 gradient-text">
                        Ready to Go Global?
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Join creators who are expanding their reach with automated content transfer
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-block px-10 py-4 bg-gradient-to-r from-tiktok-pink to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-tiktok-pink/50 transition-all"
                    >
                        Start Automation Now
                    </Link>
                </div>
            </section>
        </main>
    )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="bg-tiktok-dark-card p-6 rounded-xl border border-gray-800 hover:border-tiktok-cyan/50 transition-all">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    )
}
