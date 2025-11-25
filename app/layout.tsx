import './globals.css'
import { Inter } from 'next/font/google'
import MochiMascot from './components/Mochi/MochiMascot'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'DTT - Douyin to TikTok Automation',
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
                {children}
                <MochiMascot autoTalk={true} size="md" />
            </body>
        </html>
    )
}
