'use client';

import { useState, Suspense } from "react";
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { t } = useLanguage();

    // Determine mode from URL (default to login)
    const mode = searchParams.get('mode');
    const isSignup = mode === 'signup';

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn("google", { callbackUrl: "/dashboard" });
        } catch (err) {
            console.error("Google sign in error:", err);
            setError("Failed to sign in with Google");
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Mock email auth for now
        setTimeout(() => {
            setIsLoading(false);
            setError("Please use Google Login for now.");
        }, 1000);
    };

    const toggleMode = () => {
        const newMode = isSignup ? 'login' : 'signup';
        router.push(`/login?mode=${newMode}`);
    };

    return (
        <div className="w-full max-w-[400px] mx-auto relative">
            <div className="absolute top-0 right-0">
                <LanguageSwitcher />
            </div>

            {/* Header */}
            <div className="text-center mb-10 pt-12">
                <Link href="/" className="inline-block mb-8">
                    <img src="/icon.png" alt="Mochi Mirror Logo" className="w-16 h-16 rounded-xl object-cover" />
                </Link>
                <h1 className="text-3xl font-bold text-white mb-3">
                    {isSignup ? t.login.create_account : t.login.welcome_back}
                </h1>
                <p className="text-white/40">
                    {isSignup
                        ? t.login.subtitle_signup
                        : t.login.subtitle_login}
                </p>
            </div>

            {/* Social Login (Primary) */}
            <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white text-black font-bold h-14 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all transform active:scale-[0.98] mb-8"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" className="text-[#4285F4]" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="text-[#34A853]" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" className="text-[#FBBC05]" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" className="text-[#EA4335]" />
                        </svg>
                        <span>{t.login.continue_google}</span>
                    </>
                )}
            </button>

            {/* Divider */}
            <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                    <span className="px-4 bg-[#0A0A0A] text-white/20">{t.login.or_email}</span>
                </div>
            </div>

            {/* Email Form (Secondary) */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="email"
                            placeholder={t.login.email_placeholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="password"
                            placeholder={t.login.password_placeholder}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white/5 hover:bg-white/10 text-white font-medium h-12 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    {isSignup ? t.login.btn_signup : t.login.btn_login}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </form>

            {/* Footer */}
            <div className="mt-10 text-center">
                <p className="text-white/40 text-sm">
                    {isSignup ? t.login.footer_signup : t.login.footer_login}{" "}
                    <button
                        onClick={toggleMode}
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                        {isSignup ? t.login.link_login : t.login.link_signup}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
            <Suspense fallback={<div className="text-white/40">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
