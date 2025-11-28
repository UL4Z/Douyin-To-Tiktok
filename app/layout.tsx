import './globals.css'
import { Plus_Jakarta_Sans, Noto_Sans_SC } from 'next/font/google'
import MochiMascot from './components/Mochi/MochiMascot'
import { LanguageProvider } from './context/LanguageContext'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })
const notoSansSC = Noto_Sans_SC({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata = {
    title: 'Mochi Mirror - Douyin to TikTok Automation',
    description: 'Seamlessly transfer your Douyin content to TikTok for English-speaking audiences',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${jakarta.className} ${notoSansSC.className}`}>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var theme = localStorage.getItem('theme');
                                    if (theme === 'light') {
                                        document.documentElement.setAttribute('data-theme', 'light');
                                    }
                                } catch (e) {}
                            })();
                        `,
                    }}
                />
                <LanguageProvider>
                    {children}
                    <MochiMascot autoTalk={true} />
                </LanguageProvider>
            </body>
        </html>
    )
}
