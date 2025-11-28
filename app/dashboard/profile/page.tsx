'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BambooLoader from '@/components/BambooLoader';
import { User, LogOut, Shield, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import EditProfileModal from '@/components/EditProfileModal';

interface ProfileData {
    display_name: string;
    avatar: string | null;
    bio_description: string;
    follower_count: number;
    following_count: number;
    likes_count: number;
    is_verified: boolean;
    streak: number;
    username?: string;
}

export default function ProfilePage() {
    const { t } = useLanguage();
    const [profile, setProfile] = useState<ProfileData | null>(null);

    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = () => {
        fetch('/api/user/profile')
            .then(res => res.json())
            .then(data => {
                setProfile(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!loading && profile) {
            // Trigger confetti if user has achievements
            if (profile.streak > 0 || profile.likes_count > 1000) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    }, [loading, profile]);

    const handleLogout = () => {
        window.location.href = '/api/auth/logout';
    };



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <BambooLoader />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-8">{t.dashboard.nav_profile}</h1>

            <div className="grid gap-6">
                {/* Profile Header */}
                <div className="bg-[#1f1f1f] rounded-3xl p-8 border-2 border-white/10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-black border-4 border-[#0A0A0A] overflow-hidden">
                            {profile?.avatar ? (
                                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                profile?.display_name?.charAt(0) || 'U'
                            )}
                        </div>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl font-bold mb-1 flex items-center justify-center md:justify-start gap-2">
                            {profile?.display_name}
                            {profile?.is_verified && <Shield className="w-5 h-5 text-blue-400 fill-blue-400" />}
                        </h2>
                        <div className="mb-4 flex items-center justify-center md:justify-start gap-2">
                            <div className="text-white/40 text-sm flex items-center gap-2">
                                @{profile?.username || 'username'}
                            </div>
                        </div>
                        <p className="text-white/40 mb-4">{profile?.bio_description || 'No bio yet.'}</p>
                        <div className="flex gap-6 justify-center md:justify-start">
                            <Stat label={t.dashboard.followers} value={profile?.follower_count || 0} />
                            <Stat label={t.dashboard.likes} value={profile?.likes_count || 0} />
                            <Stat label="Streak" value={profile?.streak || 0} />
                        </div>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="mt-6 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2 rounded-xl transition-colors"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Achievements / Stats Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-[#1f1f1f] rounded-3xl p-6 border-2 border-white/10">
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                            <Award className="w-6 h-6 text-yellow-400" />
                            Achievements
                        </h3>
                        <div className="space-y-4">
                            <Achievement
                                title="Early Adopter"
                                desc="Joined during beta"
                                active={true}
                            />
                            <Achievement
                                title="Content Machine"
                                desc="Posted 10+ videos"
                                active={(profile?.likes_count || 0) > 1000}
                            />
                            <Achievement
                                title="Streak Master"
                                desc="7 Day Streak"
                                active={(profile?.streak || 0) >= 7}
                            />
                            <Achievement
                                title="Influencer Status"
                                desc="10k+ Followers"
                                active={(profile?.follower_count || 0) >= 10000}
                            />
                        </div>
                    </div>

                    <div className="bg-[#1f1f1f] rounded-3xl p-6 border-2 border-white/10">
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-primary" />
                            Actions
                        </h3>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 border-2 border-transparent hover:border-red-500/50"
                        >
                            <LogOut className="w-5 h-5" />
                            {t.dashboard.logout}
                        </button>
                    </div>
                </div>
            </div>

            {profile && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    currentProfile={{
                        display_name: profile.display_name,
                        username: profile.username || '',
                        bio_description: profile.bio_description,
                        avatar: profile.avatar
                    }}
                    onUpdate={fetchProfile}
                />
            )}
        </div>
    );
}

function Stat({ label, value }: { label: string, value: number }) {
    return (
        <div>
            <div className="font-bold text-xl">{value.toLocaleString()}</div>
            <div className="text-xs text-white/40 uppercase tracking-wider">{label}</div>
        </div>
    );
}

function Achievement({ title, desc, active }: { title: string, desc: string, active: boolean }) {
    return (
        <div className={`flex items-center gap-4 p-3 rounded-xl border-2 ${active ? 'bg-white/5 border-primary/20' : 'bg-black/20 border-transparent opacity-50'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${active ? 'bg-primary text-black' : 'bg-white/10 text-white/20'}`}>
                <Award className="w-6 h-6" />
            </div>
            <div>
                <div className="font-bold">{title}</div>
                <div className="text-sm text-white/40">{desc}</div>
            </div>
        </div>
    );
}
