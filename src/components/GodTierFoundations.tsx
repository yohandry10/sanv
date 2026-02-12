import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const GodTierFoundations = ({ children }: { children: React.ReactNode }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring-smoothed values for filters
    const filterX = useSpring(0, { stiffness: 50, damping: 20 });
    const filterY = useSpring(0, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            filterX.set(x);
            filterY.set(y);
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* 1. Paper Physics Filter (Displacement Map) */}
            <svg className="absolute w-0 h-0">
                <filter id="paperDeformation">
                    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
                </filter>

                {/* 2. Caustics Filter (Refraction) */}
                <filter id="causticLens">
                    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turb" />
                    <feDisplacementMap in="SourceGraphic" in2="turb" scale="30" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
                </filter>
            </svg>

            {/* 3. Refractive Caustics Overlay */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-[80] mix-blend-overlay opacity-30"
                style={{
                    background: `radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.2) 100%)`,
                    filter: 'url(#causticLens)',
                    x: useSpring(useTransform(filterX, v => -v * 2)),
                    y: useSpring(useTransform(filterY, v => -v * 2)),
                }}
            />

            {/* Rainbow Sheen (Prismatic caustic) */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-[81] mix-blend-color-dodge opacity-20"
                style={{
                    background: `conic-gradient(from 0deg at 50% 50%, red, yellow, lime, aqua, blue, magenta, red)`,
                    filter: 'blur(100px)',
                    scale: 2,
                    x: useSpring(useTransform(filterX, v => v * 3)),
                    y: useSpring(useTransform(filterY, v => v * 3)),
                }}
            />

            <div className="relative z-10" style={{ filter: 'url(#paperDeformation)' }}>
                {children}
            </div>
        </div>
    );
};

// Helper for useTransform inside the component
import { useTransform } from 'framer-motion';

export default GodTierFoundations;
