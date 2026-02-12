import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface BloomExplosionProps {
    isTriggered: boolean;
}

const DESKTOP_PARTICLE_COUNT = 90;
const MOBILE_PARTICLE_COUNT = 36;

const BloomExplosion = ({ isTriggered }: BloomExplosionProps) => {
    const isMobile = useIsMobile();
    const [particles, setParticles] = useState<{ id: number; vx: number; vy: number; rotation: number; size: number; color: string; type: 'petal' | 'flower' }[]>([]);

    useEffect(() => {
        if (isTriggered) {
            const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#fdfbf7', '#ffd700'];
            const particleCount = isMobile ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;
            const maxSpeed = isMobile ? 14 : 18;

            const newParticles = Array.from({ length: particleCount }, (_, i) => {
                const angle = Math.random() * Math.PI * 2;
                const speed = 5 + Math.random() * maxSpeed;
                return {
                    id: i,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    rotation: Math.random() * 360,
                    size: (isMobile ? 9 : 10) + Math.random() * (isMobile ? 12 : 18),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    type: (Math.random() > 0.3 ? 'petal' : 'flower') as 'petal' | 'flower'
                };
            });
            setParticles(newParticles);

            const timer = setTimeout(() => setParticles([]), 2200);
            return () => clearTimeout(timer);
        }
    }, [isTriggered, isMobile]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[110] overflow-hidden">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute select-none"
                        style={{
                            left: '50%',
                            top: '50%',
                            color: p.color,
                            fontSize: p.size,
                            willChange: 'transform, opacity',
                        }}
                        initial={{
                            x: 0,
                            y: 0,
                            scale: 0,
                            rotate: 0,
                            opacity: 0
                        }}
                        animate={{
                            x: [0, p.vx * (isMobile ? 34 : 42)],
                            y: [0, p.vy * (isMobile ? 34 : 42)],
                            scale: [0, isMobile ? 0.9 : 1.25, 0.45],
                            rotate: [0, p.rotation * 2],
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: isMobile ? 1.65 : 1.9,
                            ease: "easeOut"
                        }}
                    >
                        {p.type === 'petal' ? '🌸' : '❀'}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Bloom Flash */}
            <AnimatePresence>
                {isTriggered && (
                    <motion.div
                        className="absolute inset-0 bg-white z-[111]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.55, 0] }}
                        transition={{ duration: 0.7, times: [0, 0.2, 1] }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default BloomExplosion;
