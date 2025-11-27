import './globals.css'
import { Inter } from 'next/font/google'
import MochiMascot from './components/Mochi/MochiMascot'
import { LanguageProvider } from './context/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

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
            <body className={inter.className}>
                <LanguageProvider>
                    {children}
                    <MochiMascot autoTalk={true} />
                </LanguageProvider>
            </body>
        </html>
    )
}
