import './globals.css'
import { Inter } from 'next/font/google'

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
                <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-tiktok-cyan to-tiktok-pink z-50" />
                {children}
            </body>
        </html>
    )
}
