import { motion, AnimatePresence } from 'framer-motion';

interface LiquidTransitionProps {
    onComplete?: () => void;
    isTriggered: boolean;
}

const LiquidTransition = ({ onComplete, isTriggered }: LiquidTransitionProps) => {
    const layers = [
        { color: 'hsl(var(--crimson))', delay: 0 },
        { color: 'rgba(255, 245, 245, 0.4)', delay: 0.1, texture: true }, // Peeling layer
        { color: 'hsl(var(--secondary))', delay: 0.2 },
        { color: 'hsl(var(--primary))', delay: 0.3 },
    ];

    const paths = {
        initial: "M 0 100 V 100 Q 50 100 100 100 V 100 z",
        full: "M 0 100 V 0 Q 50 0 100 0 V 100 z",
    };

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            <svg className="absolute w-0 h-0">
                <filter id="inkBleed">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" seed="1" />
                    <feDisplacementMap in="SourceGraphic" scale="25" />
                </filter>
            </svg>

            <AnimatePresence>
                {isTriggered && (
                    <div className="absolute inset-0">
                        {layers.map((layer, i) => (
                            <motion.svg
                                key={i}
                                className="absolute inset-0 w-full h-full"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                style={{
                                    filter: i === 0 ? 'url(#inkBleed)' : 'none',
                                    mixBlendMode: layer.texture ? 'screen' : 'normal'
                                }}
                            >
                                <motion.path
                                    initial={{ d: paths.initial }}
                                    animate={{
                                        d: paths.full,
                                        rotateZ: i % 2 === 0 ? [0, 5, 0] : [0, -5, 0],
                                        scale: [1, 1.05, 1],
                                        x: [0, i * 2, 0]
                                    }}
                                    exit={{ d: paths.initial }}
                                    transition={{
                                        duration: 1.2,
                                        delay: layer.delay,
                                        ease: "easeInOut",
                                    }}
                                    onAnimationComplete={() => {
                                        if (i === layers.length - 1 && onComplete) {
                                            onComplete();
                                        }
                                    }}
                                    fill={layer.color}
                                />
                                {layer.texture && (
                                    <rect width="100" height="100" fill="url(#lacePattern)" opacity="0.1" />
                                )}
                            </motion.svg>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LiquidTransition;
