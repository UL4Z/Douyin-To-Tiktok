'use client';

import { motion } from 'framer-motion';

export default function BambooLoader() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-24 flex justify-center items-end">
                {/* Bamboo Stalk */}
                <motion.div
                    className="w-4 bg-green-500 rounded-full absolute bottom-0"
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Segments */}
                    <div className="absolute top-1/4 w-full h-0.5 bg-green-700/30" />
                    <div className="absolute top-2/4 w-full h-0.5 bg-green-700/30" />
                    <div className="absolute top-3/4 w-full h-0.5 bg-green-700/30" />
                </motion.div>

                {/* Leaves */}
                <motion.div
                    className="absolute top-0 left-1/2 w-8 h-8 border-l-4 border-b-4 border-green-400 rounded-bl-full origin-bottom-left"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: -45 }}
                    transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatDelay: 1 }}
                    style={{ marginLeft: '-20px', marginTop: '10px' }}
                />
                <motion.div
                    className="absolute top-4 right-1/2 w-6 h-6 border-r-4 border-b-4 border-green-400 rounded-br-full origin-bottom-right"
                    initial={{ scale: 0, rotate: 45 }}
                    animate={{ scale: 1, rotate: 45 }}
                    transition={{ duration: 0.5, delay: 1.2, repeat: Infinity, repeatDelay: 1 }}
                    style={{ marginRight: '-16px' }}
                />
            </div>
            <p className="text-green-400 font-bold text-sm tracking-widest uppercase animate-pulse">Loading...</p>
        </div>
    );
}
