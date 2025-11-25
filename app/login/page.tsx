'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

function LoginForm() {
    const handleGoogleSignIn = async () => {
        await authClient.signIn.social({
            provider: 'google',
            callbackURL: '/dashboard',
        });
    };

    return (
        <div className="bg-surface/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl card-shadow">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold gradient-text mb-2">
                    Get Started Free
                </h1>
                <p className="text-accent-light">
                    Sign in with your Google account to continue
                </p>
            </div>

            <div className="space-y-4">
                {/* Google Sign In */}
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full py-4 bg-white text-gray-800 font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-gray-200"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>
            </div>

            <div className="mt-8 text-center">
                <p className="text-accent-light text-xs">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-secondary via-surface to-secondary text-accent flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-orange-600/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-accent-light hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* Login Card */}
                <Suspense fallback={
                    <div className="bg-surface/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl card-shadow h-[300px] flex items-center justify-center">
                        <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                }>
                    <LoginForm />
                </Suspense>
            </motion.div>
        </main>
    );
}
