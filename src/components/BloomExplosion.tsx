import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BloomExplosionProps {
    isTriggered: boolean;
}

const PARTICLE_COUNT = 150;

const BloomExplosion = ({ isTriggered }: BloomExplosionProps) => {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; vx: number; vy: number; rotation: number; size: number; color: string; type: 'petal' | 'flower' }[]>([]);

    useEffect(() => {
        if (isTriggered) {
            const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#fdfbf7', '#ffd700'];
            const newParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
                const angle = Math.random() * Math.PI * 2;
                const speed = 5 + Math.random() * 20;
                return {
                    id: i,
                    x: 50, // center x
                    y: 50, // center y
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    rotation: Math.random() * 360,
                    size: 10 + Math.random() * 20,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    type: (Math.random() > 0.3 ? 'petal' : 'flower') as 'petal' | 'flower'
                };
            });
            setParticles(newParticles);

            const timer = setTimeout(() => setParticles([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [isTriggered]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[110] overflow-hidden">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute select-none"
                        initial={{
                            x: '50vw',
                            y: '50vh',
                            scale: 0,
                            rotate: 0,
                            opacity: 0
                        }}
                        animate={{
                            x: [`50vw`, `${50 + p.vx * 3}vw`],
                            y: [`50vh`, `${50 + p.vy * 3}vh`],
                            scale: [0, window.innerWidth < 640 ? 1 : 1.5, 0.5],
                            rotate: [0, p.rotation * 2],
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: 2.5,
                            ease: "easeOut"
                        }}
                        style={{
                            color: p.color,
                            fontSize: p.size,
                            filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.1))'
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
                        animate={{ opacity: [0, 0.8, 0] }}
                        transition={{ duration: 1, times: [0, 0.2, 1] }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default BloomExplosion;
