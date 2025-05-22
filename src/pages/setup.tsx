import React from 'react'
import { motion } from 'framer-motion';

function Setup() {
    const seed = Math.floor(Math.random() * 1000);
    const [randomSeed] = React.useState(seed);
    return (
        <motion.div
            className='absolute top-0 left-0 w-full h-full rounded-4xl overflow-hidden'
            initial={{ opacity: 0, scale: 0.92, borderRadius: '32px' }}
            animate={{ opacity: 1, scale: 1, borderRadius: '0px' }}
            exit={{ opacity: 0, scale: 0.92, borderRadius: '32px' }}
            transition={{ duration: 1 }}
            layoutId='setup-page'
        >
            <>
                <motion.div
                    initial={{ opacity: 0, y: 128 }}
                    animate={{ opacity: 0.4, y: 0 }}
                    exit={{ opacity: 0, y: 128 }}
                    transition={{ duration: 4, delay: 1 }}
                    className='absolute top-0 left-0 w-full h-full overflow-hidden opacity-80 dark:opacity-20 bg-(--root-title-background)/60'>
                    <div className='blur-3xl relative pointer-events-none w-full h-full'>
                        {
                            // Generate random properties for each glow and animate with inline styles
                            (() => {
                                const glowCount = Math.floor(3 + Math.random() * 8);
                                return Array.from({ length: glowCount }).map((_, index) => {
                                    // Use the randomSeed to ensure stable randomness per render
                                    const rand = (n: number) => {
                                        // Simple seeded pseudo-random generator
                                        const x = Math.sin(randomSeed + index * 100 + n) * 10000;
                                        return x - Math.floor(x);
                                    };
                                    const left = Math.floor(rand(1) * 48); // 0 to 75%
                                    const width = 12 + Math.floor(rand(2) * 48); // 12 to 35%
                                    const height = 12 + Math.floor(rand(2) * 48); // 12 to 35%
                                    const opacity = 0.15 + rand(3) * 0.75; // 0.15 to 0.9 (more difference)
                                    const duration = 3 + rand(4) * 4; // 3s to 7s (smoother)
                                    const delay = rand(5) * 3; // 0s to 3s (more gap)

                                    return (
                                        <div
                                            key={'backdrop-glow-'+index}
                                            className="glow-effect absolute -bottom-48 bg-red-500 rounded-full blur-3xl pointer-events-none"
                                            style={{
                                                left: `${left}%`,
                                                width: `${width}%`,
                                                height: `${height}%`,
                                                opacity,
                                                transform: `translateY(0vh) translateX(0vw)`,
                                                animation: `glow-move-${index} ${duration}s ease-in-out ${delay}s infinite alternate`
                                            }}
                                        />
                                    );
                                })
                            })()
                        }
                    </div>
                </motion.div>
                <style>
                    {(() => {
                        const glowCount = Math.floor(3 + Math.random() * 8);
                        return Array.from({ length: glowCount }).map((_, index) => {
                            // Use the same seeded random for translateY and translateX
                            const rand = (n: number) => {
                                const x = Math.sin(randomSeed + index * 100 + n) * 10000;
                                return x - Math.floor(x);
                            };
                            const startTranslateY = -18 + rand(6) * 2;
                            const translateY = -18 + rand(6) * 2;
                            const startTranslateX = -24 + rand(7) * 96;
                            const translateX = -24 + rand(7) * 96;
                            return `
                                @keyframes glow-move-${index} {
                                    0% { transform: translateY(${startTranslateY}vh) translateX(${startTranslateX}vw); opacity: ${0.15 + rand(3) * 0.32}; }
                                    100% { transform: translateY(-${translateY}vh) translateX(${translateX}vw); opacity: ${0.32 + rand(3) * 0.96}; }
                                }
                            `;
                        }).join('\n');
                    })()}
                </style>
                <div className='flex flex-col items-center justify-center gap-2 absolute top-[2.4rem] left-0 h-[calc(100%_-_2.4rem)] w-full bg-gradient-to-b to-transparent from-(--root-title-background) backdrop-blur-lg backdrop-saturate-150 p-2'>
                    <h2 className='opacity-60'>👋 Hello there!</h2>
                    <h1 className='text-2xl font-medium flex items-center gap-2'>Let's Setup your experience!</h1>
                </div>
            </>
        </motion.div>
    )
}

export default Setup