'use client';

import { useLanguage } from '../app/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <button
            onClick={() => setLanguage(language === 'en' ? 'cn' : 'en')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium text-white/60 hover:text-white"
        >
            <Globe className="w-4 h-4" />
            <span>{language === 'en' ? 'EN' : '中文'}</span>
        </button>
    );
}
