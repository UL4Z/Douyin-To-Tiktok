'use client'

export default function TikTokLoader() {
    return (
        <div className="flex items-center justify-center min-h-[200px]">
            <div className="relative w-16 h-16">
                {/* Orbiting Circle 1 (Cyan) */}
                <div className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-[#00f2ea] to-[#00d4ea] animate-orbit-1"
                    style={{
                        boxShadow: '0 0 15px rgba(0, 242, 234, 0.6)',
                        top: '50%',
                        left: '50%',
                        marginLeft: '-8px',
                        marginTop: '-8px'
                    }}
                />

                {/* Orbiting Circle 2 (Pink) */}
                <div className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-[#ff0050] to-[#ff3366] animate-orbit-2"
                    style={{
                        boxShadow: '0 0 15px rgba(255, 0, 80, 0.6)',
                        top: '50%',
                        left: '50%',
                        marginLeft: '-8px',
                        marginTop: '-8px'
                    }}
                />

                {/* Center dot */}
                <div className="absolute w-2 h-2 rounded-full bg-white/20"
                    style={{
                        top: '50%',
                        left: '50%',
                        marginLeft: '-4px',
                        marginTop: '-4px'
                    }}
                />
            </div>
        </div>
    )
}
