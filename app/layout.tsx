import './globals.css'
import { Nunito, Noto_Sans_SC } from 'next/font/google'
import MochiMascot from './components/Mochi/MochiMascot'
import { LanguageProvider } from './context/LanguageContext'

const nunito = Nunito({ subsets: ['latin'] })
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
            <body className={`${nunito.className} ${notoSansSC.className}`}>
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
