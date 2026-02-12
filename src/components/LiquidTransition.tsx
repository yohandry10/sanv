import { motion, AnimatePresence } from 'framer-motion';

interface LiquidTransitionProps {
    onComplete?: () => void;
    isTriggered: boolean;
}

const LiquidTransition = ({ onComplete, isTriggered }: LiquidTransitionProps) => {
    return (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            <svg className="absolute w-0 h-0">
                <defs>
                    <clipPath id="heartIris" clipPathUnits="objectBoundingBox">
                        <path d="M.5.3 C.5.3 .45.2 .35.2 C.25.2 .2.28 .2.4 C.2.6 .5.8 .5.8 C.5.8 .8.6 .8.4 C.8.28 .75.2 .65.2 C.55.2 .5.3 .5.3" />
                    </clipPath>
                    <filter id="prismatic">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
                    </filter>
                </defs>
            </svg>

            <AnimatePresence>
                {isTriggered && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-background z-[100]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 1 }}
                        transition={{ duration: 0.1 }}
                        onAnimationComplete={() => {
                            setTimeout(() => {
                                if (onComplete) onComplete();
                            }, 1000);
                        }}
                    >
                        {/* Progressive Heart Layers */}
                        {[
                            { color: 'hsl(var(--crimson))', delay: 0, scale: 30 },
                            { color: 'hsl(var(--primary))', delay: 0.15, scale: 25 },
                            { color: 'white', delay: 0.3, scale: 20 },
                        ].map((layer, i) => (
                            <motion.div
                                key={i}
                                className="absolute"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    backgroundColor: layer.color,
                                    clipPath: 'url(#heartIris)',
                                    filter: 'url(#prismatic)',
                                    zIndex: 100 - i
                                }}
                                initial={{ scale: 0, rotate: 0 }}
                                animate={{
                                    scale: layer.scale,
                                    rotate: i % 2 === 0 ? [0, 10, 0] : [0, -10, 0]
                                }}
                                transition={{
                                    duration: 1.2,
                                    delay: layer.delay,
                                    ease: [0.76, 0, 0.24, 1]
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LiquidTransition;
